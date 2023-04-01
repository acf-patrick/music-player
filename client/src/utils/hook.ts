import { useState, useEffect } from "react";
import { Audio as Song } from "./models";
import mockSongs from "./mockDatas";
import jsmediatags from "jsmediatags";
import { getSHA256, durationToString } from ".";

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
    else callback(durationToString(audio.duration));
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
      const hash = getSHA256(source);
      const tags = datas.tags;
      const audio: Song = { source: source, hash: hash };
      audio.album = tags.album;
      audio.artist = tags.artist;
      audio.genre = tags.genre;
      audio.title = tags.title;
      audio.track = parseInt(tags.track);
      audio.year = parseInt(tags.year);

      getDuration(source, (duration) => {
        audio.duration = duration;
        audio.cover = getImage(tags.picture.format, tags.picture.data);

        if (!audios.find((audio) => audio.hash === hash)) {
          audios.push(audio);
          setAudios([...audios]);
        }
      });
    },
    onError: (error: any) => {
      console.error(error);
    },
  });
}

export default function useAudios() {
  const [audios, setAudios] = useState<Song[]>([]);
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

  return audios;
}
