use actix::Addr;
use rusqlite::{params, Connection};
use serde::{Deserialize, Serialize};
use serde_rusqlite::from_rows;

use crate::{
    consts,
    server::{database::model::PlaylistRecord, web_socket::lobby::Lobby},
};

#[macro_export]
macro_rules! get_app_state {
    ($state: ident) => {
        $state
            .lock()
            .expect("Cannot get lock on application state.")
    };
}

pub mod cache {
    use crate::server::database::model;

    #[derive(Clone)]
    pub struct Image {
        pub id: Option<String>,
        pub data: Option<model::Image>,
    }

    #[derive(Clone)]
    pub struct Song {
        pub query: Option<String>,
        pub result: Vec<model::Song>,
    }

    #[derive(Clone)]
    pub struct Lyrics {
        pub artist: Option<String>,
        pub song: Option<String>,
        pub lyrics: String,
    }
}

#[derive(Serialize, Deserialize, Clone)]
pub enum RepeatMode {
    #[serde(rename = "no repeat")]
    NoRepeat,

    #[serde(rename = "once")]
    Once,

    #[serde(rename = "indefinitely")]
    Indefinitely,
}

pub struct AppState {
    playing_song: PlayingSong,
    song_source: Option<SongSource>,
    repeat_mode: RepeatMode,
    pub ws_server: Option<Addr<Lobby>>,
    pub image_cache: cache::Image,
    pub song_cache: cache::Song,
    pub lyrics_cache: cache::Lyrics,
    pub db: Connection,
}

#[derive(Serialize, Deserialize, Clone)]
pub struct PlaybackData {
    pub playing_song: PlayingSong,
    pub repeat_mode: RepeatMode,
    pub source: Option<SongSource>,
}

impl PlaybackData {
    pub fn from(app_state: &AppState) -> PlaybackData {
        PlaybackData {
            playing_song: app_state.get_playing_song(),
            repeat_mode: app_state.get_repeat_mode(),
            source: app_state.get_song_source(),
        }
    }
}

// TODO : notify via socket on playback updates

/// Error response when setting song source
pub enum SetSongSourceError {
    DbError(String),
    ReqError(String),
}

impl AppState {
    pub fn new() -> AppState {
        AppState {
            playing_song: PlayingSong {
                index: -1,
                paused: true,
                progress: 0.0,
            },
            repeat_mode: RepeatMode::NoRepeat,
            image_cache: cache::Image {
                id: None,
                data: None,
            },
            song_cache: cache::Song {
                query: None,
                result: vec![],
            },
            lyrics_cache: cache::Lyrics {
                artist: None,
                song: None,
                lyrics: String::new(),
            },
            song_source: None,
            ws_server: None,
            db: Connection::open(consts::DATABASE).expect("Can not connect to database."),
        }
    }

    pub fn set_repeat_mode(&mut self, repeat_mode: RepeatMode) {
        self.repeat_mode = repeat_mode;
    }

    pub fn get_repeat_mode(&self) -> RepeatMode {
        self.repeat_mode.clone()
    }

