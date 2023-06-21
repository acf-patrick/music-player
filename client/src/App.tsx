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

// Set global volume to 50% by default
Howler.volume(0);

function App() {
  const { queue, setQueue } = useQueue();
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
    getQueue().then((queue) => dispatch({ type: "set queue", queue }));
  }, []);

  useEffect(() => {
    const index = state.playingSong.index;
    if (index >= 0 && state.queue.length) {
      getSongMetadatas(state.queue[index]).then((song) =>
        dispatch({ type: "fetch success", payload: song })
      );
    }
  }, [state.playingSong, state.queue]);

  return (
    <DatasContext.Provider
      value={{
        queue,
        playingSong,
        paused,
        playingSongIndex,
      }}
    >
      <DataMutatorsContext.Provider
        value={{
          setQueue: (queue: string[]) => {
            setQueue(queue);
          },
          setPaused,
          setPlayingSong: (song: Song | null) => {
            setPlayingSongIndex(-1);
            setPlayingSong(song);
          },
          setPlayingSongIndex: (index: number) => {
            if (index >= 0 && index < queue.length) {
              setPlayingSongIndex(index);
              getSongMetadatas(queue[index])
                .then((song) => setPlayingSong(song))
                .catch((err) => console.error(err));
            }
          },
        }}
      >
        <ThemeProvider theme={themes}>
          <StyledAppContainer>
            <AppContext.Provider value={{ state, dispatch }}>
              <RouterProvider router={router} />
            </AppContext.Provider>
          </StyledAppContainer>
        </ThemeProvider>
      </DataMutatorsContext.Provider>
    </DatasContext.Provider>
  );
}

export default App;
