mod database;
mod server;

use actix_web::{get, web, App, HttpServer, Responder};
use rusqlite::Connection;
use serde::Serialize;

use server::controllers::artist::get_artists;
use server::controllers::genre::get_genres;

#[derive(Serialize, Clone)]
struct PlayingSong {
    index: i16,
    paused: bool,
}

pub struct AppState {
    playing_song: PlayingSong,
    db: Connection,
}

#[get("/")]
async fn index() -> String {
    String::from("ayeee")
}

#[actix_web::main]
async fn main() -> std::io::Result<()> {
    let port = 8080;
    println!("🚀 Server running on port {port}");

    HttpServer::new(|| {
        let db = Connection::open("mozika.db").unwrap();
        App::new()
            .app_data(web::Data::new(AppState {
                playing_song: PlayingSong {
                    index: -1,
                    paused: true,
                },
                db,
            }))
            .service(index)
            .service(web::scope("/genres").service(get_genres))
            .service(web::scope("/artists").service(get_artists))
    })
    .bind(("127.0.0.1", port))?
    .run()
    .await
}
