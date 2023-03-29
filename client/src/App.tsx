import { ThemeProvider } from "styled-components";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { AudioListContext } from "./utils";
import { Home, Error } from "./pages";
import { Loading } from "./components";

import { StyledAppContainer } from "./styles";
import themes from "./styles/themes";
import useAudios from "./utils/hook";

function App() {
  const { loading, audios } = useAudios();

  return (
    <ThemeProvider theme={themes}>
      {loading ? (
        <Loading />
      ) : (
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
      )}
    </ThemeProvider>
  );
}

export default App;
