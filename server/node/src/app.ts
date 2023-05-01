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
    `SELECT album, artist, duration, cover FROM song${
      name ? ` WHERE album LIKE '%${name}%'` : ""
    }`,
    (
      err,
      row: { album: string; artist: string; duration: number; cover?: string }
    ) => {
      const stored = albums.find((album) => album.name === row.album);
      if (stored) {
        if (stored.artists.indexOf(row.artist) < 0)
          stored.artists.push(row.artist);
        stored.duration += row.duration;
        if (!stored.cover && row.cover) stored.cover = row.cover;
      } else {
        const album: Album = {
          name: row.album,
          artists: [],
          duration: row.duration,
          cover: row.cover,
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

app.get("/image/:id", (req, res) => {
  if (req.params.id) {
    db.get(
      "SELECT * FROM image WHERE id = ?",
      req.params.id,
      (
        err,
        row: {
          id: string;
          mime_type: string;
          data: any;
        }
      ) => {
        res.json(row);
      }
    );
  } else res.sendStatus(404);
});

// /song?title=&artist=&page
app.get("/song", (req, res) => {
  const handler = (err: Error | null, rows: unknown[]) => {
    if (err || rows.length === 0) res.sendStatus(404);
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

  const len = Object.keys(req.query).length;
  if (len > 0) {
    let i = 0;
    let condition = "";
    for (let key in req.query) {
      condition += `${key} LIKE '%${req.query[key]}%'`;
      if (i < len - 1) condition += " AND ";
      i++;
    }

    db.all(`SELECT * FROM song WHERE(${condition})`, [], handler);
  } else db.all("SELECT * FROM song", [], handler);
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
