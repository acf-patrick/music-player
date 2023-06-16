use actix_files::NamedFile;
use actix_web::{get, web, HttpRequest, HttpResponse, Responder};
use std::sync::{Arc, Mutex};

use crate::{get_app_state, types::AppState};

#[get("/{song_id}")]
pub async fn get_audio(
    req: HttpRequest,
    song_id: web::Path<String>,
    data: web::Data<Arc<Mutex<AppState>>>,
) -> impl Responder {
    let state = get_app_state!(data);
    let conn = &state.db;

    let res = if let Ok(mut stmt) = conn.prepare("SELECT path FROM song WHERE id = ?") {
        let row = stmt.query_row(&[&song_id.to_owned()], |row| {
            let path: String = row.get(0)?;
            Ok(path)
        });

        if let Ok(path) = row {
            match NamedFile::open_async(path).await {
              Ok(file) => file.into_response(&req),
              Err(error) => {
                eprintln!("{error}");
                HttpResponse::NotFound().body("File not found.")
              }
            }
        } else {
            HttpResponse::NotFound().finish()
        }
    } else {
        HttpResponse::InternalServerError().finish()
    };

    res
}
