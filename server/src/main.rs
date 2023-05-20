mod consts;
mod database;
mod server;
mod types;

use std::sync::Mutex;

use actix_web::{get, web, App, HttpServer};
use rusqlite::Connection;

use server::controllers::{
    album::{get_album, get_all_albums},
    artist::get_artists,
    genre::get_genres,
    image::get_image,
    queue::{add_to_queue, get_queue, remove_from_queue},
    song::{get_one_song, get_song},
};
use types::{cache, PlayingSong};

pub struct AppState {
    playing_song: PlayingSong,
    image_cache: Mutex<cache::Image>,
    song_cache: Mutex<cache::Song>,
    db: Mutex<Connection>,
}

#[get("/")]
async fn index() -> String {
    String::from("ayeee")
}

#[actix_web::main]
async fn main() -> std::io::Result<()> {
    println!("🚀 Server running on port {}", consts::PORT);

    let app_state = web::Data::new(AppState {
        playing_song: PlayingSong {
            index: -1,
            paused: true,
        },
        image_cache: Mutex::new(cache::Image {
            id: None,
            data: None,
        }),
        song_cache: Mutex::new(cache::Song {
            query: None,
            result: vec![],
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
                    .service(get_album)
                    .service(get_all_albums),
            )
            .service(web::scope("/image").service(get_image))
            .service(
                web::scope("/queue")
                    .service(get_queue)
                    .service(add_to_queue)
                    .service(remove_from_queue),
            )
            .service(web::scope("/song").service(get_song).service(get_one_song))
    })
    .bind(("127.0.0.1", consts::PORT))?
    .run()
    .await
}
