use crate::{
    get_app_state,
    types::{AppState, PlaybackData, SetSongSourceError, SongSource},
};

use actix_web::{get, post, web, HttpResponse, Responder};
use rusqlite::{params, Connection};
use serde::Deserialize;
use std::sync::{Arc, Mutex};
use uuid::Uuid;

#[get("")]
pub async fn get_playback(data: web::Data<Arc<Mutex<AppState>>>) -> impl Responder {
    let state = get_app_state!(data);
    HttpResponse::Ok().json(PlaybackData::from(&state))
}

#[allow(dead_code)]
#[derive(Deserialize)]
struct QueueRow {
    id: u32,
    song: String,
}

#[post("/next")]
pub async fn set_to_next_song(data: web::Data<Arc<Mutex<AppState>>>) -> impl Responder {
    let mut data = get_app_state!(data);
    let playing_song = data.get_playing_song();
    let index = playing_song.index;

    match data.set_playing_song(index + 1, false) {
        Ok(_) => HttpResponse::Ok().finish(),
        Err(error) => {
            eprintln!("{error}");
            HttpResponse::BadRequest().json(error)
        }
    }
}

#[post("/prev")]
pub async fn set_to_previous_song(data: web::Data<Arc<Mutex<AppState>>>) -> impl Responder {
    let mut data = get_app_state!(data);
    let playing_song = data.get_playing_song();
    let index = playing_song.index;

    match data.set_playing_song(index - 1, false) {
        Ok(_) => HttpResponse::Ok().finish(),
        Err(error) => {
            eprintln!("{error}");
            HttpResponse::BadRequest().json(error)
        }
    }
}

#[post("/pause")]
pub async fn pause(data: web::Data<Arc<Mutex<AppState>>>) -> impl Responder {
    let mut state = get_app_state!(data);
    let playing_song = state.get_playing_song();
    let _ = state.set_playing_song(playing_song.index, true);

    HttpResponse::Ok().finish()
}

/// Resume current playing song. This way we don't have to provide current song index from the queue
#[post("/resume")]
pub async fn resume(data: web::Data<Arc<Mutex<AppState>>>) -> impl Responder {
    let mut state = get_app_state!(data);
    let playing_song = state.get_playing_song();
    if playing_song.index >= 0 {
        let _ = state.set_playing_song(playing_song.index, false);
    }

    HttpResponse::Ok().finish()
}

#[derive(Deserialize, Debug)]
#[serde(tag = "source")]
pub enum SongDto {
    #[serde(rename = "queue")]
    FromQueue { index: usize },

    #[serde(rename = "new")]
    FromNewSource { index: usize, provider: SongSource },

    #[serde(rename = "none")]
    None { id: Uuid },
}

