use core::panic;
use std::time::{Duration, Instant};

use actix::{
    fut, Actor, ActorContext, ActorFutureExt, Addr, AsyncContext, ContextFutureSpawner, Handler,
    Running, StreamHandler, WrapFuture,
};
use actix_web_actors::ws;
use uuid::Uuid;

use super::{
    lobby::Lobby,
    messages::{ClientActorMessage, Connect, Disconnect, WebSocketMessage},
};

const CHECK_HEARTBEAT: bool = false;
const HEARTBEAT_INTERVAL: Duration = Duration::from_secs(5);
const CLIENT_TIMEOUT: Duration = Duration::from_secs(10);

pub struct WebSocketConn {
    lobby_addr: Addr<Lobby>,
    hb: Instant,
    id: Uuid,
}

impl WebSocketConn {
    pub fn new(lobby: Addr<Lobby>) -> WebSocketConn {
        WebSocketConn {
            lobby_addr: lobby,
            hb: Instant::now(),
            id: Uuid::new_v4(),
        }
    }

    fn hb(&self, ctx: &mut ws::WebsocketContext<Self>) {
        if CHECK_HEARTBEAT {
            ctx.run_interval(HEARTBEAT_INTERVAL, |actor, ctx| {
                if Instant::now().duration_since(actor.hb) > CLIENT_TIMEOUT {
                    println!("Disconnecting failed heartbeat");
                    actor.lobby_addr.do_send(Disconnect { id: actor.id });
                    ctx.stop();
                    return;
                }

                ctx.ping(b"PING");
            });
        }
    }
}

impl Actor for WebSocketConn {
    type Context = ws::WebsocketContext<Self>;

    fn started(&mut self, ctx: &mut Self::Context) {
        self.hb(ctx);

        let addr = ctx.address();
        self.lobby_addr
            .send(Connect {
                addr: addr.recipient(),
                self_id: self.id,
            })
            .into_actor(self)
            .then(|res, _, ctx| {
                match res {
                    Ok(_) => {}
                    _ => ctx.stop(),
                }
                fut::ready(())
            })
            .wait(ctx);
    }

    fn stopping(&mut self, _: &mut Self::Context) -> actix::Running {
        self.lobby_addr.do_send(Disconnect { id: self.id });
        Running::Stop
    }
}

impl StreamHandler<Result<ws::Message, ws::ProtocolError>> for WebSocketConn {
    fn handle(&mut self, item: Result<ws::Message, ws::ProtocolError>, ctx: &mut Self::Context) {
        match item {
            Ok(ws::Message::Ping(msg)) => {
                self.hb = Instant::now();
                ctx.pong(&msg);
            }
            Ok(ws::Message::Pong(_)) => {
                self.hb = Instant::now();
            }
            Ok(ws::Message::Binary(bin)) => ctx.binary(bin),
            Ok(ws::Message::Close(reason)) => {
                ctx.close(reason);
                ctx.stop();
            }
            Ok(ws::Message::Continuation(_)) => {
                ctx.stop();
            }
            Ok(ws::Message::Nop) => (),
            Ok(ws::Message::Text(s)) => self.lobby_addr.do_send(ClientActorMessage {
                id: self.id,
                msg: s.to_string(),
            }),
            Err(e) => panic!("{e}"),
        }
    }
}

impl Handler<WebSocketMessage> for WebSocketConn {
    type Result = ();

    fn handle(&mut self, msg: WebSocketMessage, ctx: &mut Self::Context) -> Self::Result {
        ctx.text(msg.0)
    }
}
