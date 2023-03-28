import { useState, useEffect } from "react";
import { ThemeProvider } from "styled-components";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { Home, Error } from "./pages";

import { StyledAppContainer } from "./styles";
import themes from "./styles/themes";
import jsmediatags from "jsmediatags";

function App() {
  const [audios, setAudios] = useState<String[]>([]);

  useEffect(() => {
    const readBlob = (blob: Blob) => {
      jsmediatags.read(blob, {
        onSuccess: (datas: any) => {
          console.log(datas);
        },
        onError: (error: any) => {
          console.error(error);
        },
      });
    };
    fetch("/test/Epitath/01 - Stabwound.mp3")
      .then((res) => res.blob())
      .then((blob) => readBlob(blob))
      .catch((error) => console.error(error));
  }, []);

  return (
    <ThemeProvider theme={themes}>
      <StyledAppContainer>
        <Router>
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="*" element={<Error />} />
          </Routes>
        </Router>
      </StyledAppContainer>
    </ThemeProvider>
  );
}

export default App;
