use crate::{get_app_state, types::AppState};
use actix_web::{get, web, HttpResponse, Responder};
use std::sync::{Arc, Mutex};

#[get("")]
pub async fn get_artists(data: web::Data<Arc<Mutex<AppState>>>) -> impl Responder {
    let state = get_app_state!(data);
    let mut artists: Vec<String> = vec![];
    let conn = &state.db;

    match conn.prepare("SELECT DISTINCT artist FROM song") {
        Ok(mut stmt) => {
            if let Ok(iter) = stmt.query_map([], |row| {
                let artist: String = row.get(0)?;
                Ok(artist)
            }) {
                for artist in iter {
                    if let Ok(artist) = artist {
                        artists.push(artist);
                    }
                }
            }
        }
        Err(error) => {
            return HttpResponse::BadRequest().body(format!("{error}"));
        }
    }

    HttpResponse::Ok().json(artists)
}
