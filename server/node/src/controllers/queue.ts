import { db } from "../app";
import { Router } from "express";

const queueRouter = Router();

/**
 * GET queue
 * Get song list in current queue
 */
queueRouter.get("/", (req, res) => {
  db.all("SELECT * FROM queue", (err, row: { id: number; song: string }[]) => {
    if (err) console.error(err);
    res.json(row.map((record) => record.song));
  });
});

/**
 * POST queue
 * Append song to current queue
 */
queueRouter.post("/", (req, res) => {
  db.exec(`INSERT INTO queue(song) VALUES("${req.body.id}")`, (err) => {
    if (err) {
      console.error(err);
      res.status(400).json(err);
    } else {
      res.sendStatus(200);
    }
  });
});

/**
 * POST queue/clear
 * Remove all songs from the queue
 */
queueRouter.post("/clear", (req, res) => {
  db.exec("DELETE FROM queue;", (err) => {
    if (err) {
      console.error(err);
      res.status(400).json(err);
    } else {
      res.sendStatus(200);
    }
  });
});

/**
 * DELETE queue
 * Remove song from queue
 * @param id Song identifier
 */
queueRouter.delete("/queue/:id", (req, res) => {
  const id = req.params.id;
  if (!id) {
    res.sendStatus(400);
  }

  db.exec(`DELETE FROM queue WHERE song=${id}`, (err) => {
    if (err) {
      console.error(err);
      res.status(400).json(err);
    } else {
      res.sendStatus(200);
    }
  });
});

export default queueRouter;
