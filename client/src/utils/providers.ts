import { Song, Image, Album } from "./models";
import { createDataUri } from ".";
import api from "../api";

// Get list of song IDs in current queue
export async function getQueue(): Promise<string[]> {
  const res = await api.get("/queue");
  return res.data;
}

// Get audio metadatas
export async function getSongMetadatas(songId: string): Promise<Song> {
  const res = await api.get(`/song/${songId}`);
  return res.data;
}

// Get audio file
export async function getAudio(songId: string) {
  const res = await api.get(`/audio/${songId}`, { responseType: "blob" });
  const blob: Blob = res.data;
  return {
    format: blob.type.split("/")[1],
    url: URL.createObjectURL(blob),
  };
}

export async function getImageData(id: string) {
  const res = await api.get(`/image/${id}`);
  const datas: Image = res.data;
  return datas.data;
}

export async function getImageUri(id: string) {
  const res = await api.get(`/image/${id}`);
  const datas: Image = res.data;
  return createDataUri(datas.mime_type, datas.data);
}

export async function getAlbums(artists: string[]) {
  const albums: Album[] = [];

  for (let artist of artists) {
    const res = await api.get(`/album?artist=${artist}`);
    const data: Album[] = res.data;
    for (let album of data) {
      if (
        album.title &&
        !albums.find(
          (record) =>
            record.title === album.title && record.artists === album.artists
        )
      )
        albums.push(album);
    }
  }

  return albums;
}

export async function getAlbumSongs(album: string) {
  const res = await api.post(`/album/song`, {
    name: album,
  });
  const songs: string[] = res.data;
  return songs;
}
