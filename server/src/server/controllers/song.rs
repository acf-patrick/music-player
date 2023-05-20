use crate::types::Song;
use crate::{get_db_conn, AppState};
use actix_web::{get, web, HttpResponse, Responder};
use rusqlite::Connection;
use serde::{Deserialize, Serialize};

#[derive(Deserialize)]
struct SongQuery {
    title: Option<String>,
    artist: Option<String>,
    page: Option<usize>,
}

#[derive(Serialize)]
struct Paging {
    index: usize,
    total: usize,
}

#[derive(Serialize)]
struct Response {
    songs: Vec<Song>,
    total_items: usize,
    paging: Paging,
}

fn send_page(songs: &Vec<Song>, page_index: usize) -> HttpResponse {
    let total_page = (songs.len() as f64) / (crate::consts::PAGE_LENGTH as f64);
    let total_page = total_page.ceil() as usize;

    if page_index < total_page {
        HttpResponse::Ok().json(Response {
            songs: songs
                [page_index..std::cmp::min(songs.len(), page_index + crate::consts::PAGE_LENGTH)]
                .to_vec(),
            total_items: songs.len(),
            paging: Paging {
                index: page_index,
                total: total_page,
            },
        })
    } else {
        HttpResponse::BadRequest().body("Page index out of range")
    }
}

/// Get song list
///
/// Available query parameters :
/// - title
/// - artist
/// - page : Page index to retrieve
#[get("")]
pub async fn get_song(data: web::Data<AppState>, query: web::Query<SongQuery>) -> impl Responder {
    let conn = get_db_conn!(data);
    let mut cache = data.song_cache.lock().unwrap();

    let mut page_index = 0;
    if let Some(page) = query.page {
        page_index = page;
    }

    let mut conditions = String::new();
    if let Some(title) = &query.title {
        conditions.push_str(&format!("title LIKE '%{}%'", title));
    }
    if let Some(artist) = &query.artist {
        if !conditions.is_empty() {
            conditions.push_str(" AND ");
        }
        conditions.push_str(&format!("artist LIKE '%{}%'", artist));
    }

    if let Some(last_query) = &cache.query {
        if *last_query == conditions && cache.result.len() > 0 {
            return send_page(&cache.result, page_index);
        }
    }

    let query = if conditions.is_empty() {
        String::from("SELECT * FROM song")
    } else {
        format!("SELECT * FROM song WHERE {}", conditions)
    };

    let res = match conn.prepare(&query) {
        Ok(mut stmt) => {
            if let Ok(iter) = stmt.query_map([], |row| {
                Ok(Song {
                    id: row.get(0)?,
                    path: row.get(1)?,
                    liked: row.get(2)?,
                    year: Some(row.get(3)?),
                    title: Some(row.get(4)?),
                    artist: Some(row.get(5)?),
                    album: Some(row.get(6)?),
                    track_number: Some(row.get(7)?),
                    genre: Some(row.get(8)?),
                    cover: Some(row.get(9)?),
                    duration: Some(row.get(10)?),
                })
            }) {
                let mut songs: Vec<Song> = vec![];
                for row in iter {
                    if let Ok(song) = row {
                        songs.push(song);
                    }
                }

                if songs.is_empty() {
                    HttpResponse::NotFound().finish()
                } else {
                    cache.result = songs;
                    send_page(&cache.result, page_index)
                }
            } else {
                HttpResponse::NotFound().finish()
            }
        }
        Err(error) => {
            eprintln!("{error}");
            HttpResponse::InternalServerError().body(format!("{error}"))
        }
    };

    res
}

/// Retrieve one song by id
#[get("/{song_id}")]
pub async fn get_one_song(song_id: web::Path<String>, data: web::Data<AppState>) -> impl Responder {
    let conn = get_db_conn!(data);
    let res = match conn.prepare("SELECT * FROM song WHERE id = ?") {
        Ok(mut stmt) => {
            if let Ok(mut iter) = stmt.query_map(&[&song_id.to_string()], |row| {
                Ok(Song {
                    id: row.get(0)?,
                    path: row.get(1)?,
                    liked: row.get(2)?,
                    year: Some(row.get(3)?),
                    title: Some(row.get(4)?),
                    artist: Some(row.get(5)?),
                    album: Some(row.get(6)?),
                    track_number: Some(row.get(7)?),
                    genre: Some(row.get(8)?),
                    cover: Some(row.get(9)?),
                    duration: Some(row.get(10)?),
                })
            }) {
                if let Some(row) = iter.next() {
                    HttpResponse::Ok().json(row.unwrap())
                } else {
                    HttpResponse::NotFound().finish()
                }
            } else {
                HttpResponse::NotFound().finish()
            }
        }
        Err(error) => {
            eprintln!("{error}");
            HttpResponse::InternalServerError().body(format!("{error}"))
        }
    };
    res
}
