import { client, player, socket } from "./bot";
import { channel } from "diagnostics_channel";
import { GuildNodeManager, GuildQueuePlayerNode, QueueRepeatMode, StreamDispatcher, useQueue } from "discord-player";


export const registerEvents = () => {
  player.events.on("audioTrackAdd", (gq) => {
    console.log("audioTrackAdded!");
    heartbeat(gq.guild.id);
  });
};

const heartbeat = (guildId: string) => {
  socket.emit("bot-heartbeat", {
    guildId,
    data: {
      id: guildId,
      queue: useQueue(guildId).tracks.toArray(),
      playing: useQueue(guildId).isPlaying,
      nowPlaying: useQueue(guildId).currentTrack
    }
  });
};

const leave = async (guildId: string) => {
  player.voiceUtils.getConnection(guildId).disconnect();
};

const join = async (userId: string, guildId: string) => {
  const channel = client.guilds.cache.get(guildId)?.members.cache.get(userId)?.voice.channel;
  player.voiceUtils.join(channel)
};

const play = async (userId: string, guildId: string, url: string) => {
  const channel = client.guilds.cache.get(guildId)?.members.cache.get(userId)?.voice.channel;
  player.play(channel, url, {
    nodeOptions: {
      skipOnNoStream: true,
      leaveOnEmpty: false,
      leaveOnEnd: false,
      leaveOnStop: false,
      selfDeaf: false,
      repeatMode: QueueRepeatMode.AUTOPLAY
    }
  });
  return readQueue(guildId);
};

const pause = async (guildId: string) => {
  const streamDispatcher = player.voiceUtils.getConnection(guildId);
  if (streamDispatcher instanceof StreamDispatcher) {
    streamDispatcher.pause();
  }
  return readQueue(guildId);
};

const resume = async (guildId: string) => {
  const streamDispatcher = player.voiceUtils.getConnection(guildId);
  if (streamDispatcher instanceof StreamDispatcher) {
    streamDispatcher.resume();
  }
  return readQueue(guildId);
};

const skip = async (guildId: string) => {
  useQueue(guildId).node.skip();
  return readQueue(guildId);
};

const readQueue = async (guildId: string) => {
  try {
    const tracksList = useQueue(guildId).tracks.map((track, index) => {
      return `${index + 1}. ${track.title} | ${track.duration} | ${track.requestedBy}`;
    });
    return { status: "ok", message: tracksList };
  } catch (e) {
    return { status: "ok", message: "No tracks in queue" };
  }
};

const clear = async (guildId: string) => {
  useQueue(guildId).clear();
  return readQueue(guildId);
};

const shuffle = async (guildId: string) => {
  useQueue(guildId).tracks.shuffle();
  return readQueue(guildId);
};

const loop = async (guildId: string, loopMode: QueueRepeatMode) => {
  useQueue(guildId).setRepeatMode(loopMode);
  return readQueue(guildId);
};

const np = async (guildId: string) => {
  const currentTrack = useQueue(guildId).currentTrack;
  if (!currentTrack) {
    return { status: "error", message: "Queue not found" };
  }
  return { status: "ok", message: `Now Playing: ${currentTrack.title} | ${currentTrack.duration} | ${currentTrack.requestedBy}` };
};

const remove = async (guildId: string, index: number) => {
  useQueue(guildId).removeTrack(index);
  return readQueue(guildId);
};

const move = async (guildId: string, from: number, to: number) => {
  useQueue(guildId).swapTracks(from, to);
  return readQueue(guildId);
};

export const music = {
  leave,
  join,
  play,
  pause,
  resume,
  skip,
  readQueue,
  clear,
  shuffle,
  loop,
  np,
  remove,
  move,
};