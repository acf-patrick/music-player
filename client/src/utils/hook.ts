import { useState, useEffect } from "react";
import { Song, Image, Album } from "./models";
import { createDataUri } from ".";
import { getImageUri } from "./providers";

export function useImage(coverId: string) {
  const [cover, setCover] = useState("");
  useEffect(() => {
    if (coverId)
      fetch(`/api/image/${coverId}`)
        .then((res) => res.json())
        .then((data: Image) => {
          const datas = data.data.data;
          setCover(createDataUri(data.mime_type, datas));
        })
        .catch((error) => {
          console.error(error);
        });
  }, [coverId]);
  return cover;
}

interface Response {
  songs: Song[];
  paging: {
    index: number;
    total: number;
  };
}

export function useSongs() {
  const [songs, setSongs] = useState<Song[]>([]);

  useEffect(() => {
    const fetchSongs = async () => {
      let songs: Song[] = [];

      try {
        const res = await fetch("/api/song");
        const datas: Response = await res.json();
        songs = datas.songs;

        for (let i = 1; i < datas.paging.total; ++i) {
          const res = await fetch(`/api/song?page=${i}`);
          const datas: Response = await res.json();
          songs = songs.concat(datas.songs);
        }
      } catch (error) {
        console.error(error);
      }

      return songs;
    };

    fetchSongs().then((songs) => {
      setSongs(songs);
    });
  }, []);

  return songs;
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

export function useAlbumsByArtist(artist: string) {
  const [albums, setAlbums] = useState<Album[]>([]);
  useEffect(() => {
    fetch(`/api/album?artist=${artist}`)
      .then((res) => res.json())
      .then((data) => setAlbums(data))
      .catch((err) => console.error(err));
  }, [artist]);

  return albums;
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
    fetch("/api/albums")
      .then((res) => res.json())
      .then((data) => setAlbums(data))
      .catch((error) => console.error(error));
  }, []);

  return albums;
}
