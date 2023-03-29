import { useState, useEffect } from "react";
import mockSongs from "./mockDatas";
import { Audio } from "./models";
import jsmediatags from "jsmediatags";

function getAudioLinks() {
  return mockSongs;
}

function getImage(format: String, data: number[]) {
  let str = "";
  for (let byte of data) str += String.fromCharCode(byte);
  return `data:${format};base64,${btoa(str)}`;
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
      if (
        !audios.find((a) => a.title === audio.title)
      ) {
        audios.push(audio);
        setAudios([...audios]);
      }
    },
    onError: (error: any) => {
      console.error(error);
    },
  });
}

export default function useAudios() {
  const [audios, setAudios] = useState<Audio[]>([]);
  const [loading, setLoading] = useState(true);
  const links = getAudioLinks();

  useEffect(() => {
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
  }, []);

  useEffect(() => {
    if (links.length === audios.length) {
      setLoading(false);
    }
  }, [audios]);

  return { loading, audios };
}
