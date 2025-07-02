import { Markup } from "telegraf";
import db from "./db.ts";

export async function showNextProfile(ctx: any) {
  // Find compatible co-founder based on skills complementarity
  const profile = db
    .prepare(
      `
    SELECT * FROM users
    WHERE id != ?
    AND skills NOT LIKE ?
    AND portfolio NOT LIKE ?
    ORDER BY RANDOM() LIMIT 1
  `,
    )
    .get(ctx.from?.id, ctx.session.idea, ctx.session.skills);

  if (profile) {
    ctx.session.currentProfile = profile.id;
    const compatibility = db
      .prepare(
        `
      SELECT * FROM profiles
      WHERE user_id = ?
      ORDER BY compatibility DESC LIMIT 1
    `,
      )
      .get(profile.id);

    await ctx.reply(
      `Here's a potential co-founder for your ${ctx.session.idea} idea:`,
    );
    await ctx.reply(
      `Skills: ${profile.skills}\nPortfolio: ${profile.portfolio}`,
    );

    // Add like/dislike buttons
    await ctx.replyWithMarkdown(
      "Would you like to connect with this co-founder?",
      Markup.inlineKeyboard([
        Markup.button.callback("👍 Like", "like"),
        Markup.button.callback("👎 Dislike", "dislike"),
      ]),
    );
  } else {
    await ctx.reply("No compatible co-founders found yet. Keep looking!");
  }
}

export async function handleLike(ctx: any) {
  const stmt = db.prepare(`
    INSERT INTO interactions (user_id, profile_id, liked, timestamp)
    VALUES (?, ?, true, datetime('now'))
  `);
  stmt.run(ctx.from?.id, ctx.session.currentProfile);

  // Show contact info if this is a match
  const user = db.prepare(`SELECT * FROM users WHERE id = ?`).get(ctx.from?.id);
  const profile = db
    .prepare(`SELECT * FROM users WHERE id = ?`)
    .get(ctx.session.currentProfile);

  await ctx.reply(
    `Great! Here's ${profile.telegram_id}'s contact information:`,
  );
  await ctx.reply(`Primary contact: ${profile.portfolio}`);
}

export function handleDislike(ctx: any) {
  showNextProfile(ctx)
}
