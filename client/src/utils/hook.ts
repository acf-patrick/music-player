import { useState, useEffect } from "react";
import mockSongs from "./mockDatas";
import { Audio as Song } from "./models";
import jsmediatags from "jsmediatags";

function getAudioLinks() {
  return mockSongs;
}

function getImage(format: String, data: number[]) {
  let str = "";
  for (let byte of data) str += String.fromCharCode(byte);
  return `data:${format};base64,${btoa(str)}`;
}

function getDuration(source: String, callback: (duration: String) => any) {
  const audio = new Audio();
  audio.onloadedmetadata = () => {
    if (isNaN(audio.duration)) callback("");
    else {
      let seconds = Math.ceil(audio.duration);
      let minutes = Math.floor(seconds / 60);
      seconds %= 60;
      let hours = Math.floor(minutes / 60);
      minutes %= 60;

      const toStr = (n: number) => `${n < 10 ? "0" : ""}${n}`;
      callback(
        `${hours ? toStr(hours) + ":" : ""}${toStr(minutes) + ":"}${toStr(
          seconds
        )}`
      );
    }
  };
  audio.src = source.toString();
}

function getMetadata(
  blob: Blob,
  source: String,
  audios: Song[],
  setAudios: any
) {
  jsmediatags.read(blob, {
    onSuccess: (datas: any) => {
      const tags = datas.tags;
      const audio: Song = { source: source };
      audio.album = tags.album;
      audio.artist = tags.artist;
      audio.genre = tags.genre;
      audio.title = tags.title;
      audio.track = parseInt(tags.track);
      audio.year = parseInt(tags.year);

      if (!audios.find((a) => a.title === audio.title)) {
        getDuration(source, (duration) => {
          audio.duration = duration;
          audio.cover = getImage(tags.picture.format, tags.picture.data);
          audios.push(audio);
          setAudios([...audios]);
        });
      }
    },
    onError: (error: any) => {
      console.error(error);
    },
  });
}

export default function useAudios() {
  const [audios, setAudios] = useState<Song[]>([]);
  const [loading, setLoading] = useState(true);
  const links = getAudioLinks();

  useEffect(() => {
    for (let link of links) {
      fetch(`${link}`)
        .then((res) => res.blob())
        .then((blob) => {
          getMetadata(blob, link, audios, setAudios);
        })
        .catch((error) => {
          console.error(error);
        });
    }
  }, []);

  useEffect(() => {
    if (links.length <= audios.length) {
      setLoading(false);
    }
  }, [audios]);

  return { loading, audios };
}
