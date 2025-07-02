import { scheduleJob } from "node-cron";
import bot from "./bot.ts";
import db from "./db.ts";

// Schedule daily reminders at 9 AM
scheduleJob("0 9 * * *", async () => {
  const users = db
    .prepare(
      `SELECT telegram_id FROM users WHERE last_interaction < datetime('now', '-7 days')`,
    )
    .all();

  for (const user of users) {
    await bot.telegram.sendMessage(
      user.telegram_id,
      `
      It's been a while since your last interaction.
      How did your co-founder matching go?
    `,
    );
  }
});
