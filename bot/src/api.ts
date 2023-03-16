import Koa from "koa";
import Router from "koa-router";
import KoaLogger from "koa-logger";
import json from "koa-json";
import bodyParser from "koa-bodyparser";
import { client, bot } from "./bot";
import { QueueRepeatMode } from "discord-player";
import {commands} from "./config";

// @ts-ignore
BigInt.prototype.toJSON = function () { return this.toString() }

const app = new Koa();
const router = new Router();

router.get("/commands", async (ctx, next) => {
  ctx.body = commands;
  await next();
})

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
    case "j":
      ctx.body = await bot.music.join(userId, guildId);
      break;
    case "leave":
      ctx.body = await bot.music.leave(guildId);
      break;
    case "play":
    case "p":
      ctx.body = await bot.music.play(userId, guildId, params.song);
      break;
    case "pause":
      ctx.body = await bot.music.pause(guildId);
      break;
    case "resume":
      ctx.body = await bot.music.resume(guildId);
      break;
    case "skip":
    case "s":
      ctx.body = await bot.music.skip(guildId);
      break;
    case "queue":
    case "q":
      ctx.body = await bot.music.readQueue(guildId);
      break;
    case "clear":
    case "c":
      ctx.body = await bot.music.clear(guildId);
      break;
    case "shuffle":
    case "sh":
      ctx.body = await bot.music.shuffle(guildId);
      break;
    case "loop":
    case "l":
      ctx.body = await bot.music.loop(guildId, QueueRepeatMode.QUEUE);
      break;
    case "unloop":
    case "ul":
      ctx.body = await bot.music.loop(guildId, QueueRepeatMode.OFF);
      break;
    case "loopsong":
      ctx.body = await bot.music.loop(guildId, QueueRepeatMode.TRACK);
      break;
    case "autoplay":
    case "ap":
      ctx.body = await bot.music.loop(guildId, QueueRepeatMode.AUTOPLAY);
      break;
    case "nowplaying":
    case "np":
      ctx.body = await bot.music.np(guildId);
      break;
    case "remove":
    case "rm":
      ctx.body = await bot.music.remove(guildId, params.index);
      break;
    case "move":
    case "mv":
      ctx.body = await bot.music.move(guildId, params.from, params.to);
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
