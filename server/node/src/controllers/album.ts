import { Router } from "express";
import { db } from "../app";
import { Album } from "../models";
import { createCondition } from "../func";

const albumRouter = Router();

/**
 * GET album
 * @param name album name
 * @param artist artist name
 */
albumRouter.get("/", (req, res) => {
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


/**
 * GET album/a
 * @description Get all albums
 */
albumRouter.get("/a", (req, res) => {
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

export default albumRouter;