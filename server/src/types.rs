use actix::{Actor, Addr};
use rusqlite::Connection;
use serde::{Deserialize, Serialize};

use crate::{consts, server::web_socket::lobby::Lobby};

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

#[derive(Serialize, Clone)]
pub enum RepeatMode {
    NoRepeat,
    Once,
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

impl AppState {
    pub fn new() -> AppState {
        AppState {
            playing_song: PlayingSong {
                index: -1,
                paused: true,
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

    pub fn set_song_source(&mut self, source: Option<SongSource>) {
        self.song_source = source;
    }

    pub fn get_song_source(&self) -> Option<SongSource> {
        self.song_source.clone()
    }

    pub fn set_playing_song(&mut self, index: i16, paused: bool) {
        self.playing_song.index = index;
        self.playing_song.paused = paused;
    }

    pub fn get_playing_song(&self) -> PlayingSong {
        self.playing_song.clone()
    }
}

#[derive(Serialize, Clone)]
pub struct PlayingSong {
    pub index: i16,
    pub paused: bool,
}

#[derive(Deserialize, Serialize, Debug, Clone, PartialEq)]
#[serde(tag = "type", content = "name")]
pub enum SongSource {
    #[serde(rename = "album")]
    Album(String),
    #[serde(rename = "playlist")]
    Playlist(String),
}
