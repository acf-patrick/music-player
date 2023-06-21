import { createContext } from "react";
import { Action, AppState } from "./utils/types";

const AppContext = createContext<{
  state: AppState;
  dispatch: React.Dispatch<Action>;
}>({
  dispatch: () => {},
  state: {
    paused: true,
    playingSong: {
      index: -1,
      metadatas: null,
    },
    queue: [],
  },
});

export { AppContext };
