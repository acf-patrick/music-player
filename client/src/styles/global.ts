import { createGlobalStyle } from "styled-components";

const GlobalStyles = createGlobalStyle`
  @font-face {
    font-family: poppins;
    src: url("/fonts/Poppins-Regular.ttf");
  } 

  body {
    font-family: poppins, 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
    margin: 0;
    padding: 0;
    user-select: ${() => (import.meta.env.PROD ? "none" : "auto")};
  }
`;

export default GlobalStyles;
