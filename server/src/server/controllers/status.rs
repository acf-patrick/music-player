use crate::{
    get_app_state,
    types::{AppState, PlaybackData},
};
use actix_web::{get, web, Responder};
use serde_json::json;
use std::sync::{Arc, Mutex};

#[get("")]
pub async fn get_app_status(data: web::Data<Arc<Mutex<AppState>>>) -> impl Responder {
    let state = get_app_state!(data);
    web::Json(PlaybackData {
        playing_song: state.get_playing_song(),
        repeat_mode: state.get_repeat_mode(),
        source: state.get_song_source(),
    })
}
