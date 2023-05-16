import express from "express";
import * as dotenv from "dotenv";
import * as sqlite from "sqlite3";

dotenv.config();

const database = process.env.DATABASE || "database.db";

const db = new sqlite.Database(database, sqlite.OPEN_READWRITE, (err) => {
  if (err) console.error(`Failed to connect to database : ${err}`);
  else console.log(`Connected to ${database}`);
});

const app = express();
app.use(express.json());

export { db, app };