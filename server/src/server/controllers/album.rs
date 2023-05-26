use actix_web::{get, web, HttpResponse, Responder};
use rusqlite::{Connection, Error};
use serde::{Deserialize, Serialize};
use serde_rusqlite::from_rows;

use crate::{get_db_conn, server::database::model::Album, types::AppState};

#[derive(Deserialize)]
struct AlbumQuery {
    name: Option<String>,
    artist: Option<String>,
}

#[derive(Serialize, Deserialize)]
struct AlbumRow {
    album: String,
    artist: String,
    duration: u32,
    year: u16,
    cover: Option<String>,
}

/// Get album by name or artist
#[get("")]
pub async fn get_album(query: web::Query<AlbumQuery>, data: web::Data<AppState>) -> impl Responder {
    let mut condition = String::new();

    if let Some(name) = &query.name {
        condition.push_str(&format!("album LIKE '%{}%'", name));
        if let Some(_) = &query.artist {
            condition.push_str(" AND ");
        }
    }

    if let Some(artist) = &query.artist {
        condition.push_str(&format!("artist LIKE '%{}%'", artist));
    }

    if condition.is_empty() {
        return HttpResponse::BadRequest().body("Provide 'name' or 'artist' information as query.");
    }

    send_response(data, condition)
}

#[get("/a")]
pub async fn get_all_albums(data: web::Data<AppState>) -> impl Responder {
    send_response(data, String::new())
}

fn get_album_list(conn: &Connection, condition: String) -> Result<Vec<Album>, Error> {
    let mut albums: Vec<Album> = vec![];

    let query: String = if condition.is_empty() {
        String::from("SELECT album, artist, duration, year, cover FROM song")
    } else {
        format!("SELECT album, artist, duration, year, cover FROM song WHERE({condition})")
    };

    match conn.prepare(&query) {
        Ok(mut stmt) => {
            if let Ok(iter) = stmt.query([]) {
                let iter = from_rows::<AlbumRow>(iter);
                for row in iter {
                    if let Ok(row) = row {
                        if let Some(i) = albums.iter().position(|album| album.title == row.album) {
                            let stored = &mut albums[i];
                            
                            if let None = stored.artists.iter().find(|a| a == &&row.artist) {
                                stored.artists.push(row.artist);
                            }

                            // if let None = stored.artists.iter().find(|a| a == &&row.g)

                            stored.duration += row.duration;
                            stored.track_count += 1;

                            if row.year > stored.year {
                                stored.year = row.year;
                            }

                            if let Some(cover) = row.cover {
                                if stored.cover == None {
                                    stored.cover = Some(cover);
                                }
                            }
                        } else {
                            let mut album = Album {
                                title: row.album,
                                artists: vec![],
                                genres: vec![],
                                year: row.year,
                                duration: row.duration,
                                cover: row.cover,
                                track_count: 1,
                            };
                            album.artists.push(row.artist);
                            albums.push(album);
                        }
                    }
                }
            }
            Ok(albums)
        }
        Err(error) => {
            eprintln!("{error}");
            Err(error)
        }
    }
}

fn send_response(data: web::Data<AppState>, condition: String) -> HttpResponse {
    let conn = get_db_conn!(data);
    match get_album_list(&conn, condition) {
        Ok(albums) => {
            if albums.is_empty() {
                HttpResponse::NotFound().body("No album found.")
            } else {
                HttpResponse::Ok().json(albums)
            }
        }
        Err(error) => {
            eprintln!("{error}");
            HttpResponse::InternalServerError().body(format!("{error}"))
        }
    }
}
