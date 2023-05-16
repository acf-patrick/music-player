import { Router } from "express";
import { db } from "../app";

const genreRouter = Router();

/**
 * GET genres
 * @description Get all genres
 */
genreRouter.get("/", (req, res) => {
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

export default genreRouter;
