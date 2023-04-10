export interface IPopupProps {
  options: String[];
  optionOnClick?: { index: number; callback: (option: String) => void }[];
  separators?: number[]; // Option index where to place separator after
}

export enum AlbumAppearance {
  WithThumbnail,
  GridCell,
}

export interface Audio {
  source: String;
  hash: String; // SHA256sum
  duration?: String;
  track?: Number;
  title?: String;
  album?: String;
  artist?: String;
  cover?: String;
  genre?: String;
  year?: Number;
}

export const AudioSortOptions = [
  "title",
  "duration",
  "album",
  "artist",
  "genre",
  "year",
] as const;

export interface Album {
  name: String;
  appearance?: AlbumAppearance;
  artist?: String;
  cover?: String;
  duration?: number;
  year?: number; // Year of the latest released song
  songs?: Set<String>; // List of song hash
}

export const AlbumSortOptions = ["name", "artist", "duration"] as const;

export interface Artist {
  name: String;
  albums?: Set<String>; // List of album names
  songs?: Set<String>; // List of song hash
}

export interface Genre {
  name: String;
  songs?: Set<String>; // List of song hash
}

export interface IDataList {
  audios: Audio[];
  albums: Album[];
  artists: Artist[];
  genres: Genre[];
  queue: Audio[]; // List of played audios
  playingSong: Audio | null; // Currently playing song
  playingSongIndex: number; // Index of currently playing song in current queue
  paused?: boolean; // true if current selected song has been paused
}

export interface IDataMutatorList {
  setQueue?: (audios: Audio[]) => void;
  setPlayingSongIndex?: (index: number) => void;
  setPlayingSong?: (audio: Audio | null) => void;
  setPaused?: (paused: boolean) => void;
}