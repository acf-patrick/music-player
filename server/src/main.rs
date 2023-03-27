#![cfg_attr(
    all(not(debug_assertions), target_os = "windows"),
    windows_subsystem = "windows"
)]

// use std::fs;
// use tauri::api::dialog;
use tauri_api::dialog;

#[tauri::command]
fn choose_folder() -> Vec<String> {
	let mut files = Vec::new();

	pick_folder();

	/* dialog::FileDialogBuilder::new()
		.pick_folder(move |path| match path {
			Some(path) => {
				match fs::read_dir(path) {
					Ok(dir) => {
						for entry in dir {
							match entry {
								Ok(entry) => {
									match entry.path().into_os_string().into_string() {
										Ok(path) => {
											files.push(path);
										}
										_ => {}
									}
								}
								_ => {}
							}
						}
					}
					_ => {}
				}
			}
			_ => {}
		}); */

	return files;
}

fn main() {
    tauri::Builder::default()
        .run(tauri::generate_context!())
        .expect("error while running tauri application");
}
