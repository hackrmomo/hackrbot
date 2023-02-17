import Koa from "koa";
import Router from "koa-router";
import KoaLogger from "koa-logger";
import json from "koa-json";
import bodyParser from "koa-bodyparser";
import { client, bot } from "./bot";

// @ts-ignore
BigInt.prototype.toJSON = function () { return this.toString() }

const app = new Koa();
const router = new Router();

router.post("/command", async (ctx, next) => {
  const {
    command,
    guildId,
    userId,
    params
  } = ctx.request.body as {
    command: string,
    guildId: string,
    userId: string,
    params: { [key: string]: any}
  };
  switch (command) {
    case "join":
      ctx.body = await bot.music.join(userId, guildId);
      break;
    case "leave":
      ctx.body = await bot.music.leave(guildId);
      break;
    case "play":
      ctx.body = await bot.music.play(userId, guildId, params.song);
      break;
    default:
      ctx.body = "unknown command";
  }

  await next();
})

router.post("/reset", async (ctx, next) => {
  bot.healthCheck(true);
  await next();
})

router.get("/guilds", async (ctx, next) => {
  ctx.body = await client.guilds.fetch();
  await next();
})

// Middlewares
app.use(KoaLogger());
app.use(json());
app.use(bodyParser());

// Routes
app.use(router.routes()).use(router.allowedMethods());

// Start the server
app.listen(process.env.PORT || 3000, () => {
  console.log(`Server running on port ${process.env.PORT || 3000}`);
});
