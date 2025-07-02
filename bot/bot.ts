import { Telegraf, Scenes, session, Context } from "telegraf";
import db from "./db.ts";
import { showNextProfile } from "./matcher.ts";

const bot = new Telegraf(import.meta.env.BOT_TOKEN!);

// Conversation state
interface UserSession extends Context {
  idea?: string;
  skills?: string;
  portfolio?: string;
  currentProfile?: number;

  scene: Scenes.SceneContextScene<UserSession>;
}

const { enter, leave } = Scenes.Stage;

const ideaScene = new Scenes.BaseScene<UserSession>("idea");

ideaScene.enter(async (ctx) => {
  ctx.reply("Welcome! What idea would you like to pursue with a co-founder?");
  ctx.session.idea = ctx.message?.text;
});
ideaScene.on("message", (ctx) => {
  console.log("get-a-ctx", ctx.scene);
  ctx.scene.enter("skills");
});
// ideaScene.leave((ctx) => ctx.reply("Bye"));

const skillsScene = new Scenes.BaseScene<UserSession>("skills");

skillsScene.enter(async (ctx) => {
  await ctx.reply("Please share your portfolio or relevant work experience");
  ctx.session.skills = ctx.message?.text;
});

skillsScene.on("message", (ctx) => ctx.scene.enter("portfolio"));
// skillsScene.leave((ctx) => ctx.scene.enter("idea"));

const portfolioScene = new Scenes.BaseScene<UserSession>("portfolio");

portfolioScene.enter(async (ctx) => {
  ctx.session.portfolio = ctx.message?.text;

  // Save user data
  const stmt = db.prepare(`
    INSERT INTO users (telegram_id, idea, skills, portfolio, created_at)
    VALUES (?, ?, ?, ?, datetime('now'))
  `);
  stmt.run(
    ctx.from?.id,
    ctx.session.idea,
    ctx.session.skills,
    ctx.session.portfolio,
  );

  await ctx.reply("Looking for potential co-founders...");
  await showNextProfile(ctx);
});

const stage = new Scenes.Stage<UserSession>(
  [ideaScene, skillsScene, portfolioScene],
  {
    ttl: 10,
  },
);

bot.use(session());
bot.use(stage.middleware());

bot.start((ctx) => {
  ctx.scene.enter("idea");
});

export default bot;
