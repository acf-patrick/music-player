use func::{create_database, scan_folder};
use std::env;
use std::fs;
mod func;
mod query;
mod types;

fn main() {
    let DATABASE = "node/database.db";
    if let Err(error) = fs::remove_file(DATABASE) {
      eprintln!("{error}");
    }
    if let Ok(conn) = create_database(DATABASE) {
        scan_folder(
            if env::consts::OS == "linux" {
                "/home/acf-patrick/projects/music-player/client/public"
            } else {
                "D:/FIT_Apprenti_Vague_006/music-player/client/public/test"
            },
            &conn,
        );
    } else {
        eprintln!("Failed to connect to application database.");
    }
}
