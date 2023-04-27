use func::{create_database, scan_audio_files, store_audio_metadatas};
use indicatif::ProgressBar;
mod func;
mod query;
mod types;

/* #![cfg_attr(
    all(not(debug_assertions), target_os = "windows"),
    windows_subsystem = "windows"
)] */

fn main() {
    /* tauri::Builder::default()
    .run(tauri::generate_context!())
    .expect("error while running tauri application"); */

    if let Ok(conn) = create_database("database.db") {
        println!("{} Searching audio files", '\u{1F50E}');
        let files = scan_audio_files("D:/FIT_Apprenti_Vague_006/music-player/client/public");
        let prog = ProgressBar::new(u64::try_from(files.len()).unwrap());

        println!("{} Fetching audio metadatas", '\u{1F4C3}');
        for file in files {
            if !store_audio_metadatas(&file, &conn) {
                eprintln!("Failed to extract {file} metadatas");
            }
            prog.inc(1);
        }
        prog.finish_with_message("done");
    } else {
        eprintln!("Failed to connect to application database.");
    }
}
