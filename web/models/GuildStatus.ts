import { Track, PlayerTimestamp } from "discord-player";

export interface GuildStatus {
  id: string;
  queue: Track[];
  playing: boolean;
  nowPlaying: Track | null;
  timestamp: PlayerTimestamp;
}