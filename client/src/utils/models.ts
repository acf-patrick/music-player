import { CSSProperties } from "styled-components";

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

export interface Song {
  id: string;
  path: string; // Song source
  liked: boolean;
  year?: number;
  title?: string;
  artist?: string;
  genre?: string;
  track_number?: number;
  cover?: string; // ID to one of image table record
  album?: string;
  duration: number;
}

export const SongSortOptions = [
  "title",
  "duration",
  "album",
  "artist",
  "genre",
  "year",
] as const;

export interface Album {
  title: string;
  artists?: string[];
  duration?: number;
  cover?: string;
  year?: number; // Year of the latest released song
  appearance?: AlbumAppearance;
}

export const AlbumSortOptions = ["name", "artist", "duration"] as const;

export interface IDataList {
  queue: string[]; // List of played songs
  playingSong: Song | null; // Currently playing song
  playingSongIndex: number; // Index of currently playing song in current queue
  paused?: boolean; // true if current selected song has been paused
}

export interface IDataMutatorList {
  setQueue?: (songIds: string[]) => void;
  setPlayingSongIndex?: (index: number) => void;
  setPlayingSong?: (song: Song | null) => void;
  setPaused?: (paused: boolean) => void;
}
