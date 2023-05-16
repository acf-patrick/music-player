import { Router } from "express";
import { db } from "../app";
import Cache from "../cache";
import { createCondition } from "../func";

const pageLength =
  (process.env.PAGE_LENGTH ? parseInt(process.env.PAGE_LENGTH) : null) || 50;

const songRouter = Router();

/**
 * GET song
 * @param title Title of the song
 * @param artist Artist name
 * @param page Page index to retrieve
 */
songRouter.get("/", (req, res) => {
  if (!Cache.get("song"))
    Cache.set("song", {
      lastQuery: "",
      lastResults: [],
    });

  const cache = Cache.get("song")!;

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
      cache.lastResults = rows;
      sendPage(rows, pageIndex);
    }
  };

  const conditions = createCondition(req.query);

  if (cache.lastQuery === conditions && cache.lastResults.length) {
    // Using cached results
    sendPage(cache.lastResults, pageIndex);
  } else {
    cache.lastResults = [];

    if (conditions.length)
      db.all(`SELECT * FROM song WHERE(${conditions})`, [], handler);
    else db.all("SELECT * FROM song", [], handler);

    cache.lastQuery = conditions;
  }
});

/**
 * GET song
 * @param id Song identifier
 */
songRouter.get("/:id", (req, res) => {
  db.get("SELECT * FROM song WHERE id = ?", [req.params.id], (err, row) => {
    if (err || !row) res.sendStatus(404);
    else res.json(row);
  });
});

export default songRouter;
