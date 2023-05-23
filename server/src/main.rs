use server::start_server;

mod consts;
mod server;
mod types;

#[actix_web::main]
async fn main() -> std::io::Result<()> {
  start_server().await
}