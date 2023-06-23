import { useEffect, useReducer } from "react";
import { RouterProvider } from "react-router-dom";

import { StyledAppContainer } from "./styles";
import { ThemeProvider } from "styled-components";
import { router } from "./router";
import themes from "./styles/themes";
import { getSongMetadatas, getQueue } from "./utils/providers";
import { AppContext } from "./context";
import reducer from "./reducer";
import { WebSocketConnection } from "./socket";
import { SongDto } from "./utils/types";
import { Howler } from "howler";

// Set global volume to 50% by default
Howler.volume(0);

const wsIo = new WebSocketConnection("ws://localhost:1235/ws");

function App() {
  const [state, dispatch] = useReducer(reducer, {
    paused: true,
    playingSong: {
      index: -1,
      metadatas: null,
    },
    queue: [],
  });

  useEffect(() => {
    // fetch latest saved queue
    getQueue()
      .then((queue) =>
        dispatch({ type: "fetch queue success", payload: queue })
      )
      .catch((err) => console.error(err));
  }, []);

  // Setup web socket event listeners
  useEffect(() => {
    const onPlay = (song: SongDto) => {
      switch (song.source) {
        case "new":
          break;
        case "none":
          break;
        case "queue":
          break;
        default:
      }
    };

    const onPause = () => {
      dispatch({ type: "pause" });
    };

    const callbacks: Record<string, (...args: any[]) => void> = {
      play: onPlay,
      pause: onPause,
    };

    for (const key of Object.keys(callbacks)) wsIo.on(key, callbacks[key]);

    return () => {
      for (const key of Object.keys(callbacks)) wsIo.off(key, callbacks[key]);
    };
  }, []);

  useEffect(() => {
    const index = state.playingSong.index;
    if (index >= 0 && state.queue.length) {
      getSongMetadatas(state.queue[index])
        .then((song) =>
          dispatch({ type: "fetch playing song success", payload: song })
        )
        .catch((err) => console.log(err));
    }
  }, [state.playingSong.index, state.queue]);

  return (
    <ThemeProvider theme={themes}>
      <StyledAppContainer>
        <AppContext.Provider value={{ state, dispatch }}>
          <RouterProvider router={router} />
        </AppContext.Provider>
      </StyledAppContainer>
    </ThemeProvider>
  );
}

export default App;
