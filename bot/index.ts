import { Telegraf, Scenes, session } from "telegraf";
import bot from "./bot.ts";
import fastify from "fastify";
import db from "./db.ts";

const app = fastify();

const PORT = import.meta.env.PORT || 3005;

const webhook = await bot.createWebhook({ domain: import.meta.env.DOMAIN });

app.post(`/telegraf/${bot.secretPathComponent()}`, webhook);

// Metrics endpoint
app.get("/metrics", async (request, reply) => {
  const likes = db
    .prepare(`SELECT COUNT(*) FROM interactions WHERE liked = true`)
    .get();
  const dislikes = db
    .prepare(`SELECT COUNT(*) FROM interactions WHERE liked = false`)
    .get();
  return { likes, dislikes };
});

// Start server
app.listen({ port: PORT }).then(() => {
  console.log(`Server running on port ${PORT}`);
});
