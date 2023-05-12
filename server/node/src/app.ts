import express from "express";
import * as dotenv from "dotenv";
import * as sqlite from "sqlite3";
import { Album } from "./models";
import { createCondition } from "./func";
import Cache from "./cache";

dotenv.config();

const port = process.env.PORT || 3000;
const database = process.env.DATABASE || "database.db";
const pageLength =
  (process.env.PAGE_LENGTH ? parseInt(process.env.PAGE_LENGTH) : null) || 50;

const db = new sqlite.Database(database, sqlite.OPEN_READWRITE, (err) => {
  if (err) console.error(`Failed to connect to database : ${err}`);
  else console.log(`Connected to ${database}`);
});

const app = express();

// /album?name=&artist=
app.get("/album", (req, res) => {
  const conditions = createCondition(req.query);

  if (conditions.length) {
    const albums: Album[] = [];
    db.each(
      `SELECT album, artist, duration, year, cover FROM song WHERE(${conditions})`.replace(
        "name",
        "album"
      ),
      (
        err,
        row: {
          album: string;
          artist: string;
          duration: number;
          year: number;
          cover?: string;
        }
      ) => {
        const stored = albums.find((album) => album.title === row.album);
        if (stored) {
          if (stored.artists.indexOf(row.artist) < 0)
            stored.artists.push(row.artist);
          stored.duration += row.duration;
          stored.track_count++;
          if (row.year > stored.year) stored.year = row.year;
          if (!stored.cover && row.cover) stored.cover = row.cover;
        } else {
          const album: Album = {
            title: row.album,
            artists: [],
            year: row.year,
            duration: row.duration,
            cover: row.cover,
            track_count: 1,
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
  } else res.sendStatus(404);
});

app.get("/albums", (req, res) => {
  const albums: Album[] = [];
  db.each(
    "SELECT album, artist, duration, year, cover FROM song",
    (
      err,
      row: {
        album: string;
        artist: string;
        duration: number;
        year: number;
        cover?: string;
      }
    ) => {
      const stored = albums.find((album) => album.title === row.album);
      if (stored) {
        if (stored.artists.indexOf(row.artist) < 0)
          stored.artists.push(row.artist);
        stored.duration += row.duration;
        stored.track_count++;
        if (row.year > stored.year) stored.year = row.year;
        if (!stored.cover && row.cover) stored.cover = row.cover;
      } else {
        const album: Album = {
          title: row.album,
          artists: [],
          year: row.year,
          duration: row.duration,
          cover: row.cover,
          track_count: 1,
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
  let pageIndex = 0;
  if (req.query.page) {
    try {
      pageIndex = parseInt(req.query.page as string);
    } catch {}
  }

  const sendPage = (songs: unknown[], pageIndex: number) => {
    const totalPage = Math.ceil(songs.length / pageLength);

    if (pageIndex < totalPage) {
      res.json({
        songs: songs.slice(pageIndex, pageIndex + pageLength),
        totalItems: songs.length,
        paging: {
          index: pageIndex,
          total: totalPage,
        },
      });
    } else res.status(400).send("Page index out of range.");
  };

  const handler = (err: Error | null, rows: unknown[]) => {
    if (err || rows.length === 0) res.sendStatus(404);
    else {
      Cache.lastResults = rows;
      sendPage(rows, pageIndex);
    }
  };

  const conditions = createCondition(req.query);
  if (Cache.lastQuery === conditions && Cache.lastResults.length) {
    // Using cached results
    sendPage(Cache.lastResults, pageIndex);
  } else {
    Cache.lastResults = [];

    if (conditions.length)
      db.all(`SELECT * FROM song WHERE(${conditions})`, [], handler);
    else db.all("SELECT * FROM song", [], handler);

    Cache.lastQuery = conditions;
  }
});

app.get("/song/:id", (req, res) => {
  db.get("SELECT * FROM song WHERE id = ?", [req.params.id], (err, row) => {
    if (err || !row) res.sendStatus(404);
    else res.json(row);
  });
});

app.get("/", (_, res) => {
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
