// Jay's Titan mailbox inside the admin area of jaysaiplaybook.blog.
// Admin only. Talks IMAP (imap.titan.email:993) and SMTP (smtp.titan.email:465) directly.
// Needs Supabase secrets TITAN_EMAIL and TITAN_PASSWORD. Nothing is stored here: mail stays in Titan.
import { createClient } from "jsr:@supabase/supabase-js@2";
import PostalMime from "npm:postal-mime@2.4.4";
import { encodeBase64, decodeBase64 } from "jsr:@std/encoding@1/base64";

const ALLOWED = ["https://jaysaiplaybook.blog", "https://www.jaysaiplaybook.blog"];
const IMAP_HOST = "imap.titan.email", SMTP_HOST = "smtp.titan.email";
const PAGE = 40, MAX_ATTACH = 15 * 1024 * 1024;
const enc = new TextEncoder(), dec = new TextDecoder();

function cors(origin: string | null) {
  const ok = origin && (ALLOWED.includes(origin) || origin.endsWith(".claudeusercontent.com"));
  return { "Access-Control-Allow-Origin": ok ? origin! : ALLOWED[0], "Access-Control-Allow-Methods": "POST, OPTIONS", "Access-Control-Allow-Headers": "content-type, apikey, authorization, x-client-info", "Vary": "Origin" };
}

class MailErr extends Error { constructor(public code: string, msg?: string) { super(msg || code); } }

/* ---------- a buffered TLS line reader shared by IMAP and SMTP ---------- */
class Conn {
  c!: Deno.TlsConn; data = new Uint8Array(1 << 16); start = 0; end = 0;
  async open(host: string, port: number) { this.c = await Deno.connectTls({ hostname: host, port }); }
  private async more() {
    if (this.end === this.data.length) {
      if (this.start > 0) { this.data.copyWithin(0, this.start, this.end); this.end -= this.start; this.start = 0; }
      if (this.end === this.data.length) { const n = new Uint8Array(this.data.length * 2); n.set(this.data.subarray(0, this.end)); this.data = n; }
    }
    const r = await this.c.read(this.data.subarray(this.end));
    if (r === null) throw new MailErr("connection", "The mail server closed the connection.");
    this.end += r;
  }
  async line(): Promise<Uint8Array> {
    let rel = 0;
    for (;;) {
      let i = this.start + rel;
      for (; i < this.end - 1; i++) if (this.data[i] === 13 && this.data[i + 1] === 10) { const l = this.data.slice(this.start, i); this.start = i + 2; return l; }
      rel = Math.max(0, i - this.start);
      await this.more();
    }
  }
  async bytes(n: number) { while (this.end - this.start < n) await this.more(); const b = this.data.slice(this.start, this.start + n); this.start += n; return b; }
  async write(s: string | Uint8Array) { let b = typeof s === "string" ? enc.encode(s) : s; while (b.length) { const n = await this.c.write(b); b = b.subarray(n); } }
  close() { try { this.c.close(); } catch { /* already closed */ } }
}

