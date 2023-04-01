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

export interface Album {
  name: String;
  appearance?: AlbumAppearance;
  artist?: String;
  cover?: String;
  duration?: number;
  songs?: Set<String>; // List of song hash
}

export interface Artist {
  name: String;
  albums?: Set<String>; // List of album names
  songs?: Set<String>; // List of song hash
}

export interface Genre {
  name: String;
  songs?: Set<String>; // List of song hash
}
