import { client, player } from "./bot";
import { channel } from "diagnostics_channel";


const getQueue = (guildId: string, userId: string = undefined) => {
  // return que if it exists otherwise create a new one
  const queue = player.getQueue(guildId);
  if (!queue) {
    if (!userId) return null;
    return player.createQueue(guildId, {
      metadata: {
        channel: client.guilds.cache.get(guildId)?.members.cache.get(userId)?.voice.channel,
      },
      leaveOnEmpty: false,
      leaveOnEnd: false,
      leaveOnStop: false
    });
  }
  return queue;
};

const leave = async (guildId: string) => {
  const queue = getQueue(guildId);
  if (!queue) {
    return { status: "error", message: "Queue not found" };
  }
  queue.destroy();
  return readQueue(guildId);
};

const join = async (userId: string, guildId: string) => {
  const queue = getQueue(guildId, userId);
  if (!queue) {
    return { status: "error", message: "Queue not found" };
  }
  const { channelId } = client.guilds.cache.get(guildId)?.members.cache.get(userId)?.voice;
  if (!channelId) throw new Error("User not in a voice channel");
  queue.connect(channelId);
  return readQueue(guildId);
};

const play = async (userId: string, guildId: string, url: string) => {
  const queue = getQueue(guildId, userId);
  if (!queue) {
    return { status: "error", message: "Queue not found" };
  }

  try {
    if (!queue.connection) await queue.connect(client.guilds.cache.get(guildId)?.members.cache.get(userId)?.voice.channelId);
  } catch {
    return { status: "error", message: "Could not join voice channel" };
  }

  const oneOrMoreTracks = await player.search(url, {
    requestedBy: userId,
  }).then(x => x.playlist ? x.tracks : x.tracks[0]);

  if (!queue.nowPlaying()) {
    if (Array.isArray(oneOrMoreTracks)) {
      queue.addTracks(oneOrMoreTracks);
    } else {
      queue.addTrack(oneOrMoreTracks);
    }
    queue.play();
  } else {
    if (Array.isArray(oneOrMoreTracks)) {
      queue.addTracks(oneOrMoreTracks);
    } else {
      queue.addTrack(oneOrMoreTracks);
    }
  }

  return readQueue(guildId);
};

const pause = async (guildId: string) => {
  const queue = getQueue(guildId);
  if (!queue) {
    return { status: "error", message: "Queue not found" };
  }
  queue.setPaused(true);
  return readQueue(guildId);
};

const stop = async (guildId: string) => {
  const queue = getQueue(guildId);
  if (!queue) {
    return { status: "error", message: "Queue not found" };
  }
  queue.stop();
  return readQueue(guildId);
};

const resume = async (guildId: string) => {
  const queue = getQueue(guildId);
  if (!queue) {
    return { status: "error", message: "Queue not found" };
  }
  queue.setPaused(false);
  return readQueue(guildId);
};

const skip = async (guildId: string) => {
  const queue = getQueue(guildId);
  if (!queue) {
    return { status: "error", message: "Queue not found" };
  }
  queue.skip();

  return readQueue(guildId);
};

const readQueue = async (guildId: string) => {
  const queue = getQueue(guildId);
  if (!queue) {
    return { status: "error", message: "Queue not found" };
  }
  const tracksList: string[] = [];
  queue.nowPlaying() && tracksList.push(`Now Playing: ${queue.nowPlaying().title} | ${queue.nowPlaying().duration} | ${queue.nowPlaying().requestedBy}`);
  queue.tracks.forEach((track, index) => {
    tracksList.push(`${index + 1}. ${track.title} | ${track.duration} | ${track.requestedBy}`);
  });
  return { status: "ok", message: tracksList };
};

const clear = async (guildId: string) => {
  const queue = getQueue(guildId);
  if (!queue) {
    return { status: "error", message: "Queue not found" };
  }
  queue.clear();
  return readQueue(guildId);
};

const shuffle = async (guildId: string) => {
  const queue = getQueue(guildId);
  if (!queue) {
    return { status: "error", message: "Queue not found" };
  }
  queue.shuffle();
  return readQueue(guildId);
};

const loop = async (guildId: string, looped: boolean) => {
  const queue = getQueue(guildId);
  if (!queue) {
    return { status: "error", message: "Queue not found" };
  }
  queue.setRepeatMode(looped ? 1 : 0);
  return readQueue(guildId);
};

const np = async (guildId: string) => {
  const queue = getQueue(guildId);
  if (!queue) {
    return { status: "error", message: "Queue not found" };
  }
  return { status: "ok", message: `Now Playing: ${queue.nowPlaying().title} | ${queue.nowPlaying().duration} | ${queue.nowPlaying().requestedBy}` };
};

const remove = async (guildId: string, index: number) => {
  const queue = getQueue(guildId);
  if (!queue) {
    return { status: "error", message: "Queue not found" };
  }
  queue.remove(index);
  return readQueue(guildId);
};

const move = async (guildId: string, from: number, to: number) => {
  const queue = getQueue(guildId);
  if (!queue) {
    return { status: "error", message: "Queue not found" };
  }
  const track = queue.remove(from);
  queue.insert(track, to);
  return readQueue(guildId);
};

const playNext = async (guildId: string, url: string) => {
  const queue = getQueue(guildId);
  if (!queue) {
    return { status: "error", message: "Queue not found" };
  }
  const track = await player.search(url, {
    requestedBy: queue.nowPlaying().requestedBy,
  }).then(x => x.tracks[0]);
  queue.insert(track, 1);
  return readQueue(guildId);
};

export const music = {
  leave,
  join,
  play,
  pause,
  stop,
  resume,
  skip,
  readQueue,
  clear,
  shuffle,
  loop,
  np,
  remove,
  move,
  playNext
};