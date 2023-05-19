use crate::{get_db_conn, AppState};
use actix_web::{get, web, HttpResponse, Responder};

#[get("")]
pub async fn get_artists(data: web::Data<AppState>) -> impl Responder {
    let mut artists: Vec<String> = vec![];
    let conn = get_db_conn!(data);

    match conn.prepare("SELECT DISTINCT artist FROM song") {
        Ok(mut stmt) => {
            if let Ok(iter) = stmt.query_map([], |row| {
                let genre: String = row.get(0)?;
                Ok(genre)
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
