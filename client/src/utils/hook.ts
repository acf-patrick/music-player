import { useState, useEffect } from "react";
import { Song, Album } from "./models";
import { getImage } from ".";

export function useImage(coverId: string) {
  const [cover, setCover] = useState("");
  useEffect(() => {
    if (coverId)
      fetch(`/api/image/${coverId}`)
        .then((res) => res.json())
        .then(
          (data: {
            id: string;
            mime_type: string;
            data: { type: string; data: number[] };
          }) => {
            setCover(getImage(data.mime_type, data.data.data));
          }
        )
        .catch((error) => {
          console.error(error);
        });
  }, [coverId]);
  return cover;
}

export function useSongs() {
  const [songs, setSongs] = useState<Song[]>([]);

  useEffect(() => {
    fetch("/api/song")
      .then((res) => res.json())
      .then(
        (data: {
          songs: Song[];
          paging: {
            index: number;
            total: number;
          };
        }) => {
          setSongs(data.songs);
        }
      )
      .catch((error) => {
        console.error(error);
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

export function useAlbums() {
  const [albums, setAlbums] = useState<Album[]>([]);

  useEffect(() => {
    fetch("/api/album")
      .then((res) => res.json())
      .then((data) => setAlbums(data))
      .catch((error) => console.error(error));
  }, []);

  return albums;
}
