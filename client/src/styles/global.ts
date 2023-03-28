import { createGlobalStyle } from "styled-components";
import poppins from "../assets/fonts/Poppins-Regular.ttf";

const GlobalStyles = createGlobalStyle`
  @font-face {
    font-family: poppins;
    src: url(${poppins});
  } 

  body {
    font-family: poppins, 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
    margin: 0;
    padding: 0;
    background: black;
  }
`;

export default GlobalStyles;