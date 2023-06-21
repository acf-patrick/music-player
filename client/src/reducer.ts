import api from "./api";
import { AppState, Action } from "./utils/types";

export default function reducer(state: AppState, action: Action): AppState {
  switch (action.type) {
    case "pause":
      api.get("/pause");
      break;

    case "play":
      api.post("/playback/play", action.song);
      break;

    case "fetch success":
      return {
        ...state,
        playingSong: {
          index: state.playingSong.index,
          metadatas: action.payload,
        },
      };

    case "set queue":
      return { ...state, queue: action.queue };

    default:
  }

  return state;
}
