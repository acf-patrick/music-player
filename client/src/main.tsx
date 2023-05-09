import React from "react";
import ReactDOM from "react-dom/client";
import { GlobalStyles } from "./styles";
import App from "./App";

// Disable right click
if (import.meta.env.PROD) {
  document.addEventListener("contextmenu", (e) => {
    e.preventDefault();
  });
}

ReactDOM.createRoot(document.getElementById("root") as HTMLElement).render(
  <React.StrictMode>
    <GlobalStyles />
    <App />
  </React.StrictMode>
);
