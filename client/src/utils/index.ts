import { createContext } from "react";
import { Audio } from "./models";
import CryptoJs from "crypto-js";

export const AudioListContext = createContext<Audio[]>([]);


// async function getSHA256(blob: Blob) {
//   const buffer = await blob.arrayBuffer();
//   const arr = new Uint32Array(
//     buffer.slice(0, 4 * Math.floor(buffer.byteLength / 4))
//   );
//   const wordArray = CryptoJs.lib.WordArray.create([...arr]);

//   return CryptoJs.SHA256(wordArray).toString(CryptoJs.enc.Base64);
// }

export function getSHA256(source: String) {
  return CryptoJs.SHA256(source.toString()).toString(CryptoJs.enc.Base64);
}