import { createContext } from "react";
import { Audio } from "./models";

export const AudioListContext = createContext<Audio[]>([]);