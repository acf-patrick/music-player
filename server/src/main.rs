use func::create_database;

mod func;

/* #![cfg_attr(
    all(not(debug_assertions), target_os = "windows"),
    windows_subsystem = "windows"
)] */

fn main() {
    /* tauri::Builder::default()
    .run(tauri::generate_context!())
    .expect("error while running tauri application"); */
	create_database("database.db");
}
