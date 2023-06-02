use std::sync::{Arc, Mutex};
use crate::{types::{AppState, SongSource, PlayingSong}, get_app_state};
use actix_web::{get, web, Responder};
use serde::Serialize;

#[derive(Serialize)]
struct Response {
  playing_song: PlayingSong,
  song_source: Option<SongSource>
}

#[get("")]
pub async fn get_app_status(data: web::Data<Arc<Mutex<AppState>>>) -> impl Responder {
  let state = get_app_state!(data);
  web::Json(Response {
    playing_song: state.get_playing_song(),
    song_source: state.get_song_source()
  })
}