#[post("/play")]
pub async fn play(
    req_body: web::Json<SongDto>,
    data: web::Data<Arc<Mutex<AppState>>>,
) -> impl Responder {
    let mut state = get_app_state!(data);

    let res = match req_body.0 {
        SongDto::FromNewSource { index, provider } => {
            if let Err(error) = state.set_song_source(provider.clone()) {
                match error {
                    SetSongSourceError::DbError(error) => {
                        eprintln!("{error}");
                        HttpResponse::InternalServerError().body(error)
                    }
                    SetSongSourceError::ReqError(error) => {
                        eprintln!("{error}");
                        HttpResponse::BadRequest().body(error)
                    }
                }
            } else {
                let res = match state.set_playing_song(index.try_into().unwrap(), false) {
                    Ok(_) => HttpResponse::Ok().finish(),

                    Err(error) => {
                        eprintln!("{error}");
                        HttpResponse::BadRequest().body(error)
                    }
                };
                res
            }
        }

        SongDto::FromQueue { index } => {
            let res = match state.set_playing_song(index.try_into().unwrap(), false) {
                Ok(_) => HttpResponse::Ok().finish(),

                Err(error) => {
                    eprintln!("{error}");
                    HttpResponse::BadRequest().body(error)
                }
            };
            res
        }

        SongDto::None { id } => {
            // check if song exists
            match state.db.prepare("SELECT id FROM song WHERE id = ?") {
                Ok(mut stmt) => {
                    if let Err(error) = stmt.query_row([id.to_string()], |row| {
                        let id: String = row.get(0)?;
                        Ok(id)
                    }) {
                        eprintln!("here : {error}");
                        return HttpResponse::BadRequest().body(format!("{error}"));
                    }
                }

                Err(error) => {
                    eprintln!("{error}");
                    return HttpResponse::InternalServerError().body(format!("{error}"));
                }
            }

            // push song next currently playing song
            let index = state.get_playing_song().index + 1;

            // Create temporary table
            if let Err(error) = state.db.execute(
                "CREATE TEMPORARY TABLE tmp_queue AS SELECT * FROM queue WHERE id >= ?",
                [index],
            ) {
                HttpResponse::InternalServerError().body(format!("{error}"))
            } else {
                let insert_song = |conn: &Connection| -> rusqlite::Result<()> {
                    // Increment index after req song index
                    conn.execute("UPDATE tmp_queue SET id = id + 1", [])?;

                    // Increment index after req song index
                    conn.execute("UPDATE tmp_queue SET id = id + 1", [])?;

                    // Update original table
                    conn.execute("DELETE FROM queue WHERE id >= ?", [index])?;
                    conn.execute(
                        "INSERT INTO queue VALUES(?, ?)",
                        params![index, id.to_string()],
                    )?;
                    conn.execute("INSERT INTO queue SELECT * FROM tmp_queue", [])?;

                    // Delete temporary table
                    conn.execute("DROP TABLE tmp_queue", [])?;

                    Ok(())
                };

                let res = match insert_song(&state.db) {
                    Ok(_) => {
                        let res = match state.set_playing_song(index, false) {
                            Ok(_) => HttpResponse::Ok().finish(),
                            Err(error) => {
                                eprintln!("{error}");
                                HttpResponse::InternalServerError().body(error)
                            }
                        };

                        res
                    }

                    Err(error) => {
                        eprintln!("{error}");
                        HttpResponse::InternalServerError().body(format!("{error}"))
                    }
                };
                res
            }
        }
    };
    res
}

#[cfg(test)]
mod tests {
    use crate::server::{
        controllers::{queue::get_queue, status::get_app_status},
        database::func::open_db_connection,
    };

    use super::*;
    use actix_web::{test, App};
    use rusqlite::{params, Connection, Result};
    use serde_json::json;

    const SONGS: &[&'static str] = &[
        "94835919-5647-4f0e-93ad-eea8cf421744",
        "daf58747-ed92-450a-8186-c81493034cf0",
        "857f71d0-8545-41ba-9198-fd89a49b1e89",
        "2cc8ad97-2d69-4fba-bf12-32fe1d393e5e",
        "cf910f6c-03b1-4cd8-8e01-20a0fa9d604b",
    ];

    fn create_mock_datas(conn: &Connection) -> Result<usize> {
        // Songs
        for song in SONGS {
            conn.execute(
                r#"INSERT INTO song(id, path, liked, track_number, album) VALUES(?, ?, ?, ?, ?)"#,
                params![song, "path", false, 0, "album"],
            )?;
        }

        // Playlist
        let playlist = vec![&SONGS[2], &SONGS[0], &SONGS[3]];
        for (i, song) in playlist.iter().enumerate() {
            conn.execute(
                "INSERT INTO playlist VALUES(?, ?, ?, ?)",
                params![i, "playlist", song, i],
            )?;
        }

        // Queue
        let queue = vec![&SONGS[1], &SONGS[2]];
        for (i, song) in queue.iter().enumerate() {
            conn.execute("INSERT INTO queue VALUES(?, ?)", params![i, song])?;
        }

        Ok(0)
    }

    fn mock_in_memory_db() -> Connection {
        let conn = open_db_connection(None).expect("Failed to open in memory connection");
        create_mock_datas(&conn).expect("Failed to create mock datas");
        conn
    }

    #[actix_web::test]
    async fn play_unsourced_song() {
        let mut data = AppState::new();
        data.db = mock_in_memory_db();

        let app = test::init_service(
            App::new()
                .app_data(web::Data::new(Arc::new(Mutex::new(data))))
                .service(
                    web::scope("/playback")
                        .service(play)
                        .service(get_app_status),
                )
                .service(web::scope("queue").service(get_queue)),
        )
        .await;

        let req = test::TestRequest::post()
            .set_json(json!({
              "source": "none",
              "id": &SONGS[0]
            }))
            .uri("/playback/play")
            .to_request();

        // Ensure request success
        let res = test::call_service(&app, req).await;
        assert!(res.status().is_success());

        // Check current app state
        let req = test::TestRequest::get().uri("/playback").to_request();
        let data: PlaybackData = test::call_and_read_body_json(&app, req).await;
        assert!(data.source.is_none());
        assert_eq!(data.playing_song.index, 0);
        assert!(!data.playing_song.paused);

        // Check queue
        let req = test::TestRequest::get().uri("/queue").to_request();
        let queue: Vec<String> = test::call_and_read_body_json(&app, req).await;
        assert_eq!(queue, vec![SONGS[0], SONGS[1], SONGS[2]]);
    }

