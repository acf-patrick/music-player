use actix::{Message, Recipient};
use serde::{Deserialize, Serialize};
use uuid::Uuid;

use crate::types::PlaybackData;

/// WebSocketConn responds to this to pipe it through to the actual client
#[derive(Message)]
#[rtype(result = "()")]
pub struct WebSocketMessage(pub String);

/// WebSocketConn sends this to the lobby to request login
#[derive(Message)]
#[rtype(result = "()")]
pub struct Connect {
    pub addr: Recipient<WebSocketMessage>,
    pub self_id: Uuid,
}

/// WebSocketConn sends this to a lobby to request logout
#[derive(Message)]
#[rtype(result = "()")]
pub struct Disconnect {
    pub id: Uuid,
}

/// Client sends this to the lobby for the lobby to echo out.
#[derive(Message)]
#[rtype(result = "()")]
pub struct ClientActorMessage {
    pub id: Uuid,
    pub msg: String,
}

#[derive(Serialize, Deserialize, Debug)]
pub struct EventMessage<T> {
    pub event: String,
    pub data: T,

    #[serde(default)]
    pub targets: Vec<String>,

    #[serde(default)]
    pub broadcast: bool, // true : omit self from targets
}

#[derive(Serialize, Clone)]
pub enum Action {
  
}

#[derive(Message, Serialize, Clone)]
#[rtype(result = "()")]
pub struct PlaybackAction {
  pub action: Action,
  pub data: PlaybackData
}
