export interface Album {
  title: string;
  artists: string[];
  duration: number;
  track_count: number;
  year: number;
  cover?: string;
}