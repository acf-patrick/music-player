import { useState } from "react";
import { mockSongs } from ".";
import { Audio } from "./models";
import jsmediatags from "jsmediatags";

function getAudioLinks() {
  return mockSongs;
}

function getImage(format: String, data: []) {
  return "";
}

function getMetadata(blob: Blob, audios: Audio[], setAudios: any) {
  jsmediatags.read(blob, {
    onSuccess: (datas: any) => {
      const tags = datas.tags;
      const audio: Audio = {};
      audio.album = tags.album;
      audio.artist = tags.artist;
      audio.cover = getImage(tags.picture.format, tags.picture.data);
      audio.genre = tags.genre;
      audio.title = tags.title;
      audio.track = parseInt(tags.track);
      audio.year = parseInt(tags.year);
      setAudios([...audios, audio]);
    },
    onError: (error: any) => {
      console.error(error);
    },
  });
}

export default function getAudios() {
  const [audios, setAudios] = useState<Audio[]>([]);
  const links = getAudioLinks();

  for (let link of links) {
    fetch(`${link}`)
      .then((res) => res.blob())
      .then((blob) => {
        getMetadata(blob, audios, setAudios);
      })
      .catch((error) => {
        console.error(error);
      });
  }

  return audios;
}
