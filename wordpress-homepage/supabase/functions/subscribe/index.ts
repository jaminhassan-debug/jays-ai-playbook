// Email sign-ups for Jay's AI Playbook (free prompt library lead magnet).
// POST  {email, first_name?, consent:true, source?, page?, hp?}  -> stores in public.subscribers, emails the welcome, returns the download link
// GET   ?dl=<token>      -> downloads the free prompt library (.xlsx)
// GET   ?unsub=<token>   -> unsubscribes, then redirects to the site
// Welcome emails go out through Jay's Titan mailbox (secrets TITAN_EMAIL, TITAN_PASSWORD). If those aren't set,
// the sign-up is still stored and the download link is shown on the page; welcome_error records why no email went.
import { createClient } from "jsr:@supabase/supabase-js@2";
import { buildMime, smtpSend, EMAIL_RE, clean } from "./mail.ts";

const SITE = "https://jaysaiplaybook.blog";
const ALLOWED = [SITE, "https://www.jaysaiplaybook.blog"];
const FN_URL = (Deno.env.get("SUPABASE_URL") || "").replace(/\/$/, "") + "/functions/v1/subscribe";
// the file lives in the public repo (free content only), pinned to a commit
const FILE_PATH = "jays-ai-playbook/dd192fdd82517da4bffd1776101fab20cecf5196/wordpress-homepage/downloads/Jays-AI-Playbook-Free-Prompt-Library.xlsx";
const FILE_SRCS = ["https://raw.githubusercontent.com/jaminhassan-debug/" + FILE_PATH, "https://cdn.jsdelivr.net/gh/jaminhassan-debug/" + FILE_PATH.replace("/", "@")];
let fileCache: Uint8Array | null = null;
const FILE = "Jays-AI-Playbook-Free-Prompt-Library.xlsx";
const XLSX = "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet";
const UUID_RE = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;

function cors(origin: string | null) {
  const ok = origin && (ALLOWED.includes(origin) || origin.endsWith(".claudeusercontent.com"));
  return { "Access-Control-Allow-Origin": ok ? origin! : ALLOWED[0], "Access-Control-Allow-Methods": "GET, POST, OPTIONS", "Access-Control-Allow-Headers": "content-type, apikey, authorization, x-client-info", "Vary": "Origin" };
}
async function sha(s: string) {
  const d = await crypto.subtle.digest("SHA-256", new TextEncoder().encode(s));
  return Array.from(new Uint8Array(d)).map((b) => b.toString(16).padStart(2, "0")).join("");
}
// the unsubscribe link carries a signature, so knowing someone's download link isn't enough to unsubscribe them
const unsubSig = async (token: string) => (await sha("unsub|" + token + "|" + (Deno.env.get("SUPABASE_SERVICE_ROLE_KEY") || ""))).slice(0, 24);
const esc = (s: string) => s.replace(/[&<>"']/g, (c) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" }[c]!));

function welcomeHtml(name: string, dl: string, unsub: string) {
  const hi = name ? `Hi ${esc(name)},` : "Hi,";
  const a = (href: string, t: string) => `<a href="${href}" style="color:#1a56db">${t}</a>`;
  return `<div style="max-width:560px;margin:0 auto">
<p><img src="${SITE}/wp-content/uploads/2026/10/email-logo.png" alt="Jay's AI Playbook" width="180" style="display:block;border:0"></p>
<p>${hi}</p>
<p>Thanks for signing up. Here's your free prompt library: 35 copy-ready AI prompts for running a small business, covering customer service, sales, marketing, content, admin, hiring and finance.</p>
<p style="margin:24px 0"><a href="${dl}" style="background:#0b1f3a;color:#ffffff;padding:12px 20px;border-radius:6px;text-decoration:none;font-weight:bold;display:inline-block">Download the prompt library</a></p>
<p><strong>How to use it:</strong> pick a prompt, paste it into ChatGPT, Claude or Gemini, fill in the [square brackets] with your own details, then ask it to tweak anything that isn't quite right.</p>
<p>Three good places to start:</p>
<ul>
<li>${a(SITE + "/2026/11/05/how-to-write-ai-prompts/", "How to write AI prompts that actually work")}</li>
<li>${a(SITE + "/2026/11/05/how-to-use-ai-in-small-business/", "How to use AI in a small business")}</li>
<li>${a(SITE + "/2026/11/05/jays-ai-oracle-free-ai-help/", "Ask Jay's AI Oracle a question, free")}</li>
</ul>
<p>Every week or so I'll send you one practical AI tip you can use straight away. No fluff, and you can unsubscribe in one click whenever you like.</p>
<p>If you'd like help putting AI to work in your own business, ${a(SITE + "/consultation/", "book a free call")} and we'll find where it can save you the most time.</p>
<p>Jay<br>Jay's AI Playbook</p>
<hr style="border:0;border-top:1px solid #ddd;margin:28px 0 12px">
<p style="font-size:12px;color:#666">You're getting this because you asked for the free prompt library at jaysaiplaybook.blog. ${a(unsub, "Unsubscribe")}.</p>
</div>`;
}

