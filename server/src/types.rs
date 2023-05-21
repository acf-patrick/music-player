use serde::{Deserialize, Serialize};

pub mod cache {
    pub struct Image {
        pub id: Option<String>,
        pub data: Option<super::Image>,
    }

    pub struct Song {
        pub query: Option<String>,
        pub result: Vec<super::Song>,
    }
}

#[derive(Serialize, Clone)]
pub struct PlayingSong {
    pub index: i16,
    pub paused: bool,
}

#[derive(Deserialize, Serialize)]
pub struct Image {
    pub id: String, // generated using SHA256
    pub mime_type: String,
    pub data: Vec<u8>,
}

#[derive(Serialize)]
pub struct Album {
    pub title: String,
    pub artists: Vec<String>,
    pub year: u16,
    pub duration: u32,
    pub cover: Option<String>, // ID to one of image table record
    pub track_count: u8,       // number of tracks
}

#[derive(Debug, Deserialize, Serialize, Clone)]
pub struct Song {
    pub id: String,   // generated using SHA256
    pub path: String, // path to the audio file
    pub liked: bool,
    pub year: Option<u32>,
    pub title: Option<String>,
    pub artist: Option<String>,
    pub genre: Option<String>,
    pub track_number: Option<u32>,
    pub cover: Option<String>, // ID to one of image table record
    pub album: Option<String>, // title of one of album table record
    pub duration: Option<u64>, // Song duration in seconds
}

#[derive(Debug)]
pub struct Playlist {
    pub id: u8,
    pub name: String,
    pub song: String, // ID to one of song table record
}

impl Song {
    pub fn new(id: String, path: String) -> Self {
        Song {
            id,
            path,
            liked: false,
            year: None,
            title: None,
            artist: None,
            genre: None,
            track_number: None,
            cover: None,
            album: None,
            duration: None,
        }
    }
}
