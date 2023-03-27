import { Track, PlayerTimestamp } from "discord-player";

export interface GuildStatus {
  id: string;
  queue: Track[];
  history: Track[];
  playing: boolean;
  nowPlaying: Track | null;
  timestamp: PlayerTimestamp | null;
}