import { createContext } from "react";
import { Audio } from "./models";

export const AudioListContext = createContext<Audio[]>([]);

// mock songs for testing
export const mockSongs: String[] = [
  "http://localhost:3000/test/songs/Black Future/01-vektor-black_future-noir.mp3",
  "http://localhost:3000/test/songs/Black Future/09-vektor-accelerating_universe-noir.mp3",
  "http://localhost:3000/test/songs/Black Waterpark/1.01. The Leper Affinity.mp3",
  "http://localhost:3000/test/songs/Black Waterpark/1.08. Blackwater Park.mp3",
  "http://localhost:3000/test/songs/Epitaph/01 - Stabwound.mp3",
  "http://localhost:3000/test/songs/Epitaph/05 - Epitaph.mp3",
  "http://localhost:3000/test/songs/Terminal Redux/01. Charging The Void.mp3",
  "http://localhost:3000/test/songs/Terminal Redux/10. Recharging The Void.mp3",
];
