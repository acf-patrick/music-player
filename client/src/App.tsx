import { useState } from "react";
import { ThemeProvider } from "styled-components";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { DatasContext, DataMutatorsContext } from "./utils";
import { Home, Album, Error } from "./pages";

import { StyledAppContainer } from "./styles";
import themes from "./styles/themes";
import { Song } from "./utils/models";
import { getSong } from "./utils/providers";

// Set global volume to 50% by default
Howler.volume(0);

function App() {
  const [queue, setQueue] = useState<string[]>([]);
  const [paused, setPaused] = useState<boolean>(true);
  const [playingSong, setPlayingSong] = useState<Song | null>(null);
  const [playingSongIndex, setPlayingSongIndex] = useState(-1);

  return (
    <ThemeProvider theme={themes}>
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
          <StyledAppContainer>
            <Home />
          </StyledAppContainer>
        </DataMutatorsContext.Provider>
      </DatasContext.Provider>
    </ThemeProvider>
  );
}

export default App;
