import { supabase } from "..";

export default async (req, res) => {
  const { idea, skills, portfolio } = req.body;

  const { data, error } = await supabase.from("cofounders").insert([
    {
      idea,
      skills: skills.join(","),
      portfolio,
      status: "active",
      created_at: new Date().toISOString(),
    },
  ]);

  res.json({ success: !error, data });
};
