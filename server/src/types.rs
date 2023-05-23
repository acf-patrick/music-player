use rusqlite::Connection;
use serde::Serialize;

use std::sync::Mutex;

pub mod cache {
    use crate::server::database::model;

    pub struct Image {
        pub id: Option<String>,
        pub data: Option<model::Image>,
    }

    pub struct Song {
        pub query: Option<String>,
        pub result: Vec<model::Song>,
    }
}

pub struct AppState {
    pub playing_song: PlayingSong,
    pub image_cache: Mutex<cache::Image>,
    pub song_cache: Mutex<cache::Song>,
    pub db: Mutex<Connection>,
}

#[derive(Serialize, Clone)]
pub struct PlayingSong {
    pub index: i16,
    pub paused: bool,
}
