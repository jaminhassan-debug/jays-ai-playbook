import { encodeBase64 } from "jsr:@std/encoding@1/base64";
const SMTP_HOST = "smtp.titan.email";
const enc = new TextEncoder(), dec = new TextDecoder();
export class MailErr extends Error { constructor(public code: string, msg?: string) { super(msg || code); } }
// Copied from admin-mail (Titan SMTP over TLS).
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
  async write(s: string | Uint8Array) { let b = typeof s === "string" ? enc.encode(s) : s; while (b.length) { const n = await this.c.write(b); b = b.subarray(n); } }
  close() { try { this.c.close(); } catch { /* already closed */ } }
}
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
function buildMime(o: { from: { name: string; email: string }; to: { name?: string; email: string }[]; cc: { name?: string; email: string }[]; subject: string; html: string; atts: Att[]; extra?: string[] }) {
  const id = `<${crypto.randomUUID()}@${o.from.email.split("@")[1]}>`;
  const bnd = () => "=_jap_" + crypto.randomUUID().replace(/-/g, "");
  const h: string[] = [
    "From: " + fmtAddr(o.from),
    o.to.length ? "To: " + o.to.map(fmtAddr).join(", ") : "",
    o.cc.length ? "Cc: " + o.cc.map(fmtAddr).join(", ") : "",
    "Subject: " + word(o.subject),
    "Date: " + new Date().toUTCString().replace("GMT", "+0000"),
    "Message-ID: " + id,
    ...(o.extra || []).map(clean),
    "MIME-Version: 1.0",
  ].filter(Boolean);
  const html = `<!doctype html><html><head><meta charset="utf-8"></head><body style="font-family:Arial,Helvetica,sans-serif;font-size:15px;line-height:1.5;color:#111">${o.html}</body></html>`;
  const alt = bnd();
  const altPart = `Content-Type: multipart/alternative; boundary="${alt}"\r\n\r\n--${alt}\r\nContent-Type: text/plain; charset=utf-8\r\nContent-Transfer-Encoding: base64\r\n\r\n${b64lines(enc.encode(htmlToText(o.html)))}\r\n--${alt}\r\nContent-Type: text/html; charset=utf-8\r\nContent-Transfer-Encoding: base64\r\n\r\n${b64lines(enc.encode(html))}\r\n--${alt}--\r\n`;
  const body = h.join("\r\n") + "\r\n" + altPart;
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

export { buildMime, smtpSend, EMAIL_RE, clean };
