import { ThemeProvider } from "styled-components";
import { StyledAppContainer } from "./styles";
import themes from "./styles/themes";

function App() {
  return (
    <ThemeProvider theme={themes}>
      <StyledAppContainer>Hello World</StyledAppContainer>
    </ThemeProvider>
  );
}

export default App;
