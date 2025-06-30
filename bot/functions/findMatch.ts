import { supabase } from "..";

export default async (req, res) => {
  const { data: users } = await supabase
    .from("cofounders")
    .select("*")
    .neq("id", req.headers["x-user-id"])
    .limit(1)
    .order("created_at", { ascending: true });

  res.json({ match: users[0] });
};
