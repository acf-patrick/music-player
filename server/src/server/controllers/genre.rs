use crate::{get_db_conn, types::AppState};
use actix_web::{get, web, HttpResponse, Responder};

#[get("")]
pub async fn get_genres(data: web::Data<AppState>) -> impl Responder {
    let mut genres: Vec<String> = vec![];
    let conn = get_db_conn!(data);

    match conn.prepare("SELECT DISTINCT genre FROM song") {
        Ok(mut stmt) => {
            if let Ok(iter) = stmt.query_map([], |row| {
                let genre: String = row.get(0)?;
                Ok(genre)
            }) {
                for genre in iter {
                    if let Ok(genre) = genre {
                        genres.push(genre);
                    }
                }
            }
        }
        Err(error) => {
            return HttpResponse::BadRequest().body(format!("{error}"));
        }
    }

    HttpResponse::Ok().json(genres)
}