    pub fn set_song_source(&mut self, source: SongSource) -> Result<(), SetSongSourceError> {
        if self.song_source.is_some() {
            if source == self.song_source.clone().unwrap() {
                return Ok(());
            }
        }

        match source.clone() {
            SongSource::Album(album) => {
                match self
                    .db
                    .prepare("SELECT album FROM song WHERE album = ? LIMIT 1")
                {
                    Ok(mut stmt) => {
                        if let Err(error) = stmt.query_row([&album], |row| {
                            let album: String = row.get(0)?;
                            Ok(album)
                        }) {
                            eprintln!("{error}");
                            return Err(SetSongSourceError::ReqError(String::from(
                                "Album name not found",
                            )));
                        }
                    }

                    Err(error) => {
                        eprintln!("{error}");
                        return Err(SetSongSourceError::DbError(format!("{error}")));
                    }
                }
            }

            SongSource::Playlist(playlist) => {
                match self
                    .db
                    .prepare("SELECT name FROM playlist WHERE name = ? LIMIT 1")
                {
                    Ok(mut stmt) => {
                        if let Err(error) = stmt.query_row([&playlist], |row| {
                            let playlist: String = row.get(0)?;
                            Ok(playlist)
                        }) {
                            eprintln!("{error}");
                            return Err(SetSongSourceError::ReqError(String::from(
                                "Playlist not found",
                            )));
                        }
                    }

                    Err(error) => {
                        eprintln!("{error}");
                        return Err(SetSongSourceError::DbError(format!("{error}")));
                    }
                }
            }
        }

        if self.db.execute("DELETE FROM queue", []).is_err() {
            Err(SetSongSourceError::DbError(String::from(
                "Failed to clear current queue.",
            )))
        } else {
            self.song_source = Some(source.clone());

            match source {
                SongSource::Album(album) => {
                    match self.db.prepare(
                        "SELECT id FROM song WHERE album = ? ORDER BY track_number ASC NULLS LAST",
                    ) {
                        Ok(mut stmt) => match stmt.query([&album]) {
                            Ok(rows) => {
                                let ids = from_rows::<String>(rows).map(|id| id.unwrap());
                                for (i, id) in ids.enumerate() {
                                    let _ = self
                                        .db
                                        .execute("INSERT INTO queue VALUES(?, ?)", params![i, id]);
                                }
                            }

                            Err(error) => {
                                eprintln!("{error}");
                                return Err(SetSongSourceError::ReqError(format!("{error}")));
                            }
                        },

                        Err(error) => {
                            eprintln!("{error}");
                            return Err(SetSongSourceError::DbError(format!("{error}")));
                        }
                    }
                }

                SongSource::Playlist(playlist) => {
                    match self
                        .db
                        .prepare("SELECT * FROM playlist WHERE name = ? ORDER BY song_index")
                    {
                        Ok(mut stmt) => match stmt.query([&playlist]) {
                            Ok(rows) => {
                                let rows =
                                    from_rows::<PlaylistRecord>(rows).map(|row| row.unwrap());
                                for PlaylistRecord {
                                    song, song_index, ..
                                } in rows
                                {
                                    let _ = self.db.execute(
                                        "INSERT INTO queue VALUES(?, ?)",
                                        params![song_index, song],
                                    );
                                }
                            }

                            Err(error) => {
                                eprintln!("{error}");
                                return Err(SetSongSourceError::ReqError(format!("{error}")));
                            }
                        },

                        Err(error) => {
                            eprintln!("{error}");
                            return Err(SetSongSourceError::DbError(format!("{error}")));
                        }
                    }
                }
            }

            Ok(())
        }
    }

    pub fn get_song_source(&self) -> Option<SongSource> {
        self.song_source.clone()
    }

    pub fn set_playing_song(&mut self, index: i16, paused: bool) -> Result<(), String> {
        if self.playing_song.index == index {
            self.playing_song.paused = paused;
            Ok(())
        } else {
            let count = self
                .db
                .query_row("SELECT COUNT(id) FROM song", [], |row| {
                    let count: usize = row.get(0)?;
                    Ok(count)
                })
                .unwrap();

            let res = if count > 0 {
                if index >= count.try_into().unwrap() || index < 0 {
                    Err(String::from("Song index out of range."))
                } else {
                    self.playing_song.progress = 0.0;
                    self.playing_song.index = index;

                    self.playing_song.paused = paused;
                    Ok(())
                }
            } else {
                Err(String::from("Queue is empty"))
            };

            res
        }
    }

    pub fn get_playing_song(&self) -> PlayingSong {
        self.playing_song.clone()
    }
}

#[derive(Serialize, Deserialize, Clone)]
pub struct PlayingSong {
    pub index: i16,
    pub paused: bool,
    pub progress: f32, // 0.0 -> 1.0
}

#[derive(Deserialize, Serialize, Debug, Clone, PartialEq)]
#[serde(tag = "type", content = "name")]
pub enum SongSource {
    #[serde(rename = "album")]
    Album(String),
    #[serde(rename = "playlist")]
    Playlist(String),
}
