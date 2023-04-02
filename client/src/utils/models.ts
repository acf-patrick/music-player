export interface IPopupProps {
  options: [String, (option: String) => void][];
  separators?: number[]; // Option index where to place separator after
}

export enum AlbumAppearance {
  WithThumbnail,
  WithoutThumbnail,
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
