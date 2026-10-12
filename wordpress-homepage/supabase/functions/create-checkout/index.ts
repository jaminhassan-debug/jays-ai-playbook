// Starts a Stripe Checkout for one Playbook. Prices come from the database, never from the browser.
// Nothing can be sold until STRIPE_SECRET_KEY is set AND the playbook's status is 'live'.
import { createClient } from "jsr:@supabase/supabase-js@2";

const SITE = "https://jaysaiplaybook.blog";
const ALLOWED = [SITE, "https://www.jaysaiplaybook.blog"];

function cors(origin: string | null) {
  const ok = origin && (ALLOWED.includes(origin) || origin.endsWith(".claudeusercontent.com"));
  return {
    "Access-Control-Allow-Origin": ok ? origin! : SITE,
    "Access-Control-Allow-Methods": "POST, OPTIONS",
    "Access-Control-Allow-Headers": "content-type, apikey, authorization, x-client-info",
    "Vary": "Origin",
  };
}

Deno.serve(async (req) => {
  const headers = { ...cors(req.headers.get("origin")), "Content-Type": "application/json" };
  const out = (body: unknown, status = 200) => new Response(JSON.stringify(body), { status, headers });
  if (req.method === "OPTIONS") return new Response("ok", { headers });
  if (req.method !== "POST") return out({ error: "POST only" }, 405);

  const key = (Deno.env.get("STRIPE_SECRET_KEY") || "").trim().replace(/^["']|["']$/g, "");
  if (!key) return out({ error: "checkout-not-ready" }, 503);

  let body: { slug?: string };
  try { body = await req.json(); } catch { return out({ error: "bad json" }, 400); }
  const slug = String(body.slug || "").slice(0, 80);
  if (!/^[a-z0-9-]+$/.test(slug)) return out({ error: "bad slug" }, 400);

  const sb = createClient(Deno.env.get("SUPABASE_URL")!, Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!, { auth: { persistSession: false } });

  // Optional: a signed-in member, so the pack lands on their existing account
  let userId = "", email = "";
  const token = (req.headers.get("authorization") || "").replace(/^Bearer\s+/i, "");
  if (token && token.split(".").length === 3) {
    const { data } = await sb.auth.getUser(token);
    if (data?.user) { userId = data.user.id; email = data.user.email || ""; }
  }

  const { data: pb } = await sb.from("playbooks").select("slug,title,tagline,price_pence,status,industry").eq("slug", slug).maybeSingle();
  if (!pb || pb.status !== "live") return out({ error: "not-on-sale" }, 404);
  if (userId) {
    const { data: own } = await sb.from("playbook_purchases").select("playbook_slug").eq("user_id", userId).eq("playbook_slug", slug).maybeSingle();
    if (own) return out({ url: SITE + "/members/#playbooks", owned: true });
  }

  const f = new URLSearchParams();
  f.set("mode", "payment");
  f.set("line_items[0][quantity]", "1");
  f.set("line_items[0][price_data][currency]", "gbp");
  f.set("line_items[0][price_data][unit_amount]", String(pb.price_pence));
  f.set("line_items[0][price_data][product_data][name]", pb.title);
  if (pb.tagline) f.set("line_items[0][price_data][product_data][description]", pb.tagline.slice(0, 300));
  f.set("metadata[playbook_slug]", slug);
  if (userId) f.set("metadata[user_id]", userId);
  f.set("payment_intent_data[metadata][playbook_slug]", slug);
  if (email) f.set("customer_email", email);
  f.set("allow_promotion_codes", "true");
  f.set("success_url", SITE + "/members/?bought=" + slug + "#playbooks");
  f.set("cancel_url", SITE + "/playbooks/?industry=" + encodeURIComponent(pb.industry));
  f.set("custom_text[submit][message]", "You'll get the pack straight away in your members area. By paying, you're asking for instant access to digital content. If it isn't useful, email jay@jaysaiplaybook.blog within 14 days for a full refund.");

  const r = await fetch("https://api.stripe.com/v1/checkout/sessions", {
    method: "POST",
    headers: { Authorization: "Bearer " + key, "Content-Type": "application/x-www-form-urlencoded" },
    body: f,
  });
  const s = await r.json();
  if (!r.ok || !s.url) { console.error("stripe", r.status, s?.error?.message); return out({ error: "stripe" }, 502); }
  return out({ url: s.url });
});
