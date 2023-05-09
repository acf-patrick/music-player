import { createBrowserRouter } from "react-router-dom";
import { Home, Album, Error } from "./pages";
import {
  Songs,
  Playlists,
  Artists,
  Genres,
  Albums,
} from "./pages/Home/components";

const router = createBrowserRouter([
  {
    path: "/",
    element: <Home />,
    errorElement: import.meta.env.PROD ? <Error /> : undefined,
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

export default router;