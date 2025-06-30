import { Context, Telegraf, session } from "telegraf";
import { createClient } from "@supabase/supabase-js";

interface SessionData extends Context {
  step: "idea" | "skills" | "portfolio" | "matching";
  userData?: {
    idea: string;
    skills: string[];
    portfolio: string;
    createdAt: Date;
  };
}

export const bot = new Telegraf<SessionData>(import.meta.env.BOT_TOKEN || "");

export const supabase = createClient(
  import.meta.env.SUPABASE_URL || "",
  import.meta.env.SUPABASE_KEY || "",
);

bot.use(session());

// Start command handler
bot.start(async (ctx) => {
  ctx.step = "idea";
  ctx.reply(
    "Let's find your ideal co-founder! First, tell me about your business idea.",
  );
});

// Idea collection
bot.on("text", (ctx) => {
  if (ctx.step === "idea") {
    ctx.userData = {
      idea: ctx.message.text,
      skills: [],
      portfolio: "",
      createdAt: new Date(),
    };
    ctx.step = "skills";
    ctx.reply("What skills do you have that would help with this idea?");
  }
});

bot.command("quit", async (ctx) => {
  // Explicit usage
  await ctx.telegram.leaveChat(ctx.message.chat.id);

  // Using context shortcut
  await ctx.leaveChat();
});
