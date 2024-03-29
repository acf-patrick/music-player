pub mod controllers;
pub mod database;
pub mod web_socket;

use std::sync::{Arc, Mutex};

use actix_cors::Cors;
use actix_web::{get, web, App, HttpServer};

use crate::{consts, types::AppState};
use controllers::{
    album::{get_album, get_album_songs, get_all_albums},
    artist::get_artists,
    audio::get_audio,
    genre::get_genres,
    image::get_image,
    lyrics::get_lyrics,
    playback::{get_playback, pause, play, resume, set_to_next_song, set_to_previous_song},
    queue::{add_to_queue, get_queue, remove_from_queue},
    song::{get_one_song, get_song, get_song_count},
    status::get_app_status,
    ws::start_ws_connection,
};

#[get("/")]
async fn index() -> String {
    String::from("ayeee")
}

pub async fn start_server() -> std::io::Result<()> {
    println!("🚀 Server running on port {}", consts::PORT);

    let app_state = web::Data::new(Arc::new(Mutex::new(AppState::new())));

    HttpServer::new(move || {
        let cors = Cors::default()
            .allow_any_origin()
            .allow_any_method()
            .allow_any_header();

        App::new()
            .wrap(cors)
            .app_data(app_state.clone())
            .service(index)
            .service(get_song_count)
            .service(web::scope("/genres").service(get_genres))
            .service(web::scope("/artists").service(get_artists))
            .service(
                web::scope("/album")
                    .service(get_album)
                    .service(get_all_albums)
                    .service(get_album_songs),
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
            .service(
                web::scope("/playback")
                    .service(get_playback)
                    .service(set_to_next_song)
                    .service(set_to_previous_song)
                    .service(pause)
                    .service(resume)
                    .service(play),
            )
            .service(web::scope("/status").service(get_app_status))
            .service(web::scope("/audio").service(get_audio))
            .service(start_ws_connection)
    })
    .bind(("0.0.0.0", consts::PORT))?
    .run()
    .await
}
