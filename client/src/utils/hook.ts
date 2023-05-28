import { useState, useEffect } from "react";
import { Song, Image, Album } from "./models";
import { createDataUri } from ".";

interface Response {
  songs: Song[];
  totalItems: number;
  paging: {
    index: number;
    total: number;
  };
}

export function useImage(coverId: string) {
  const [cover, setCover] = useState("");
  useEffect(() => {
    if (coverId)
      fetch(`/api/image/${coverId}`)
        .then((res) => res.json())
        .then((data: Image) => {
          const datas = data.data;
          setCover(createDataUri(data.mime_type, datas));
        })
        .catch((error) => {
          console.error(error);
        });
  }, [coverId]);
  return cover;
}

export function useSong(page: number) {
  const [songs, setSongs] = useState<Song[]>([]);
  const [pending, setPending] = useState(true);
  const [totalItems, setTotalItems] = useState(0);
  const [totalPages, setTotalPages] = useState(Number.MAX_VALUE);

  useEffect(() => {
    if (page < totalPages) {
      setPending(true);
      console.log(page);
      fetch(`/api/song?page=${page}`)
        .then((res) => {
          if (res.ok) return res.json();
          else {
            throw `${res.status} : ${res.statusText}`;
          }
        })
        .then((data: Response) => {
          console.log("here");
          setPending(false);
          setSongs(data.songs);
          setTotalItems(data.totalItems);
          setTotalPages(data.paging.total);
        })
        .catch((err) => console.error(err));
    }
  }, [page, totalPages]);

  return { pending, totalItems, totalPages, songs };
}

export function useArtists() {
  const [artists, setArtists] = useState<string[]>([]);

  useEffect(() => {
    fetch("/api/artists")
      .then((res) => res.json())
      .then((data) => setArtists(data))
      .catch((error) => console.error(error));
  }, []);

  return artists;
}

export function useGenres() {
  const [genres, setGenres] = useState<string[]>([]);

  useEffect(() => {
    fetch("/api/genres")
      .then((res) => res.json())
      .then((data) => setGenres(data))
      .catch((error) => console.error(error));
  }, []);

  return genres;
}

export function useAlbum(name: string) {
  const [album, setAlbum] = useState<Album | null>(null);
  useEffect(() => {
    fetch(`/api/album?name=${name}`)
      .then((res) => res.json())
      .then((data) => {
        setAlbum(data[0]);
      })
      .catch((err) => console.error(err));
  }, [name]);

  return album;
}

export function useAlbums() {
  const [albums, setAlbums] = useState<Album[]>([]);
  useEffect(() => {
    fetch("/api/album/a")
      .then((res) => res.json())
      .then((data: Album[]) =>
        setAlbums(data.filter((album) => (album.title ? true : false)))
      )
      .catch((error) => console.error(error));
  }, []);

  return albums;
}

export function useQueue() {
  const [queue, setQueue] = useState<string[]>([]);
  useEffect(() => {
    const fetchQueue = async () => {
      try {
        const res = await fetch("/api/queue");
        const data: string[] = await res.json();
        return data;
      } catch (e) {
        console.error(e);
      }
      return [];
    };

    fetchQueue().then((ids) => setQueue(ids));
  }, []);

  return queue;
}