    #[actix_web::test]
    async fn play_song_from_queue() {
        let mut data = AppState::new();
        data.db = mock_in_memory_db();

        let app = test::init_service(
            App::new()
                .app_data(web::Data::new(Arc::new(Mutex::new(data))))
                .service(
                    web::scope("/playback")
                        .service(play)
                        .service(get_app_status),
                )
                .service(web::scope("queue").service(get_queue)),
        )
        .await;

        let req = test::TestRequest::post()
            .set_json(json!({
              "source": "queue",
              "index": 1
            }))
            .uri("/playback/play")
            .to_request();

        // Ensure request success
        let res = test::call_service(&app, req).await;
        assert!(res.status().is_success());

        // Check current app state
        let req = test::TestRequest::get().uri("/playback").to_request();
        let data: PlaybackData = test::call_and_read_body_json(&app, req).await;
        assert_eq!(data.playing_song.index, 1);
        assert!(!data.playing_song.paused);
        assert!(data.source.is_none());

        // Check queue
        let req = test::TestRequest::get().uri("/queue").to_request();
        let queue: Vec<String> = test::call_and_read_body_json(&app, req).await;
        assert_eq!(queue, vec![SONGS[1], SONGS[2]]);
    }

    #[actix_web::test]
    async fn play_song_from_playlist() {
        let mut data = AppState::new();
        data.db = mock_in_memory_db();

        let app = test::init_service(
            App::new()
                .app_data(web::Data::new(Arc::new(Mutex::new(data))))
                .service(
                    web::scope("/playback")
                        .service(play)
                        .service(get_app_status),
                )
                .service(web::scope("queue").service(get_queue)),
        )
        .await;

        let req = test::TestRequest::post()
            .set_json(json!({
              "source": "new",
              "index": 1,
              "provider": {
                "type": "playlist",
                "name": "playlist"
              }
            }))
            .uri("/playback/play")
            .to_request();

        // Ensure request success
        let res = test::call_service(&app, req).await;
        assert!(res.status().is_success());

        // Check current app state
        let req = test::TestRequest::get().uri("/playback").to_request();
        let data: PlaybackData = test::call_and_read_body_json(&app, req).await;
        assert_eq!(data.playing_song.index, 1);
        assert!(!data.playing_song.paused);
        assert_eq!(
            data.source,
            Some(SongSource::Playlist(String::from("playlist")))
        );

        // Check queue
        let req = test::TestRequest::get().uri("/queue").to_request();
        let queue: Vec<String> = test::call_and_read_body_json(&app, req).await;
        assert_eq!(queue, vec![SONGS[2], SONGS[0], SONGS[3]]);
    }

    #[actix_web::test]
    async fn play_song_from_album() {
        let mut data = AppState::new();
        data.db = mock_in_memory_db();

        let app = test::init_service(
            App::new()
                .app_data(web::Data::new(Arc::new(Mutex::new(data))))
                .service(
                    web::scope("/playback")
                        .service(play)
                        .service(get_app_status),
                )
                .service(web::scope("queue").service(get_queue)),
        )
        .await;

        let req = test::TestRequest::post()
            .set_json(json!({
              "source": "new",
              "index": 1,
              "provider": {
                "type": "album",
                "name": "album"
              }
            }))
            .uri("/playback/play")
            .to_request();

        // Ensure request success
        let res = test::call_service(&app, req).await;
        assert!(res.status().is_success());

        // Check current app state
        let req = test::TestRequest::get().uri("/playback").to_request();
        let data: PlaybackData = test::call_and_read_body_json(&app, req).await;
        assert_eq!(data.playing_song.index, 1);
        assert!(!data.playing_song.paused);
        assert_eq!(data.source, Some(SongSource::Album(String::from("album"))));

        // Check queue
        let req = test::TestRequest::get().uri("/queue").to_request();
        let queue: Vec<String> = test::call_and_read_body_json(&app, req).await;
        assert_eq!(queue, Vec::from(SONGS));
    }
}
