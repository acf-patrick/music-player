use crate::{get_app_state, types::AppState};
use actix_web::{delete, get, post, web, HttpResponse, Responder};
use serde::Deserialize;
use std::sync::{Arc, Mutex};

#[get("")]
pub async fn get_queue(data: web::Data<Arc<Mutex<AppState>>>) -> impl Responder {
    let data = get_app_state!(data);
    let conn = &data.db;

    let res = match conn.prepare("SELECT song FROM queue") {
        Ok(mut stmt) => {
            if let Ok(iter) = stmt.query_map([], |row| {
                let id: String = row.get(0)?;
                Ok(id)
            }) {
                let mut song_ids: Vec<String> = vec![];
                for row in iter {
                    if let Ok(id) = row {
                        song_ids.push(id);
                    }
                }
                HttpResponse::Ok().json(song_ids)
            } else {
                HttpResponse::NotFound().body("No queue found")
            }
        }
        Err(error) => {
            eprintln!("{error}");
            HttpResponse::InternalServerError().body(format!("{}", error))
        }
    };
    res
}

#[derive(Deserialize)]
pub struct QueueQuery {
    id: String,
}

/// Append song to current queue
#[post("")]
pub async fn add_to_queue(
    data: web::Data<Arc<Mutex<AppState>>>,
    body: web::Json<QueueQuery>,
) -> impl Responder {
    let data = get_app_state!(data);
    let conn = &data.db;

    let res = match conn.execute("INSERT INTO queue(song) VALUES(?)", &[&body.id]) {
        Ok(_) => HttpResponse::Ok().body("Added to queue"),
        Err(error) => {
            eprintln!("{error}");
            HttpResponse::InternalServerError().body(format!("Failed to add to queue : {}", error))
        }
    };
    res
}

/// Remove song from queue
#[delete("/{song_id}")]
pub async fn remove_from_queue(
    data: web::Data<Arc<Mutex<AppState>>>,
    song_id: web::Path<String>,
) -> impl Responder {
    let state = get_app_state!(data);
    let conn = &state.db;

    let res = match conn.execute("DELETE FROM queue WHERE song =?", &[&song_id.to_owned()]) {
        Ok(_) => HttpResponse::Ok().body("Song removed from queue"),
        Err(error) => {
            eprintln!("{error}");
            HttpResponse::InternalServerError()
                .body(format!("Failed to remove from queue : {}", error))
        }
    };
    res
}
