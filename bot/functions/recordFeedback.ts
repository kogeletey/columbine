import { supabase } from "..";

export default async (req, res) => {
  const { user_id, match_id, feedback } = req.body;

  const { error } = await supabase.from("matches").insert([
    {
      user_id,
      match_id,
      feedback,
      timestamp: new Date().toISOString(),
    },
  ]);

  res.json({ success: !error });
};
