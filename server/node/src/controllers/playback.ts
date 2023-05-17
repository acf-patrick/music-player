import { Router } from "express";
import {
  getPlayingSong,
  getPlayingSongState,
  setPlayingSong,
  setPlayingSongState,
} from "../state";

const playbackRouter = Router();

/**
 * GET /playback/song
 * Get queue.id of currently playing song
 */
playbackRouter.get("/", (req, res) => {
  res.send({
    index: getPlayingSong(),
    state: getPlayingSongState(),
  });
});

/**
 * POST /playback/pause
 * Pause player
 */
playbackRouter.post("/pause", (req, res) => {
  if (setPlayingSongState(false)) res.sendStatus(200);
  else res.status(400).send("No playing song");
});

/**
 * POST /playback/play
 * Play player
 */
playbackRouter.post("/play", (req, res) => {
  if (req.body) {
    setPlayingSong(req.body.index)
      .then(() => {
        setPlayingSongState(true);
        res.sendStatus(200);
      })
      .catch((err) => res.status(400).send(err));
  } else {
    if (setPlayingSongState(true)) res.sendStatus(200);
    else res.status(400).send("No playing song");
  }
});

export default playbackRouter;