/* ---------- IMAP ---------- */
type Resp = { text: string; lits: Uint8Array[] };
const q = (s: string) => '"' + s.replace(/[\\"]/g, (m) => "\\" + m) + '"';

class Imap extends Conn {
  tag = 0; caps = ""; selected = ""; lastOk = "";
  async connect(user: string, pass: string) {
    await this.open(IMAP_HOST, 993);
    await this.line();
    try { await this.run("AUTHENTICATE PLAIN " + encodeBase64(enc.encode("\0" + user + "\0" + pass))); }
    catch (e) { throw new MailErr("login-failed", String((e as Error).message)); }
    const r = await this.run("CAPABILITY");
    this.caps = r.map((x) => x.text).join(" ").toUpperCase();
  }
  async resp(): Promise<Resp> {
    let text = ""; const lits: Uint8Array[] = [];
    for (;;) {
      const l = dec.decode(await this.line());
      const m = l.match(/\{(\d+)\+?\}$/);
      if (m) { text += l.slice(0, l.length - m[0].length) + "\u0000" + lits.length + "\u0000"; lits.push(await this.bytes(+m[1])); continue; }
      return { text: text + l, lits };
    }
  }
  async run(command: string, literal?: Uint8Array): Promise<Resp[]> {
    const tag = "A" + (++this.tag);
    if (literal) {
      await this.write(`${tag} ${command} {${literal.length}}\r\n`);
      for (;;) { const l = dec.decode(await this.line()); if (l.startsWith("+")) break; if (l.startsWith(tag + " ")) throw new MailErr("imap", l.slice(tag.length + 1)); }
      await this.write(literal); await this.write("\r\n");
    } else await this.write(`${tag} ${command}\r\n`);
    const out: Resp[] = [];
    for (;;) {
      const r = await this.resp();
      if (r.text.startsWith(tag + " ")) { const st = r.text.slice(tag.length + 1); if (!/^OK/i.test(st)) throw new MailErr("imap", st); this.lastOk = st; return out; }
      out.push(r);
    }
  }
  async select(path: string) { if (this.selected === path) return; await this.run("SELECT " + q(path)); this.selected = path; }
  async logout() { try { await this.run("LOGOUT"); } catch { /* ignore */ } this.close(); }
}

// IMAP folder names use "modified UTF-7".
function utf7dec(s: string) {
  return s.replace(/&([^-]*)-/g, (_, b) => {
    if (!b) return "&";
    const bin = atob(b.replace(/,/g, "/") + "===".slice((b.length + 3) % 4));
    let o = ""; for (let i = 0; i + 1 < bin.length; i += 2) o += String.fromCharCode((bin.charCodeAt(i) << 8) | bin.charCodeAt(i + 1));
    return o;
  });
}
function astring(tok: string, lits: Uint8Array[]) {
  const lm = tok.match(/^\u0000(\d+)\u0000$/); if (lm) return dec.decode(lits[+lm[1]]);
  if (tok.startsWith('"')) return tok.slice(1, -1).replace(/\\(.)/g, "$1");
  return tok;
}

/* ---------- headers ---------- */
function decodeWords(s: string) {
  return s.replace(/=\?([^?]+)\?([bBqQ])\?([^?]*)\?=(\s+(?==\?))?/g, (_, cs, e, t) => {
    try {
      let bytes: Uint8Array;
      if (e.toUpperCase() === "B") bytes = decodeBase64(t);
      else { const a: number[] = []; const s2 = t.replace(/_/g, " "); for (let i = 0; i < s2.length; i++) { if (s2[i] === "=" && /^[0-9A-Fa-f]{2}$/.test(s2.slice(i + 1, i + 3))) { a.push(parseInt(s2.slice(i + 1, i + 3), 16)); i += 2; } else a.push(s2.charCodeAt(i)); } bytes = new Uint8Array(a); }
      return new TextDecoder(cs.toLowerCase().replace(/\*.*/, "")).decode(bytes);
    } catch { return t; }
  });
}
function parseHeaders(raw: Uint8Array) {
  const txt = new TextDecoder("utf-8").decode(raw).replace(/\r\n[ \t]+/g, " ");
  const h: Record<string, string> = {};
  for (const line of txt.split(/\r?\n/)) { const i = line.indexOf(":"); if (i > 0) { const k = line.slice(0, i).trim().toLowerCase(); if (!(k in h)) h[k] = decodeWords(line.slice(i + 1).trim()); } }
  return h;
}
function splitAddrs(s: string) {
  const out: { name: string; email: string }[] = []; let cur = "", inq = false, ang = 0;
  for (const ch of s || "") { if (ch === '"') inq = !inq; if (!inq && ch === "<") ang++; if (!inq && ch === ">") ang--; if (ch === "," && !inq && ang <= 0) { cur.trim() && out.push(addr(cur)); cur = ""; } else cur += ch; }
  if (cur.trim()) out.push(addr(cur));
  return out;
}
function addr(s: string) {
  const m = s.match(/^\s*(.*?)\s*<([^>]+)>\s*$/);
  if (m) return { name: m[1].replace(/^"|"$/g, "").replace(/\\(.)/g, "$1").trim(), email: m[2].trim() };
  return { name: "", email: s.trim().replace(/^"|"$/g, "") };
}

/* ---------- SMTP and building the message ---------- */
const b64lines = (b: Uint8Array) => encodeBase64(b).replace(/.{76}/g, "$&\r\n");
const clean = (s: string) => String(s || "").replace(/[\r\n]+/g, " ").trim();
function word(s: string) {
  s = clean(s);
  if (/^[\x20-\x7e]*$/.test(s)) return s;
  const parts: string[] = []; let cur = "";
  for (const ch of s) { if (enc.encode(cur + ch).length > 45) { parts.push(cur); cur = ""; } cur += ch; }
  if (cur) parts.push(cur);
  return parts.map((p) => "=?UTF-8?B?" + encodeBase64(enc.encode(p)) + "?=").join("\r\n ");
}
const EMAIL_RE = /^[^\s@<>(),;:"\[\]\\]+@[^\s@<>(),;:"\[\]\\]+\.[^\s@<>(),;:"\[\]\\]+$/;
function fmtAddr(a: { name?: string; email: string }) {
  const n = clean(a.name || "");
  if (!n) return a.email;
  return /^[\x20-\x7e]*$/.test(n) ? `"${n.replace(/["\\]/g, "")}" <${a.email}>` : `${word(n)} <${a.email}>`;
}
function htmlToText(html: string) {
  return html.replace(/<(style|script)[\s\S]*?<\/\1>/gi, "").replace(/<br\s*\/?>/gi, "\n").replace(/<\/(p|div|h\d|li|tr|blockquote)>/gi, "\n").replace(/<li[^>]*>/gi, "• ")
    .replace(/<a [^>]*href="([^"]+)"[^>]*>([\s\S]*?)<\/a>/gi, (_, h, t) => (t.replace(/<[^>]+>/g, "").trim() === h ? h : `${t} (${h})`))
    .replace(/<[^>]+>/g, "").replace(/&nbsp;/g, " ").replace(/&lt;/g, "<").replace(/&gt;/g, ">").replace(/&quot;/g, '"').replace(/&#39;/g, "'").replace(/&amp;/g, "&")
    .replace(/[ \t]+\n/g, "\n").replace(/\n{3,}/g, "\n\n").trim();
}
type Att = { filename: string; mime: string; data: Uint8Array };
function buildMime(o: { from: { name: string; email: string }; to: { name?: string; email: string }[]; cc: { name?: string; email: string }[]; subject: string; html: string; inReplyTo?: string; references?: string; atts: Att[]; draft?: boolean }) {
  const id = `<${crypto.randomUUID()}@${o.from.email.split("@")[1]}>`;
  const bnd = () => "=_jap_" + crypto.randomUUID().replace(/-/g, "");
  const h: string[] = [
    "From: " + fmtAddr(o.from),
    o.to.length ? "To: " + o.to.map(fmtAddr).join(", ") : "",
    o.cc.length ? "Cc: " + o.cc.map(fmtAddr).join(", ") : "",
    "Subject: " + word(o.subject),
    "Date: " + new Date().toUTCString().replace("GMT", "+0000"),
    "Message-ID: " + id,
    o.inReplyTo ? "In-Reply-To: " + clean(o.inReplyTo) : "",
    o.references ? "References: " + clean(o.references) : "",
    "MIME-Version: 1.0",
  ].filter(Boolean);
  const html = `<!doctype html><html><head><meta charset="utf-8"></head><body style="font-family:Arial,Helvetica,sans-serif;font-size:15px;line-height:1.5;color:#111">${o.html}</body></html>`;
  const alt = bnd();
  const altPart = `Content-Type: multipart/alternative; boundary="${alt}"\r\n\r\n--${alt}\r\nContent-Type: text/plain; charset=utf-8\r\nContent-Transfer-Encoding: base64\r\n\r\n${b64lines(enc.encode(htmlToText(o.html)))}\r\n--${alt}\r\nContent-Type: text/html; charset=utf-8\r\nContent-Transfer-Encoding: base64\r\n\r\n${b64lines(enc.encode(html))}\r\n--${alt}--\r\n`;
  let body: string;
  if (!o.atts.length) body = h.join("\r\n") + "\r\n" + altPart;
  else {
    const mix = bnd();
    body = h.join("\r\n") + `\r\nContent-Type: multipart/mixed; boundary="${mix}"\r\n\r\n--${mix}\r\n` + altPart;
    for (const a of o.atts) {
      const fn = clean(a.filename).replace(/["\\]/g, "") || "attachment";
      const fnH = /^[\x20-\x7e]*$/.test(fn) ? `"${fn}"` : `"${word(fn)}"`;
      body += `--${mix}\r\nContent-Type: ${clean(a.mime) || "application/octet-stream"}; name=${fnH}\r\nContent-Disposition: attachment; filename=${fnH}\r\nContent-Transfer-Encoding: base64\r\n\r\n${b64lines(a.data)}\r\n`;
    }
    body += `--${mix}--\r\n`;
  }
  return { raw: enc.encode(body), id };
}
async function smtpSend(user: string, pass: string, from: string, rcpts: string[], raw: Uint8Array) {
  const c = new Conn(); await c.open(SMTP_HOST, 465);
  const expect = async (ok: number[]) => {
    for (;;) { const l = dec.decode(await c.line()); if (l.length < 4 || l[3] !== "-") { if (!ok.includes(parseInt(l.slice(0, 3)))) throw new MailErr(l.startsWith("535") ? "login-failed" : "smtp", l); return l; } }
  };
  try {
    await expect([220]);
    await c.write("EHLO jaysaiplaybook.blog\r\n"); await expect([250]);
    await c.write("AUTH PLAIN " + encodeBase64(enc.encode("\0" + user + "\0" + pass)) + "\r\n"); await expect([235]);
    await c.write(`MAIL FROM:<${from}>\r\n`); await expect([250]);
    for (const r of rcpts) { await c.write(`RCPT TO:<${r}>\r\n`); await expect([250, 251]); }
    await c.write("DATA\r\n"); await expect([354]);
    const txt = dec.decode(raw).replace(/\r?\n/g, "\r\n").replace(/^\./gm, "..");
    await c.write(txt + (txt.endsWith("\r\n") ? "" : "\r\n") + ".\r\n"); await expect([250]);
    await c.write("QUIT\r\n");
  } finally { c.close(); }
}

/* ---------- making received HTML safe to show ---------- */
function tidyHtml(html: string) {
  return html.replace(/<(script|iframe|object|embed|form|frameset|frame|applet)[\s\S]*?(<\/\1\s*>|$)/gi, "")
    .replace(/<(meta|base|link|input|button|textarea|select)\b[^>]*>/gi, "")
    .replace(/\son[a-z]+\s*=\s*("[^"]*"|'[^']*'|[^\s>]+)/gi, "")
    .replace(/(href|src)\s*=\s*("|')\s*javascript:[^"']*\2/gi, '$1="#"');
}

/* ---------- folders ---------- */
type Folder = { path: string; name: string; role: string; total?: number; unread?: number };
async function listFolders(im: Imap, counts = true): Promise<Folder[]> {
  const r = await im.run('LIST "" "*"');
  const out: Folder[] = [];
  for (const x of r) {
    const m = x.text.match(/^\* LIST \(([^)]*)\) (?:"(?:[^"\\]|\\.)*"|NIL) (.+)$/i); if (!m) continue;
    const flags = m[1].toLowerCase(); if (flags.includes("\\noselect") || flags.includes("\\nonexistent")) continue;
    const path = astring(m[2].trim(), x.lits), low = path.toLowerCase();
    const role = low === "inbox" ? "inbox" : flags.includes("\\sent") || /^sent/.test(low) ? "sent" : flags.includes("\\drafts") || /^drafts?$/.test(low) ? "drafts"
      : flags.includes("\\trash") || /^(trash|deleted)/.test(low) ? "trash" : flags.includes("\\junk") || /^(spam|junk)/.test(low) ? "spam" : flags.includes("\\archive") || /^archive/.test(low) ? "archive" : "";
    out.push({ path, name: path.toLowerCase() === "inbox" ? "Inbox" : utf7dec(path), role });
  }
  const order = ["inbox", "drafts", "sent", "archive", "spam", "trash", ""];
  out.sort((a, b) => order.indexOf(a.role) - order.indexOf(b.role) || a.name.localeCompare(b.name));
  if (counts) for (const f of out) {
    try { const s = await im.run("STATUS " + q(f.path) + " (MESSAGES UNSEEN)"); const t = s.map((z) => z.text).join(" "); f.total = +(t.match(/MESSAGES (\d+)/i)?.[1] || 0); f.unread = +(t.match(/UNSEEN (\d+)/i)?.[1] || 0); } catch { /* skip */ }
  }
  return out;
}
const roleOf = async (im: Imap, role: string) => (await listFolders(im, false)).find((f) => f.role === role)?.path;

/* ---------- message list ---------- */
async function listMessages(im: Imap, path: string, opts: { q?: string; filter?: string; page?: number }) {
  await im.select(path);
  const crit: string[] = [];
  if (opts.filter === "unread") crit.push("UNSEEN");
  if (opts.filter === "starred") crit.push("FLAGGED");
  if (opts.filter === "attachments") crit.push('HEADER Content-Type "multipart/mixed"');
  let r: Resp[];
  const term = (opts.q || "").replace(/[\r\n]/g, " ").trim().slice(0, 100);
  if (term) r = await im.run("UID SEARCH CHARSET UTF-8 " + (crit.length ? crit.join(" ") + " " : "") + "TEXT", enc.encode(term));
  else r = await im.run("UID SEARCH " + (crit.length ? crit.join(" ") : "ALL"));
  const uids = r.filter((x) => /^\* SEARCH/i.test(x.text)).flatMap((x) => x.text.replace(/^\* SEARCH/i, "").trim().split(/\s+/)).filter(Boolean).map(Number).sort((a, b) => b - a);
  const page = Math.max(0, opts.page || 0), slice = uids.slice(page * PAGE, page * PAGE + PAGE);
  const items: unknown[] = [];
  if (slice.length) {
    const f = await im.run(`UID FETCH ${slice.join(",")} (UID FLAGS INTERNALDATE RFC822.SIZE BODY.PEEK[HEADER.FIELDS (FROM TO CC SUBJECT DATE CONTENT-TYPE)])`);
    for (const x of f) {
      if (!/^\* \d+ FETCH/i.test(x.text)) continue;
      const uid = +(x.text.match(/UID (\d+)/i)?.[1] || 0); if (!uid) continue;
      const flags = (x.text.match(/FLAGS \(([^)]*)\)/i)?.[1] || "").toLowerCase();
      const h = x.lits.length ? parseHeaders(x.lits[x.lits.length - 1]) : {};
      items.push({
        uid, seen: flags.includes("\\seen"), starred: flags.includes("\\flagged"), answered: flags.includes("\\answered"),
        date: x.text.match(/INTERNALDATE "([^"]+)"/i)?.[1] || h.date || "", size: +(x.text.match(/RFC822\.SIZE (\d+)/i)?.[1] || 0),
        from: splitAddrs(h.from || "")[0] || null, to: splitAddrs(h.to || ""), subject: h.subject || "", attach: /multipart\/(mixed|related)/i.test(h["content-type"] || ""),
      });
    }
    items.sort((a: any, b: any) => b.uid - a.uid);
  }
  return { total: uids.length, page, pages: Math.ceil(uids.length / PAGE), items };
}

async function fetchRaw(im: Imap, path: string, uid: number) {
  await im.select(path);
  const f = await im.run(`UID FETCH ${uid} (UID FLAGS BODY.PEEK[])`);
  const x = f.find((z) => /^\* \d+ FETCH/i.test(z.text) && z.lits.length);
  if (!x) throw new MailErr("not-found", "That email couldn't be found. It may have been moved.");
  return { raw: x.lits[x.lits.length - 1], flags: (x.text.match(/FLAGS \(([^)]*)\)/i)?.[1] || "").toLowerCase() };
}
const parse = (raw: Uint8Array) => PostalMime.parse(raw, { attachmentEncoding: "arraybuffer" } as any) as Promise<any>;
const toU8 = (c: unknown) => c instanceof ArrayBuffer ? new Uint8Array(c) : typeof c === "string" ? enc.encode(c) : (c as Uint8Array);

async function readMessage(im: Imap, path: string, uid: number, markRead: boolean) {
  const { raw, flags } = await fetchRaw(im, path, uid);
  const m = await parse(raw);
  let html = m.html ? tidyHtml(m.html) : "";
  const atts: unknown[] = [];
  (m.attachments || []).forEach((a: any, i: number) => {
    const data = toU8(a.content), cid = (a.contentId || "").replace(/^<|>$/g, "");
    if (cid && html.includes("cid:" + cid) && data.length < 2_000_000 && /^image\//.test(a.mimeType)) { html = html.split("cid:" + cid).join(`data:${a.mimeType};base64,${encodeBase64(data)}`); return; }
    atts.push({ i, filename: a.filename || "attachment", mime: a.mimeType || "application/octet-stream", size: data.length });
  });
  if (markRead && !flags.includes("\\seen")) await im.run(`UID STORE ${uid} +FLAGS.SILENT (\\Seen)`).catch(() => {});
  const ad = (x: any) => x ? (x.group ? x.group.map((g: any) => ({ name: g.name || "", email: g.address || "" })) : [{ name: x.name || "", email: x.address || "" }]) : [];
  const many = (xs: any[]) => (xs || []).flatMap(ad);
  return {
    uid, folder: path, seen: true, starred: flags.includes("\\flagged"), answered: flags.includes("\\answered"),
    from: ad(m.from)[0] || null, to: many(m.to), cc: many(m.cc), replyTo: many(m.replyTo), subject: m.subject || "", date: m.date || "",
    messageId: m.messageId || "", references: [m.references, m.messageId].filter(Boolean).join(" "), html, text: m.text || "", attachments: atts,
  };
}

async function setFlag(im: Imap, path: string, uids: number[], flag: string, on: boolean) {
  await im.select(path); await im.run(`UID STORE ${uids.join(",")} ${on ? "+" : "-"}FLAGS.SILENT (${flag})`);
}
async function moveTo(im: Imap, path: string, uids: number[], dest: string) {
  await im.select(path);
  if (im.caps.includes("MOVE")) { await im.run(`UID MOVE ${uids.join(",")} ${q(dest)}`); return; }
  await im.run(`UID COPY ${uids.join(",")} ${q(dest)}`);
  await expunge(im, uids);
}
async function expunge(im: Imap, uids: number[]) {
  await im.run(`UID STORE ${uids.join(",")} +FLAGS.SILENT (\\Deleted)`);
  if (im.caps.includes("UIDPLUS")) await im.run(`UID EXPUNGE ${uids.join(",")}`); else await im.run("EXPUNGE");
}
async function appendTo(im: Imap, path: string, flags: string, raw: Uint8Array) {
  im.selected = ""; await im.run(`APPEND ${q(path)} (${flags})`, raw);
  return Number(im.lastOk.match(/APPENDUID \d+ (\d+)/i)?.[1] || 0) || null;
}

/* ---------- the endpoint ---------- */
Deno.serve(async (req) => {
  const headers = { ...cors(req.headers.get("origin")), "Content-Type": "application/json" };
  const out = (body: unknown, status = 200) => new Response(JSON.stringify(body), { status, headers });
  if (req.method === "OPTIONS") return new Response("ok", { headers });
  if (req.method !== "POST") return out({ error: "POST only" }, 405);

  const sb = createClient(Deno.env.get("SUPABASE_URL")!, Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!, { auth: { persistSession: false } });
  const token = (req.headers.get("authorization") || "").replace(/^Bearer\s+/i, "");
  const { data: u } = await sb.auth.getUser(token);
  if (!u?.user) return out({ error: "sign-in" }, 401);
  const { data: isAdmin } = await sb.rpc("user_is_admin", { p_user: u.user.id });
  if (isAdmin !== true) return out({ error: "admin-only" }, 403);

  const user = (Deno.env.get("TITAN_EMAIL") || "").trim(), pass = (Deno.env.get("TITAN_PASSWORD") || "").replace(/^\s*["']?|["']?\s*$/g, "");
  if (!user || !pass) return out({ error: "not-set-up" }, 503);

  let b: any; try { b = await req.json(); } catch { return out({ error: "bad json" }, 400); }
  const act = String(b.action || ""), folder = String(b.folder || "INBOX");
  const uids: number[] = (Array.isArray(b.uids) ? b.uids : [b.uid]).map(Number).filter((n: number) => Number.isInteger(n) && n > 0).slice(0, 200);

  const im = new Imap();
  const timer = setTimeout(() => im.close(), 60_000);
  try {
    await im.connect(user, pass);
    switch (act) {
      case "folders": return out({ email: user, folders: await listFolders(im) });
      case "list": return out(await listMessages(im, folder, { q: b.q, filter: b.filter, page: b.page }));
      case "read": if (!uids.length) return out({ error: "uid" }, 400); return out(await readMessage(im, folder, uids[0], b.markRead !== false));
      case "attachment": {
        const { raw } = await fetchRaw(im, folder, uids[0]); const m = await parse(raw); const a = (m.attachments || [])[Number(b.index)];
        if (!a) return out({ error: "not-found" }, 404);
        return out({ filename: a.filename || "attachment", mime: a.mimeType || "application/octet-stream", b64: encodeBase64(toU8(a.content)) });
      }
      case "flag": {
        if (!uids.length) return out({ error: "uid" }, 400);
        const flag = ({ seen: "\\Seen", starred: "\\Flagged" } as Record<string, string>)[b.flag]; if (!flag) return out({ error: "flag" }, 400);
        await setFlag(im, folder, uids, flag, !!b.on); return out({ ok: true });
      }
      case "move": {
        if (!uids.length || !b.to) return out({ error: "uid" }, 400);
        await moveTo(im, folder, uids, String(b.to)); return out({ ok: true });
      }
      case "delete": {
        if (!uids.length) return out({ error: "uid" }, 400);
        const trash = await roleOf(im, "trash");
        if (!trash || trash === folder || b.forever) { await im.select(folder); await expunge(im, uids); return out({ ok: true, forever: true }); }
        await moveTo(im, folder, uids, trash); return out({ ok: true });
      }
      case "send": case "draft": {
        const pick = (xs: unknown) => (Array.isArray(xs) ? xs : []).slice(0, 50).map((x: any) => ({ name: clean(x?.name || ""), email: clean(x?.email || "").toLowerCase() })).filter((x) => x.email);
        const to = pick(b.to), cc = pick(b.cc), bcc = pick(b.bcc);
        const bad = [...to, ...cc, ...bcc].find((x) => !EMAIL_RE.test(x.email));
        if (bad) return out({ error: "bad-address", address: bad.email }, 400);
        if (act === "send" && !to.length && !cc.length && !bcc.length) return out({ error: "no-recipients" }, 400);
        const atts: Att[] = []; let total = 0;
        for (const a of (Array.isArray(b.attachments) ? b.attachments : []).slice(0, 20)) { const d = decodeBase64(String(a.b64 || "")); total += d.length; atts.push({ filename: String(a.filename || "attachment"), mime: String(a.mime || ""), data: d }); }
        if (b.forward && b.forward.uid) {
          const { raw } = await fetchRaw(im, String(b.forward.folder || "INBOX"), Number(b.forward.uid)); const m = await parse(raw);
          for (const a of m.attachments || []) { if (a.disposition === "inline" && a.contentId) continue; const d = toU8(a.content); total += d.length; atts.push({ filename: a.filename || "attachment", mime: a.mimeType, data: d }); }
        }
        if (total > MAX_ATTACH) return out({ error: "too-big" }, 413);
        const { data: st } = await sb.from("mail_settings").select("display_name").eq("id", 1).maybeSingle();
        const from = { name: (st?.display_name || "Jay").slice(0, 80), email: user };
        const { raw, id } = buildMime({ from, to, cc, subject: String(b.subject || "").slice(0, 300), html: String(b.html || "").slice(0, 500_000), inReplyTo: b.inReplyTo, references: b.references, atts });
        if (act === "draft") {
          const drafts = await roleOf(im, "drafts"); if (!drafts) return out({ error: "no-drafts-folder" }, 500);
          const newUid = await appendTo(im, drafts, "\\Draft \\Seen", raw);
          if (b.draftUid) { await im.select(drafts); await expunge(im, [Number(b.draftUid)]).catch(() => {}); }
          return out({ ok: true, saved: true, uid: newUid });
        }
        await smtpSend(user, pass, user, [...to, ...cc, ...bcc].map((x) => x.email), raw);
        const notes: string[] = [];
        const sent = await roleOf(im, "sent");
        if (sent && b.saveSent !== false) await appendTo(im, sent, "\\Seen", raw).catch((e) => notes.push("sent-copy: " + e.message));
        if (b.replyOf && b.replyOf.uid) await setFlag(im, String(b.replyOf.folder || "INBOX"), [Number(b.replyOf.uid)], "\\Answered", true).catch(() => {});
        if (b.draftUid) { const drafts = await roleOf(im, "drafts"); if (drafts) { await im.select(drafts); await expunge(im, [Number(b.draftUid)]).catch(() => {}); } }
        return out({ ok: true, messageId: id, notes });
      }
      default: return out({ error: "action" }, 400);
    }
  } catch (e) {
    const err = e as MailErr;
    console.error("mail", act, err.code || "", String(err.message).slice(0, 300));
    if (err.code === "login-failed") return out({ error: "login-failed" }, 502);
    if (err.code === "not-found") return out({ error: "not-found", message: err.message }, 404);
    return out({ error: "mail", message: String(err.message || e).slice(0, 200) }, 502);
  } finally { clearTimeout(timer); await im.logout(); }
});
