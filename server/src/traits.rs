use rusqlite::Connection;
use super::types;

pub trait Read {
  fn read (&self, conn: &mut Connection) -> bool;
}

pub trait Write {
  fn write(&self, conn: &mut Connection) -> bool;
}

impl Read for types::Song {
  fn read (&self, conn: &mut Connection) -> bool {
      return true;
  }
}

impl Read for types::Album {
  fn read (&self, conn: &mut Connection) -> bool {
      return true;
  }
}

impl Read for types::Image {
  fn read (&self, conn: &mut Connection) -> bool {
      return true;
  }
}

impl Read for types::Playlist {
  fn read (&self, conn: &mut Connection) -> bool {
      return true;
  }
}