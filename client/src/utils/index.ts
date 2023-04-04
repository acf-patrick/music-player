import { createContext } from "react";
import CryptoJs from "crypto-js";
import { IDataList } from "./models";

export const DatasContext = createContext<IDataList>({
  audios: [],
  albums: [],
  artists: [],
  genres: [],
  queue: [],
});

/* async function getSHA256(blob: Blob) {
  const buffer = await blob.arrayBuffer();
  const arr = new Uint32Array(
    buffer.slice(0, 4 * Math.floor(buffer.byteLength / 4))
  );
  const wordArray = CryptoJs.lib.WordArray.create([...arr]);

  return CryptoJs.SHA256(wordArray).toString(CryptoJs.enc.Base64);
} */

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

// Compute difference between two sequences
export function levenshteinDistance(str1: String, str2: String) {
  const track = Array(str2.length + 1)
    .fill(null)
    .map(() => Array(str1.length + 1).fill(null));
  for (let i = 0; i <= str1.length; i += 1) {
    track[0][i] = i;
  }
  for (let j = 0; j <= str2.length; j += 1) {
    track[j][0] = j;
  }
  for (let j = 1; j <= str2.length; j += 1) {
    for (let i = 1; i <= str1.length; i += 1) {
      const indicator = str1[i - 1] === str2[j - 1] ? 0 : 1;
      track[j][i] = Math.min(
        track[j][i - 1] + 1, // deletion
        track[j - 1][i] + 1, // insertion
        track[j - 1][i - 1] + indicator // substitution
      );
    }
  }
  return track[str2.length][str1.length];
}
