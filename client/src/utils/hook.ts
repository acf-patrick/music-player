import { useState, useEffect } from "react";
import { Song, Image, Album } from "./models";
import api from "../api";
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
      api
        .get(`/image/${coverId}`)
        .then((res) => res.data)
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
      api
        .get(`/song?page=${page}`)
        .then((res) => {
          if (res.status === 200) return res.data;
          else {
            throw `${res.status} : ${res.statusText}`;
          }
        })
        .then((data: Response) => {
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
    api
      .get(`/artists`)
      .then((res) => res.data)
      .then((data) => setArtists(data))
      .catch((error) => console.error(error));
  }, []);

  return artists;
}

export function useGenres() {
  const [genres, setGenres] = useState<string[]>([]);

  useEffect(() => {
    api
      .get("/genres")
      .then((res) => res.data)
      .then((data) => setGenres(data))
      .catch((error) => console.error(error));
  }, []);

  return genres;
}

export function useAlbum(name: string) {
  const [album, setAlbum] = useState<Album | null>(null);
  useEffect(() => {
    api
      .get(`/album?name=${name}`)
      .then((res) => res.data)
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
    api
      .get(`/album/a`)
      .then((res) => res.data)
      .then((data: Album[]) =>
        setAlbums(data.filter((album) => (album.title ? true : false)))
      )
      .catch((error) => console.error(error));
  }, []);

  return albums;
}
