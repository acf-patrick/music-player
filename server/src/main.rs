mod func;
use func::scan_audio_files;

/* #![cfg_attr(
    all(not(debug_assertions), target_os = "windows"),
    windows_subsystem = "windows"
)] */

fn main() {
	let files = scan_audio_files("..");
	for file in files {
		println!("{file}");
	}
    /* tauri::Builder::default()
    .run(tauri::generate_context!())
    .expect("error while running tauri application"); */
}
