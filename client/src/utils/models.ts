export enum AlbumAppearance {
  WithThumbnail,
  WithoutThumbnail,
  GridCell,
}

export interface IAlbum {
  appearance?: AlbumAppearance;
  name?: String;
  artist?: String;
  cover?: String;
}

export interface Audio {
  source: String,
  hash: String,       // SHA256sum
  duration?: String,
  track?: Number,
  title?: String,
  album?: String,
  artist?: String,
  cover?: String,
  genre?: String,
  year?: Number,
}