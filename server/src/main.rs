mod database;
mod server;
mod types;

use std::sync::Mutex;

use actix_web::{get, post, web, App, HttpResponse, HttpServer, Responder};
use rusqlite::Connection;
use serde::Serialize;

use crate::server::controllers::{
    album::{get_album_by_name_or_artist, get_all_albums},
    artist::get_artists,
    genre::get_genres, image::get_image,
};
use types::{cache, PlayingSong};

pub struct AppState {
    playing_song: PlayingSong,
    image_cache: Mutex<cache::Image>,
    db: Mutex<Connection>,
}

#[get("/")]
async fn index() -> String {
    String::from("ayeee")
}

#[actix_web::main]
async fn main() -> std::io::Result<()> {
    let port = 8080;
    println!("🚀 Server running on port {port}");

    let app_state = web::Data::new(AppState {
        playing_song: PlayingSong {
            index: -1,
            paused: true,
        },
        image_cache: Mutex::new(cache::Image {
            id: None,
            data: None,
        }),
        db: Mutex::new(Connection::open("mozika.db").unwrap()),
    });

    HttpServer::new(move || {
        App::new()
            .app_data(app_state.clone())
            .service(index)
            .service(web::scope("/genres").service(get_genres))
            .service(web::scope("/artists").service(get_artists))
            .service(
                web::scope("/album")
                    .service(get_album_by_name_or_artist)
                    .service(get_all_albums),
            )
            .service(web::scope("/image").service(get_image))
    })
    .bind(("127.0.0.1", port))?
    .run()
    .await
}
