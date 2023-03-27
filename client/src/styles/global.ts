import { createGlobalStyle } from "styled-components";
import "../assets/fonts/Poppins-Regular.ttf";

const GlobalStyles = createGlobalStyle`
  @font-face {
    font-family: poppins;
    src: url("../assets/fonts/Poppins-Regular.ttf");
  } 

  body {
    font-family: poppins, 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
    margin: 0;
    padding: 0;
  }
`;

export default GlobalStyles;