use func::{create_database, scan_audio_files, store_audio_metadatas};
mod query;
mod func;

/* #![cfg_attr(
    all(not(debug_assertions), target_os = "windows"),
    windows_subsystem = "windows"
)] */

fn main() {
    /* tauri::Builder::default()
    .run(tauri::generate_context!())
    .expect("error while running tauri application"); */

    if let Ok(conn) = create_database("database.db") {
      let files = scan_audio_files("D:/FIT_Apprenti_Vague_006/music-player/client/public");
      for file in files {
        println!("{file}");
		if !store_audio_metadatas(&file, &conn) {
          eprintln!("Failed to extract {file} metadatas");
        }
      }
    } else {
      eprintln!("Failed to connect to application database.");
    }
}
