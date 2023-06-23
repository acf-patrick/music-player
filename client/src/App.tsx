import { useEffect, useReducer, useState } from "react";
import { RouterProvider } from "react-router-dom";

import { StyledAppContainer } from "./styles";
import { Song } from "./utils/models";
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

const ws_io = new WebSocketConnection("ws://localhost:1235/ws");
window.ws = ws_io;

function App() {
  // const { queue, setQueue } = useQueue();
  const [paused, setPaused] = useState<boolean>(true);
  const [playingSong, setPlayingSong] = useState<Song | null>(null);
  const [playingSongIndex, setPlayingSongIndex] = useState(-1);

  const [state, dispatch] = useReducer(reducer, {
    paused: true,
    playingSong: {
      index: -1,
      metadatas: null,
    },
    queue: [],
  });

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

    const onPause = () => {};

    const onTestEvent = (msg: string) => {
      console.log(msg);
    };

    ws_io.on("test event", onTestEvent);

    return () => {
      ws_io.off("test event", onTestEvent);
    };

    // fetch latest saved queue
    // getQueue().then((queue) => dispatch({ type: "set queue", queue }));
  }, []);

  // useEffect(() => {
  //   const index = state.playingSong.index;
  //   if (index >= 0 && state.queue.length) {
  //     getSongMetadatas(state.queue[index]).then((song) =>
  //       dispatch({ type: "fetch success", payload: song })
  //     );
  //   }
  // }, [state.playingSong, state.queue]);

  return (
    <p>Hello world</p>
    // <DatasContext.Provider
    //   value={{
    //     queue,
    //     playingSong,
    //     paused,
    //     playingSongIndex,
    //   }}
    // >
    //   <DataMutatorsContext.Provider
    //     value={{
    //       setQueue: (queue: string[]) => {
    //         setQueue(queue);
    //       },
    //       setPaused,
    //       setPlayingSong: (song: Song | null) => {
    //         setPlayingSongIndex(-1);
    //         setPlayingSong(song);
    //       },
    //       setPlayingSongIndex: (index: number) => {
    //         if (index >= 0 && index < queue.length) {
    //           setPlayingSongIndex(index);
    //           getSongMetadatas(queue[index])
    //             .then((song) => setPlayingSong(song))
    //             .catch((err) => console.error(err));
    //         }
    //       },
    //     }}
    //   >
    //     <ThemeProvider theme={themes}>
    //       <StyledAppContainer>
    //         <AppContext.Provider value={{ state, dispatch }}>
    //           <RouterProvider router={router} />
    //         </AppContext.Provider>
    //       </StyledAppContainer>
    //     </ThemeProvider>
    //   </DataMutatorsContext.Provider>
    // </DatasContext.Provider>
  );
}

export default App;
