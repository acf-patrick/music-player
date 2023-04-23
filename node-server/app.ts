import express from "express";
import path from "path";
import * as sqlite from "sqlite3";

// Database connection
const DATABASE = "test.db";
const db = new sqlite.Database(
  DATABASE,
  sqlite.OPEN_READWRITE | sqlite.OPEN_CREATE,
  (error) => {
    if (error) console.error(error.message);
    console.log(`Connected to database ${DATABASE}`);
  }
);

db.exec(`CREATE TABLE user(
  id INT PRIMARY KEY,
  name VARCHAR(255),
  age INT
)`);

const app = express();
const port = process.env.PORT || 8000;

app.listen(port, () => {
  console.log(`Server listening on port ${port}`);
});

db.close((error) => {
  if (error) console.error(error);
  console.log(`Database ${DATABASE} closed.`);
});
