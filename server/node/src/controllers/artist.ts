import { Router } from "express";
import { db } from "../app";

const artistRouter = Router();

/**
 * GET artists
 * @description Get all artists
 */
artistRouter.get("/", (req, res) => {
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

export default artistRouter;