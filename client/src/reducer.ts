import api from "./api";
import { AppState, Action } from "./utils/types";

export default function reducer(state: AppState, action: Action): AppState {
  switch (action.type) {
    case "pause":
      api.get("/playback/pause");
      break;

    case "play":
      api.post("/playback/play", action.song);
      break;

      case "resume": 
        break;

    case "fetch playing song success":
      return {
        ...state,
        playingSong: {
          index: state.playingSong.index,
          metadatas: action.payload,
        },
      };

    case "fetch queue success":
      return { ...state, queue: action.payload };

    case "set playing song index":
      return action.index >= 0 && action.index < state.queue.length
        ? {
            ...state,
            playingSong: {
              index: action.index,
              metadatas: null,
            },
          }
        : state;

    default:
  }

  return state;
}
