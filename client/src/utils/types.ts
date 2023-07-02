import { CSSProperties } from "styled-components";
import { Song } from "./models";

export type PopupOption = {
  text: string;
  callback?: () => void;
  options?: IPopupProps;
  styles?: CSSProperties; // Applied when Option is on hover
};

export interface IPopupProps {
  options: PopupOption[];
  searchbar?: string; // Placeholder text for a searchbar
  separators?: number[]; // Option index where to place separator after
}

export enum AlbumAppearance {
  WithThumbnail,
  GridCell,
}

export const SongSortOptions = [
  "title",
  "duration",
  "album",
  "artist",
  "genre",
  "year",
] as const;

export const AlbumSortOptions = ["name", "artist", "duration"] as const;

export type AppState = {
  paused: boolean;
  playingSong: {
    index: number;
    metadatas: Song | null;
    source?: { type: "album" | "playlist"; name: string };
  };
  queue: string[];
};

export type SongDto =
  | {
      source: "queue";
      index: number;
    }
  | {
      source: "new";
      index: number;
      provider: { type: "album" | "playlist"; name: string };
    }
  | {
      source: "none";
      id: string;
    };

export type Action =
  | {
      // play a new song
      type: "play";
      song: SongDto;
    }
  | {
      // resume currently playing song
      type: "resume";
    }
  | {
      type: "fetch playing song success";
      payload: Song;
    }
  | { type: "pause" }
  | { type: "next song" }
  | { type: "prev song" }
  | {
      // Seek to a certain position
      type: "seek";
      // number between 0 - 1
      progression: number;
    }
  | { type: "fetch queue success"; payload: string[] };
