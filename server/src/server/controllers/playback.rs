use crate::{
    get_app_state,
    types::{AppState, PlayingSong, SongSource},
};
use actix_web::{get, post, web, HttpResponse, Responder};
use rusqlite::{params, Connection};
use serde::Deserialize;
use serde_rusqlite::from_rows;
use std::sync::{Arc, Mutex};
use uuid::Uuid;

#[get("")]
pub async fn get_playback(data: web::Data<Arc<Mutex<AppState>>>) -> impl Responder {
    let state = get_app_state!(data);
    let playing_song = state.get_playing_song();
    HttpResponse::Ok().json(playing_song)
}

#[derive(Deserialize)]
struct QueueRow {
    id: u32,
    song: String,
}

#[get("/next")]
pub async fn set_to_next_song(data: web::Data<Arc<Mutex<AppState>>>) -> impl Responder {
    let mut data = get_app_state!(data);
    let playing_song = data.get_playing_song();
    let index = playing_song.index;

    match set_playing_song(&mut data, index + 1, false) {
        Ok(playing_song) => HttpResponse::Ok().json(playing_song),
        Err(error) => {
            eprintln!("{error}");
            HttpResponse::BadRequest().json(error)
        }
    }
}

#[get("/prev")]
pub async fn set_to_previous_song(data: web::Data<Arc<Mutex<AppState>>>) -> impl Responder {
    let mut data = get_app_state!(data);
    let playing_song = data.get_playing_song();
    let index = playing_song.index;

    match set_playing_song(&mut data, index - 1, false) {
        Ok(playing_song) => HttpResponse::Ok().json(playing_song),
        Err(error) => {
            eprintln!("{error}");
            HttpResponse::BadRequest().json(error)
        }
    }
}

#[get("/pause")]
pub async fn pause(data: web::Data<Arc<Mutex<AppState>>>) -> impl Responder {
    let mut state = get_app_state!(data);
    let playing_song = state.get_playing_song();
    state.set_playing_song(playing_song.index, true);

    HttpResponse::Ok().finish()
}

#[get("/play")]
pub async fn play(data: web::Data<Arc<Mutex<AppState>>>) -> impl Responder {
    let mut state = get_app_state!(data);
    let playing_song = state.get_playing_song();

    // If no song is playing, play the first song
    let index = if playing_song.index < 0 {
        0
    } else {
        playing_song.index
    };

    state.set_playing_song(index, false);

    HttpResponse::Ok().finish()
}

#[derive(Deserialize, Debug)]
#[serde(tag = "source")]
enum SongDto {
    #[serde(rename = "queue")]
    FromQueue { index: usize },

    #[serde(rename = "new")]
    FromNewSource { index: usize, provider: SongSource },

    #[serde(rename = "none")]
    None { id: Uuid },
}

#[post("/play")]
pub async fn play_song(
    req_body: web::Json<SongDto>,
    data: web::Data<Arc<Mutex<AppState>>>,
) -> impl Responder {
    let mut state = get_app_state!(data);

    match req_body.0 {
        SongDto::FromNewSource { index, provider } => {
          match provider {
            SongSource::Album(source) => {

            }

            SongSource::Playlist(source) => {
              
            }
          }
        }

        SongDto::FromQueue { index } => {}

        SongDto::None { id } => {}
    }

    ""
}

/// Play n-th song in a given source.
/// Source can be either a playlist or album or just current queue
// #[post("/play")]
// pub async fn play_song(req_body: web::Json<ReqBody>, data: web::Data<AppState>) -> impl Responder {
//     let db: Connection = get_db_conn!(data);
//     let mut playing_song = data.get_playing_song().unwrap();
//     let song_source = data.get_song_source().unwrap();

//     if song_source == req_body.source {
//         if playing_song.index == req_body.song_index {
//             data.set_playing_song(playing_song.index, false);
//         }
//     }

//     if let Some(source) = req_body.source {
//         match &source {
//             SongSource::Album(name) => {
//                 // Checking if given album exists in database
//                 if let Err(_) = db.query_row(
//                     "SELECT album FROM song WHERE album = \"?\"",
//                     [name],
//                     |row| row.get(0),
//                 ) {
//                     return HttpResponse::BadRequest()
//                         .body(format!("There is no song for album : {name}"));
//                 }

//                 // Remove a record from current queue
//                 if let Err(error) = db.execute("DELETE FROM queue", []) {
//                     eprintln!("{error}");
//                     return HttpResponse::InternalServerError().body(format!("{error}"));
//                 } else {
//                     // Get all songs associated with the given, album ordered by their track number
//                     let rows = db
//                         .prepare(
//                             r#"
//                   WITH subquery AS (
//                     SELECT id, track_number FROM song WHERE album = \"?\"
//                   ) SELECT id FROM subquery ORDER BY track_number"#,
//                         )
//                         .unwrap()
//                         .query([name])
//                         .unwrap();

//                     // Push songs to queue
//                     let song_ids: Vec<String> =
//                         from_rows::<Row>(rows).map(|row| row.unwrap().id).collect();
//                     for (index, id) in song_ids.iter().enumerate() {
//                         db.execute("INSERT INTO queue VALUES(?, ?)", params![index, id]);
//                     }
//                 }
//             }
//             _ => {
//                 // test
//             }
//         }
//     }

//     HttpResponse::Ok().finish()
// }

fn set_playing_song(data: &mut AppState, index: i16, paused: bool) -> Result<PlayingSong, String> {
    let db = &data.db;

    // Ordered list of song ids in the queue
    let mut song_ids: Vec<String> = vec![];

    match db.prepare("SELECT * FROM queue ORDER BY id") {
        Ok(mut stmt) => {
            if let Ok(rows) = stmt.query([]) {
                let iter = from_rows::<QueueRow>(rows);
                song_ids = iter.map(|row| row.unwrap().song).collect();
            }
        }
        Err(error) => {
            eprintln!("{error}");
        }
    }

    if !song_ids.is_empty() {
        if index >= song_ids.len().try_into().unwrap() || index < 0 {
            Err(String::from("Song index out of range."))
        } else {
            data.set_playing_song(index, paused);
            let playing_song = data.get_playing_song();
            Ok(playing_song)
        }
    } else {
        Err(String::from("Queue is empty"))
    }
}
