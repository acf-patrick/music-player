import express from "express";
import * as dotenv from "dotenv";
import * as sqlite from "sqlite3";
import { Album } from "./models";

dotenv.config();

const port = process.env.PORT || 3000;
const database = process.env.DATABASE || "database.db";
const pageLength =
  (process.env.PAGE_LENGTH ? parseInt(process.env.PAGE_LENGTH!) : null) || 50;

const db = new sqlite.Database(database, sqlite.OPEN_READWRITE, (err) => {
  if (err) console.error(`Failed to connect to database : ${err}`);
  else console.log(`Connected to ${database}`);
});

const app = express();

app.get("/album", (req, res) => {
  const albums: Album[] = [];

  const name = req.query.name;
  db.each(
    name
      ? `SELECT album, artist, duration FROM song WHERE album LIKE '%${name}%'`
      : "SELECT album, artist, duration FROM song",
    (err, row: { album: string; artist: string; duration: number }) => {
      const stored = albums.find((album) => album.name === row.album);
      if (stored) {
        if (stored.artists.indexOf(row.artist) < 0)
          stored.artists.push(row.artist);
        stored.duration += row.duration;
      } else {
        const album: Album = {
          name: row.album,
          artists: [],
          duration: row.duration,
        };
        album.artists.push(row.artist);
        albums.push(album);
      }
    },
    (err, count) => {
      if (err) console.error(err);

      if (err || !count) res.sendStatus(404);
      else res.json(albums);
    }
  );
});

app.get("/artists", (req, res) => {
  const artists: string[] = [];
  db.each(
    "SELECT DISTINCT artist FROM song",
    (err, row: { artist: string }) => {
      artists.push(row.artist);
    },
    (err, count) => {
      if (err) console.error(err);

      if (err || !count) res.sendStatus(404);
      res.json(artists);
    }
  );
});

app.get("/genres", (req, res) => {
  const genres: string[] = [];
  db.each(
    "SELECT DISTINCT genre FROM song",
    (err, row: { genre: string }) => {
      genres.push(row.genre);
    },
    (err, count) => {
      if (err) console.error(err);

      if (err || !count) res.sendStatus(404);
      res.json(genres);
    }
  );
});

// /song?title=&page=
app.get("/song", (req, res) => {
  const handler = (err: Error | null, rows: unknown[]) => {
    if (err || !rows) res.sendStatus(404);
    else {
      const totalPage = Math.ceil(rows.length / pageLength);
      let pageIndex = 0;
      if (req.query.page) {
        try {
          pageIndex = parseInt(req.query.page as string);
        } catch {}
      }

      if (pageIndex < totalPage)
        res.json({
          songs: rows.slice(pageIndex, pageIndex + pageLength),
          paging: {
            index: pageIndex,
            total: totalPage,
          },
        });
      else res.status(400).send("Page index out of range.");
    }
  };

  if (req.query.title)
    // Failed to fetch if params are put in the array below 🤔
    db.all(
      `SELECT * FROM song WHERE title LIKE '%${req.query.title}%'`,
      [],
      handler
    );
  else db.all("SELECT * FROM song", [], handler);
});

app.get("/song/:id", (req, res) => {
  db.get("SELECT * FROM song WHERE id = ?", [req.params.id], (err, row) => {
    if (err || !row) res.sendStatus(404);
    else res.json(row);
  });
});

app.get("/", (req, res) => {
  res.send("ayeeee");
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
