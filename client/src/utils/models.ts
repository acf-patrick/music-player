import { AlbumAppearance } from "./types";

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

export interface Album {
  title: string;
  artists?: string[];
  genres?: string[];
  duration?: number;
  cover?: string;
  year?: number; // Year of the latest released song
  appearance?: AlbumAppearance;
}

export interface Image {
  id: string;
  mime_type: string;
  data: number[];
}