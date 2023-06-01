use crate::{get_app_state, server::database::model::Image, types::AppState};
use actix_web::{get, web, HttpResponse, Responder};
use serde_rusqlite::from_row;
use std::sync::{Arc, Mutex};

#[get("/{id}")]
pub async fn get_image(
    image_id: web::Path<String>,
    data: web::Data<Arc<Mutex<AppState>>>,
) -> impl Responder {
    let mut state = get_app_state!(data);

    if image_id.is_empty() {
        return HttpResponse::BadRequest().body("Image ID cannot be empty");
    }

    {
        let cache = &mut state.image_cache;
        cache.id = None;

        if let Some(id) = &cache.id {
            if *id == image_id.to_string() {
                return HttpResponse::Ok().json(cache.data.as_ref().unwrap());
            }
        }
    }

    let mut image: Option<Image> = None;
    {
        let conn = &state.db;
        let res = match conn.prepare("SELECT * FROM image WHERE id = ?") {
            Ok(mut stmt) => {
                if let Ok(mut iter) = stmt.query(&[&image_id.to_string()]) {
                    if let Ok(Some(row)) = iter.next() {
                        if let Ok(row) = from_row::<Image>(row) {
                            image = Some(row);
                        }
                    }
                }

                if image.is_none() {
                    return HttpResponse::NotFound().body("Image not found");
                }
            }
            Err(error) => {
                eprintln!("{error}");
                return HttpResponse::InternalServerError().body(format!("{}", error));
            }
        };
    }

    let cache = &mut state.image_cache;
    cache.id = Some(image_id.to_string());
    cache.data = image;
    HttpResponse::Ok().json(&cache.data)
}
