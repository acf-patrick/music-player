export enum AlbumAppearance {
  WithThumbnail,
  WithoutThumbnail,
  GridCell,
}

export interface IAlbum {
  name: String;
  cover?: String;
}

export interface IAlbumProps {
  appearance: AlbumAppearance;
  name?: String;
  cover?: String;
}

export interface Audio {
  source: String,
  duration?: String,
  track?: Number,
  title?: String,
  album?: String,
  artist?: String,
  cover?: String,
  genre?: String,
  year?: Number,
}