import {
  albumRouter,
  artistRouter,
  genreRouter,
  imageRouter,
  playbackRouter,
  queueRouter,
  songRouter,
} from "./controllers";
import { db, app } from "./app";

const port = process.env.PORT || 3000;

const routes = [
  {
    path: "/album",
    router: albumRouter,
  },
  {
    path: "/artists",
    router: artistRouter,
  },
  {
    path: "/genres",
    router: genreRouter,
  },
  {
    path: "/image",
    router: imageRouter,
  },
  {
    path: "/queue",
    router: queueRouter,
  },
  {
    path: "/song",
    router: songRouter,
  },
  {
    path: "/playback",
    router: playbackRouter,
  },
];

for (let route of routes) {
  app.use(route.path, route.router);
}

app.get("/", (_, res) => {
  res.send("ayeee");
});

app.listen(port, () => {
  console.log(`Server listening on port ${port}`);
});

process.on("SIGTERM", () => {
  db.close((err) => {
    if (err) console.error(err);
    else console.log("Database connection closed.");
  });
});
