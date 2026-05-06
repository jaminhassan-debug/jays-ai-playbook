import { supabase } from "../../lib/supabase";

export default async function handler(req, res) {
  const { email } = req.body;

  const { error } = await supabase
    .from("email_subscribers")
    .insert([{ email }]);

  if (error) return res.status(400).json(error);

  res.status(200).json({ success: true });
}