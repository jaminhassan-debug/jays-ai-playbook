// Receives Stripe events. A paid checkout unlocks the pack; a full refund removes it.
// Every request is checked against STRIPE_WEBHOOK_SECRET before anything happens.
import { createClient } from "jsr:@supabase/supabase-js@2";

async function verify(payload: string, header: string, secret: string): Promise<boolean> {
  const parts = Object.fromEntries(header.split(",").map((p) => p.split("=", 2)).filter((p) => p.length === 2).map(([k, v]) => [k, v]));
  const t = Number(parts["t"]);
  if (!t || Math.abs(Date.now() / 1000 - t) > 300) return false;
  const sigs = header.split(",").filter((p) => p.startsWith("v1=")).map((p) => p.slice(3));
  const k = await crypto.subtle.importKey("raw", new TextEncoder().encode(secret), { name: "HMAC", hash: "SHA-256" }, false, ["sign"]);
  const mac = new Uint8Array(await crypto.subtle.sign("HMAC", k, new TextEncoder().encode(t + "." + payload)));
  const hex = Array.from(mac).map((b) => b.toString(16).padStart(2, "0")).join("");
  return sigs.some((s) => s.length === hex.length && [...s].reduce((d, c, i) => d | (c.charCodeAt(0) ^ hex.charCodeAt(i)), 0) === 0);
}

Deno.serve(async (req) => {
  if (req.method !== "POST") return new Response("POST only", { status: 405 });
  const secret = (Deno.env.get("STRIPE_WEBHOOK_SECRET") || "").trim().replace(/^["']|["']$/g, "");
  if (!secret) return new Response("not configured", { status: 503 });
  const payload = await req.text();
  if (!(await verify(payload, req.headers.get("stripe-signature") || "", secret))) return new Response("bad signature", { status: 400 });

  const event = JSON.parse(payload);
  const sb = createClient(Deno.env.get("SUPABASE_URL")!, Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!, { auth: { persistSession: false } });

  try {
    if (event.type === "checkout.session.completed" || event.type === "checkout.session.async_payment_succeeded") {
      const s = event.data.object;
      if (s.payment_status !== "paid") return new Response("waiting for payment", { status: 200 });
      const slug = s.metadata?.playbook_slug;
      const email = (s.customer_details?.email || s.customer_email || "").toLowerCase();
      const { data: pb } = await sb.from("playbooks").select("slug").eq("slug", slug || "").maybeSingle();
      if (!pb || !email) { console.error("missing slug or email", s.id); return new Response("ignored", { status: 200 }); }

      let userId: string = s.metadata?.user_id || "";
      if (!userId) {
        const { data: found } = await sb.rpc("stripe_user_id_by_email", { p_email: email });
        userId = found || "";
      }
      if (!userId) {
        const { data: created, error } = await sb.auth.admin.createUser({ email, email_confirm: true });
        if (error) throw error;
        userId = created.user.id;
      }
      const { error } = await sb.from("playbook_purchases").upsert({
        user_id: userId, playbook_slug: slug, source: "checkout",
        stripe_session_id: s.id, stripe_payment_intent: s.payment_intent, amount_pence: s.amount_total, buyer_email: email,
      }, { onConflict: "user_id,playbook_slug" });
      if (error) throw error;
    } else if (event.type === "charge.refunded") {
      const c = event.data.object;
      if (c.refunded && c.payment_intent) {
        const { error } = await sb.from("playbook_purchases").delete().eq("stripe_payment_intent", c.payment_intent);
        if (error) throw error;
      }
    }
  } catch (e) {
    console.error("webhook failed", event.type, (e as Error).message);
    return new Response("error", { status: 500 }); // Stripe retries
  }
  return new Response("ok", { status: 200 });
});
