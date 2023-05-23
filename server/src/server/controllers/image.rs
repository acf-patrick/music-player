use crate::{get_db_conn, server::database::model::Image, types::AppState};
use actix_web::{get, web, HttpResponse, Responder};
use serde_rusqlite::from_row;

#[get("/{id}")]
pub async fn get_image(image_id: web::Path<String>, data: web::Data<AppState>) -> impl Responder {
    let mut cache = data
        .image_cache
        .lock()
        .expect("Cannot get lock on image cache");

    if image_id.is_empty() {
        return HttpResponse::BadRequest().body("Image ID cannot be empty");
    }

    if let Some(id) = &cache.id {
        if *id == image_id.to_string() {
            return HttpResponse::Ok().json(cache.data.as_ref().unwrap());
        }
    }

    let conn = get_db_conn!(data);
    let res = match conn.prepare("SELECT * FROM image WHERE id = ?") {
        Ok(mut stmt) => {
            let mut image: Option<Image> = None;
            if let Ok(mut iter) = stmt.query(&[&image_id.to_string()]) {
                if let Ok(Some(row)) = iter.next() {
                    if let Ok(row) = from_row::<Image>(row) {
                        image = Some(row);
                    }
                }
            }

            if let Some(image) = image {
                cache.id = Some(image_id.to_string());
                cache.data = Some(image);
                HttpResponse::Ok().json(&cache.data)
            } else {
                HttpResponse::NotFound().body("Image not found")
            }
        }
        Err(error) => {
            eprintln!("{error}");
            HttpResponse::InternalServerError().body(format!("{}", error))
        }
    };
    res
}
