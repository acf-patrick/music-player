import { useState, useEffect, createContext } from "react";
import { ThemeProvider } from "styled-components";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { AudioListContext } from "./utils";
import { Home, Error } from "./pages";

import { StyledAppContainer } from "./styles";
import themes from "./styles/themes";
import { Audio } from "./utils/models";
import getAudios from "./utils/hook";

function App() {
  const audios = getAudios();

  /* useEffect(() => {
    const readBlob = (blob: Blob) => {
      jsmediatags.read(blob, {
        onSuccess: (datas: any) => {
          const { data, format } = datas.tags.picture;
          let str = "";
          for (let byte of data) str += String.fromCharCode(byte);
          image.current!.src = `data:${format};base64,${btoa(str)}`;
        },
        onError: (error: any) => {
          console.error(error);
        },
      });
    };

    fetch("/test/Epitath/05 - Epitaph.mp3")
      .then((res) => res.blob())
      .then((blob) => readBlob(blob))
      .catch((error) => console.error(error));
  }, []); */

  return (
    <ThemeProvider theme={themes}>
      <AudioListContext.Provider value={audios}>
        <StyledAppContainer>
          <Router>
            <Routes>
              <Route path="/" element={<Home />} />
              <Route path="*" element={<Error />} />
            </Routes>
          </Router>
        </StyledAppContainer>
      </AudioListContext.Provider>
    </ThemeProvider>
  );
}

export default App;
