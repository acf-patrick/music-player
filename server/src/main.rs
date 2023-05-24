use server::start_server;

mod types;
mod server;
mod consts;
mod lyric_scraper;

#[tokio::main]
async fn main() -> std::io::Result<()> {
    start_server().await
}
