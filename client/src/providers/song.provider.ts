import { Song } from "../utils/models";

interface ResponseType {
  songs: Song[];
  paging: {
    index: number;
    total: number;
  };
}

export async function getSongs() {
  let songs: Song[] = [];

  try {
    const res = await fetch("/api/song");
    const data: ResponseType = await res.json();
    songs = [...data.songs];

    for (let i = 1; i < data.paging.total; ++i) {
      const res = await fetch(`/api/song?page=${i}`);
      const data: ResponseType = await res.json();
      songs = songs.concat([...data.songs]);
    }
  } catch (err) {
    console.error(err);
  }

  return songs;
}

export async function getSongByTitle(title: string) {
  let songs: Song[] = [];

  try {
    const res = await fetch(`/api/song?title=${title}`);
    const data: ResponseType = await res.json();
    songs = [...data.songs];

    for (let i = 1; i < data.paging.total; ++i) {
      const res = await fetch(`/api/song?title=${title}&page=${i}`);
      const data: ResponseType = await res.json();
      songs = songs.concat([...data.songs]);
    }
  } catch (err) {
    console.error(err);
  }

  return songs;
}
