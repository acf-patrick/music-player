use actix_web::{get, web, HttpResponse, Responder};
use serde::{Deserialize, Serialize};

use crate::types::Album;
use crate::{get_db_conn, AppState};

#[derive(Deserialize)]
pub struct AlbumQuery {
    name: Option<String>,
    artist: Option<String>,
}

#[derive(Serialize)]
struct AlbumRow {
    album: String,
    artist: String,
    duration: u32,
    year: u8,
    cover: Option<String>,
}

#[get("")]
pub async fn get_album_by_name_or_artist(
    query: web::Query<AlbumQuery>,
    data: web::Data<AppState>,
) -> impl Responder {
    let mut condition = String::new();
    
    if let Some(name) = &query.name {
      condition += &format!("name LIKE %{}%", name);
    }

    if let Some(artist) = &query.artist {
      condition += &format!("artist LIKE %{}%", artist);
    }

    if condition.is_empty() {
        return HttpResponse::NotFound().body("Provide 'name' or 'artist' information as query.");
    }
    
    // Album list
    let mut albums: Vec<Album> = vec![];

    let conn = get_db_conn!(data);
    match conn.prepare(&format!(
        "SELECT album, artist, duration, year, cover FROM song WHERE({condition})"
    )) {
        Ok(mut stmt) => {
            if let Ok(iter) = stmt.query_map([], |row| {
                Ok(AlbumRow {
                    album: row.get(0)?,
                    artist: row.get(1)?,
                    duration: row.get(2)?,
                    year: row.get(3)?,
                    cover: row.get(4)?,
                })
            }) {
                for row in iter {
                    if let Ok(row) = row {
                        if let Some(i) = albums.iter().position(|album| album.title == row.album) {
                            let stored = &mut albums[i];
                            if let None = stored.artists.iter().find(|a| a == &&row.artist) {
                                stored.artists.push(row.artist);
                            }
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
        }
        Err(error) => {
            HttpResponse::BadRequest().body(format!("{error}"));
        }
    }

    if albums.is_empty() {
        return HttpResponse::NotFound().body("No album found.");
    }

    HttpResponse::Ok().json(albums)
}
