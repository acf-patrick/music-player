use func::{create_database, scan_folder};
mod func;
mod query;
mod types;

fn main() {
    if let Ok(conn) = create_database("node/database.db") {
        scan_folder(
            "D:/FIT_Apprenti_Vague_006/music-player/client/public",
            &conn,
        );
    } else {
        eprintln!("Failed to connect to application database.");
    }
}
