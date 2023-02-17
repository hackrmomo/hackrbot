import { client } from "./bot";
import { getVoiceConnection, joinVoiceChannel, createAudioResource, createAudioPlayer } from "@discordjs/voice";
import ytdl from "ytdl-core";
import { } from "discord.js";

type GuildId = string;
type UserId = string;
type QueueItem = {
  url: string;
  user: UserId;
  progress: number | null;
  status: "playing" | "paused";
}

const queue: Map<GuildId, QueueItem[]> = new Map();


type Data = {
  status: "error" | "ok";
  message?: string;
}

const leave: (guildId: string) => Promise<Data> = async (guildId: string) => {
  const connection = getVoiceConnection(guildId);
  if (!connection) return { status: "error", message: "Not in a voice channel" };
  connection.destroy();
  return { status: "ok" };
};

const join = async (userId: string, guildId: string) => {
  await leave(guildId);
  try {
    const user = await client.users.fetch(userId);
    const guild = await client.guilds.fetch(guildId);
    const member = await guild.members.fetch(user);
    const channel = member.voice.channel;
    if (!channel) return { status: "error", message: "Not in a voice channel" };
    joinVoiceChannel({
      channelId: channel.id,
      guildId: channel.guild.id,
      adapterCreator: channel.guild.voiceAdapterCreator,
    });
  } catch (e) {
    return { status: "error", message: e.message };
  }
  return { status: "ok" };
};

const play = async (userId: string, guildId: string, url: string) => {
  try {
    const connection = getVoiceConnection(guildId);
    if (!connection) return { status: "error", message: "Not in a voice channel" };
    const queueItem: QueueItem = {
      url,
      user: userId,
      progress: null,
      status: "playing",
    };
    const queueItems = queue.get(guildId) || [];
    queue.set(guildId, [...queueItems, queueItem]);
    const player = createAudioPlayer();
    const resource = createAudioResource(ytdl(url, { filter: "audioonly" }));
    player.play(resource);
    connection.subscribe(player);
    player.on("stateChange", (oldState, newState) => {
      if (newState.status === "idle") {
        const queueItems = queue.get(guildId) || [];
        const queueItem = queueItems.shift();
        if (queueItem) {
          queue.set(guildId, queueItems);
          play(userId, guildId, queueItem.url);
        }
      }
    });
    return { status: "ok", message: `now playing ${url}` };
  } catch (e) {
    return { status: "error", message: e.message };
  }
};

export const music = {
  leave,
  join,
  play,
}