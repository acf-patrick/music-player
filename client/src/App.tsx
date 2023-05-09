import { useState } from "react";
import { RouterProvider } from "react-router-dom";
import { DatasContext, DataMutatorsContext } from "./utils";

import { StyledAppContainer } from "./styles";
import { Song } from "./utils/models";
import { getSong } from "./utils/providers";
import { ThemeProvider } from "styled-components";
import { router } from "./router";
import themes from "./styles/themes";

// Set global volume to 50% by default
Howler.volume(0);

function App() {
  const [queue, setQueue] = useState<string[]>([]);
  const [paused, setPaused] = useState<boolean>(true);
  const [playingSong, setPlayingSong] = useState<Song | null>(null);
  const [playingSongIndex, setPlayingSongIndex] = useState(-1);

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
          setQueue,
          setPaused,
          setPlayingSong: (song: Song | null) => {
            setPlayingSongIndex(-1);
            setPlayingSong(song);
          },
          setPlayingSongIndex: (index: number) => {
            if (index >= 0 && index < queue.length) {
              setPlayingSongIndex(index);
              getSong(queue[index])
                .then((song) => setPlayingSong(song))
                .catch((err) => console.error(err));
            }
          },
        }}
      >
        <ThemeProvider theme={themes}>
          <StyledAppContainer>
            <RouterProvider router={router} />
          </StyledAppContainer>
        </ThemeProvider>
      </DataMutatorsContext.Provider>
    </DatasContext.Provider>
  );
}

export default App;
