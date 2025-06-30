import { supabase } from "..";
import { bot } from ".."

export default async () => {
  const { data: users } = await supabase
    .from('cofounders')
    .select('*')
    .lt('last_interaction', 72.hours.ago());

  // Send Telegram reminders to these users
  users.forEach(user => {
    bot.telegram.sendMessage(
      user.telegram_id,
      'How are your co-founder discussions going? Would you like to see more matches?'
    );
  });
};
