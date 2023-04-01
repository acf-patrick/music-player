import { createContext } from "react";
import CryptoJs from "crypto-js";
import { Album, Artist, Audio, Genre } from "./models";

interface IDataList {
  audios: Audio[];
  albums: Album[];
  artists: Artist[];
  genres: Genre[];
}

export const DatasContext = createContext<IDataList>({
  audios: [],
  albums: [],
  artists: [],
  genres: [],
});

// async function getSHA256(blob: Blob) {
//   const buffer = await blob.arrayBuffer();
//   const arr = new Uint32Array(
//     buffer.slice(0, 4 * Math.floor(buffer.byteLength / 4))
//   );
//   const wordArray = CryptoJs.lib.WordArray.create([...arr]);

//   return CryptoJs.SHA256(wordArray).toString(CryptoJs.enc.Base64);
// }

// Convert number of seconds to hh:mm:ss
export function durationToString(duration: number) {
  let seconds = Math.ceil(duration);
  let minutes = Math.floor(seconds / 60);
  seconds %= 60;
  let hours = Math.floor(minutes / 60);
  minutes %= 60;

  const toStr = (n: number) => `${n < 10 ? "0" : ""}${n}`;
  return `${hours ? toStr(hours) + ":" : ""}${toStr(minutes) + ":"}${toStr(
    seconds
  )}`;
}

// Convert hh:mm:ss duration format to seconds
export function stringToDuration(duration: string) {
  const parts = duration.split(":");
  let hours = 0;
  let minutes = 0;
  let seconds = 0;

  if (parts.length > 2) {
    hours = parseInt(parts[0]);
    minutes = parseInt(parts[1]);
    seconds = parseInt(parts[2]);
  } else {
    minutes = parseInt(parts[0]);
    seconds = parseInt(parts[1]);
  }

  return hours * 3600 + minutes * 60 + seconds;
}

export function getSHA256(source: String) {
  return CryptoJs.SHA256(source.toString()).toString(CryptoJs.enc.Base64);
}
