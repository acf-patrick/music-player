import React from "react";
import ReactDOM from "react-dom/client";
import { GlobalStyles } from "./styles";
import App from "./App";
import { Album, Error } from "./pages";
import {
  Songs,
  Artists,
  Playlists,
  Genres,
  Albums,
} from "./pages/Home/components/";
import { createBrowserRouter, RouterProvider } from "react-router-dom";

const router = createBrowserRouter([
  {
    path: "/",
    element: <App />,
    // errorElement: <Error/>,
    children: [
      {
        path: "/",
        element: <Songs />,
      },
      {
        path: "playlists",
        element: <Playlists />,
      },
      {
        path: "artists",
        element: <Artists />,
      },
      {
        path: "genres",
        element: <Genres />,
      },
      {
        path: "albums",
        element: <Albums />,
      },
    ],
  },
  {
    path: "/album/:name",
    element: <Album />,
  },
]);

// Disable right click
if (import.meta.env.PROD) {
  document.addEventListener("contextmenu", (e) => {
    e.preventDefault();
  });
}

ReactDOM.createRoot(document.getElementById("root") as HTMLElement).render(
  <React.StrictMode>
    <GlobalStyles />
    <RouterProvider router={router} />
  </React.StrictMode>
);
