import api from "./api";
import { AppState, Action } from "./utils/types";

export default function reducer(state: AppState, action: Action): AppState {
  switch (action.type) {
    case "pause":
      if (!state.paused) api.get("/playback/pause");
      break;

    case "play":
      api.post("/playback/play", action.song);
      break;

    case "resume":
      if (state.paused) api.get("/playback/resume");
      break;

    case "next song":
      return reducer(state, {
        type: "play",
        song: {
          source: "queue",
          index: state.playingSong.index - 1,
        },
      });

    case "prev song":
      return reducer(state, {
        type: "play",
        song: {
          source: "queue",
          index: state.playingSong.index - 1,
        },
      });

    case "fetch playing song success":
      return {
        ...state,
        playingSong: {
          index: state.playingSong.index,
          metadatas: action.payload,
        },
      };

    case "fetch queue success":
      return action.payload !== state.queue
        ? { ...state, queue: action.payload }
        : state;

    default:
  }

  return state;
}
