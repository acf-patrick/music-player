pub mod controllers;
pub mod database;

use std::sync::Mutex;

use actix_web::{get, web, App, HttpServer};
use rusqlite::Connection;

use crate::consts;
use crate::{
    server::controllers::lyrics::get_lyrics,
    types::{cache, AppState, PlayingSong},
};
use controllers::{
    album::{get_album, get_all_albums},
    artist::get_artists,
    genre::get_genres,
    image::get_image,
    queue::{add_to_queue, get_queue, remove_from_queue},
    song::{get_one_song, get_song},
};

#[get("/")]
async fn index() -> String {
    String::from("ayeee")
}

pub async fn start_server() -> std::io::Result<()> {
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
        lyrics_cache: Mutex::new(cache::Lyrics {
            artist: None,
            song: None,
            lyrics: String::new(),
        }),
        db: Mutex::new(Connection::open(consts::DATABASE).unwrap()),
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
            .service(web::scope("/lyrics").service(get_lyrics))
    })
    .bind(("127.0.0.1", consts::PORT))?
    .run()
    .await
}
