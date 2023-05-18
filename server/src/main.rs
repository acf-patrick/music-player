mod database;

use actix_web::{get, web, App, HttpServer, Responder};
use rusqlite::Connection;
use serde::Serialize;

#[derive(Serialize, Clone)]
struct PlayingSong {
    index: i16,
    paused: bool,
}

struct AppState {
    playing_song: PlayingSong,
    db: Connection,
}

#[get("/")]
async fn index() -> String {
    String::from("Hello world")
}

#[get("/state")]
async fn get_state(data: web::Data<AppState>) -> impl Responder {
    web::Json(data.playing_song.clone())
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
            .service(get_state)
    })
    .bind(("127.0.0.1", port))?
    .run()
    .await
}
