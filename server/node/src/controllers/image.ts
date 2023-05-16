import { Router } from "express";
import { db } from "../app";
import Cache from "../cache";

const imageRouter = Router();

/**
 * GET image
 * @param id Image identifier
 */
imageRouter.get("/:id", (req, res) => {
  if (!Cache.get("image")) {
    Cache.set("image", {
      lastQuery: "",
      lastResults: [],
    });
  }
  const cache = Cache.get("image")!;

  if (req.params.id) {
    if (cache.lastQuery === req.params.id) {
      res.json(cache.lastResults);
    } else {
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
          cache.lastQuery = req.params.id;
          cache.lastResults = row;
          res.json(row);
        }
      );
    }
  } else res.sendStatus(404);
});

export default imageRouter;