async function sendWelcome(sb: any, row: { id: string; email: string; first_name: string | null; token: string }) {
  const user = (Deno.env.get("TITAN_EMAIL") || "").trim(), pass = (Deno.env.get("TITAN_PASSWORD") || "").replace(/^\s*["']?|["']?\s*$/g, "");
  if (!user || !pass) { await sb.from("subscribers").update({ welcome_error: "not-set-up" }).eq("id", row.id); return false; }
  const dl = `${FN_URL}?dl=${row.token}`, unsub = `${FN_URL}?unsub=${row.token}.${await unsubSig(row.token)}`;
  const { data: st } = await sb.from("mail_settings").select("display_name").eq("id", 1).maybeSingle();
  try {
    const { raw } = buildMime({
      from: { name: (st?.display_name || "Jay from Jay's AI Playbook").slice(0, 80), email: user },
      to: [{ name: row.first_name || "", email: row.email }], cc: [],
      subject: "Your free AI prompt library is here", html: welcomeHtml(row.first_name || "", dl, unsub), atts: [],
      extra: [`List-Unsubscribe: <${unsub}>, <mailto:${user}?subject=unsubscribe>`, "List-Unsubscribe-Post: List-Unsubscribe=One-Click"],
    });
    await smtpSend(user, pass, user, [row.email], raw);
    await sb.from("subscribers").update({ welcome_sent_at: new Date().toISOString(), welcome_error: null }).eq("id", row.id);
    return true;
  } catch (e) {
    await sb.from("subscribers").update({ welcome_error: String((e as Error).message || e).slice(0, 300) }).eq("id", row.id);
    return false;
  }
}

Deno.serve(async (req) => {
  const headers = { ...cors(req.headers.get("origin")), "Content-Type": "application/json" };
  const out = (body: unknown, status = 200) => new Response(JSON.stringify(body), { status, headers });
  if (req.method === "OPTIONS") return new Response("ok", { headers });
  const sb = createClient(Deno.env.get("SUPABASE_URL")!, Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!, { auth: { persistSession: false } });
  const url = new URL(req.url);

  // one-click unsubscribe (GET from the email link, POST from mail apps)
  const un = url.searchParams.get("unsub");
  if (un) {
    const [tok, sig] = un.split(".");
    if (UUID_RE.test(tok || "") && sig && sig === await unsubSig(tok)) await sb.from("subscribers").update({ status: "unsubscribed", unsubscribed_at: new Date().toISOString(), updated_at: new Date().toISOString() }).eq("token", tok);
    if (req.method === "POST") return new Response("ok");
    return Response.redirect(SITE + "/?unsubscribed=1", 302);
  }

  // download
  const dl = url.searchParams.get("dl");
  if (req.method === "GET") {
    if (!dl || !UUID_RE.test(dl)) return Response.redirect(SITE + "/free-prompt-library/", 302);
    const { data: row } = await sb.from("subscribers").select("id, downloads").eq("token", dl).maybeSingle();
    if (!row) return Response.redirect(SITE + "/free-prompt-library/", 302);
    await sb.from("subscribers").update({ downloads: (row.downloads || 0) + 1 }).eq("id", row.id);
    for (const src of FILE_SRCS) { if (fileCache) break; try { const r = await fetch(src); if (r.ok) fileCache = new Uint8Array(await r.arrayBuffer()); else console.error("file", src, r.status); } catch (e) { console.error("file", src, String(e)); } }
    if (!fileCache) return out({ error: "file-unavailable" }, 502);
    return new Response(fileCache, { headers: { "Content-Type": XLSX, "Content-Disposition": `attachment; filename="${FILE}"`, "Cache-Control": "private, no-store" } });
  }
  if (req.method !== "POST") return out({ error: "POST only" }, 405);

  let b: any; try { b = await req.json(); } catch { return out({ error: "bad-json" }, 400); }
  if (b.hp) return out({ ok: true }); // honeypot: bots fill the hidden field
  const email = clean(b.email || "").toLowerCase().slice(0, 254);
  const first_name = clean(b.first_name || "").slice(0, 80) || null;
  if (!EMAIL_RE.test(email)) return out({ error: "bad-email" }, 400);
  if (b.consent !== true) return out({ error: "consent" }, 400);
  const consent_text = clean(b.consent_text || "Send me the free prompt library and Jay's AI tips by email. I can unsubscribe at any time.").slice(0, 400);

  const ip = (req.headers.get("x-forwarded-for") || "").split(",")[0].trim();
  const ip_hash = ip ? await sha(ip + "|" + (Deno.env.get("SUPABASE_URL") || "")) : null;
  if (ip_hash) {
    const since = new Date(Date.now() - 3600_000).toISOString();
    const { count } = await sb.from("subscribers").select("id", { count: "exact", head: true }).eq("ip_hash", ip_hash).gte("created_at", since);
    if ((count || 0) >= 5) return out({ error: "slow-down" }, 429);
  }

  const now = new Date().toISOString();
  const { data: existing } = await sb.from("subscribers").select("id, email, first_name, token, welcome_sent_at, status").eq("email", email).maybeSingle();
  let row: any = existing;
  if (existing) {
    const upd: Record<string, unknown> = { updated_at: now, consent: true, consent_text, consent_at: now, status: "active", unsubscribed_at: null };
    if (first_name && !existing.first_name) upd.first_name = first_name;
    await sb.from("subscribers").update(upd).eq("id", existing.id);
    row = { ...existing, first_name: existing.first_name || first_name };
  } else {
    const { data, error } = await sb.from("subscribers").insert({
      email, first_name, consent: true, consent_text, consent_at: now, ip_hash,
      source: clean(b.source || "").slice(0, 60) || null, page: clean(b.page || "").slice(0, 300) || null,
    }).select("id, email, first_name, token, welcome_sent_at").single();
    if (error) { console.error("insert", error.message); return out({ error: "save-failed" }, 500); }
    row = data;
  }

  let emailed = !!row.welcome_sent_at;
  if (!emailed) emailed = await sendWelcome(sb, row);
  return out({ ok: true, emailed, download: `${FN_URL}?dl=${row.token}` });
});
