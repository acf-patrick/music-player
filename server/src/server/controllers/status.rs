use crate::{get_app_state, types::AppState};
use actix_web::{get, web, Responder};
use serde_json::json;
use std::sync::{Arc, Mutex};

#[get("")]
pub async fn get_app_status(data: web::Data<Arc<Mutex<AppState>>>) -> impl Responder {
    let state = get_app_state!(data);
    web::Json(json! ({
      "playing_song": state.get_playing_song(),
      "song_source": state.get_song_source(),
      "repeat_mode": state.get_repeat_mode()
    }))
}
