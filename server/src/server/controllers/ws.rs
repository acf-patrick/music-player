use crate::get_app_state;
use crate::server::web_socket::{lobby::Lobby, ws::WebSocketConn};
use crate::types::AppState;

use actix::Actor;
use actix_web::{get, web, Error, HttpRequest, HttpResponse};
use actix_web_actors::ws::start as ws_start;
use std::sync::{Arc, Mutex};

#[get("ws")]
pub async fn start_ws_connection(
    req: HttpRequest,
    stream: web::Payload,
    data: web::Data<Arc<Mutex<AppState>>>,
) -> Result<HttpResponse, Error> {
    let mut state = get_app_state!(data);
    if state.ws_server.is_none() {
        state.ws_server = Some(Lobby::default().start());
    }

    let ws = WebSocketConn::new(state.ws_server.clone().unwrap());
    let res = ws_start(ws, &req, stream)?;

    Ok(res)
}
