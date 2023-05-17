import { db } from "./app";

const PlayingSong = {
  index: -1,
  paused: true,
};

/**
 * Return index of playing song in current queue
 * returns -1 if no song has been played
 */
function getPlayingSong() {
  return PlayingSong.index;
}

async function setPlayingSong(index: number) {
  return new Promise((res, rej) => {
    db.all("SELECT id FROM queue", [], (err, rows) => {
      if (err || !rows.length) console.error(err);
      else {
        if (index < rows.length && index >= 0) {
          PlayingSong.index = index;
          res(null);
        } else {
          rej("Failed to set playing song : Index out of range");
        }
      }
    });
  });
}

// Return whether current song's played or paused
function getPlayingSongState() {
  return PlayingSong.paused ? "pause" : "play";
}

function setPlayingSongState(play: boolean) {
  if (PlayingSong.index >= 0) {
    PlayingSong.paused = !play;
    return true;
  }
  return false;
}

export {
  setPlayingSong,
  getPlayingSong,
  setPlayingSongState,
  getPlayingSongState,
};
