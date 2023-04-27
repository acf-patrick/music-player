import { error } from "console";
import express from "express";
import * as sqlite from "sqlite3";

const PORT = 3000;
const DATABASE = "database.db";

const db = new sqlite.Database(DATABASE, sqlite.OPEN_READWRITE, (err) => {
  if (err) console.error(`Failed to connect to database : ${err}`);
  else console.log(`Connected to ${DATABASE}`);
});

const app = express();

app.get("/song/:id", (req, res) => {
  db.get("SELECT * FROM song WHERE id = ?", [req.params.id], (error) => {
    
  })
})

app.get("/", (req, res) => {
  res.send("ayeeee");
});

app.listen(PORT, () => {
  console.log(`Server listening on port ${PORT}`);
});

process.on("SIGTERM", () => {
  db.close((err) => {
    if (err) console.error(err);
    else console.log("Database connection closed.");
  });
});
