import { Song, Image, Album } from "./models";
import { createDataUri } from ".";

export async function getSong(songId: string): Promise<Song> {
  const res = await fetch(`/api/song/${songId}`);
  return await res.json();
}

export async function getImageData(id: string) {
  const res = await fetch(`/api/image/${id}`);
  const datas: Image = await res.json();
  return datas.data.data;
}

export async function getImageUri(id: string) {
  const res = await fetch(`/api/image/${id}`);
  const datas = await res.json();
  return createDataUri(datas.mime_type, datas.data.data);
}

export async function getAlbums(artists: string[]) {
  const albums: Album[] = [];

  for (let artist of artists) {
    const res = await fetch(`/api/album?artist=${artist}`);
    const data: Album[] = await res.json();
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
