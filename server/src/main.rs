#![cfg_attr(
    all(not(debug_assertions), target_os = "windows"),
    windows_subsystem = "windows"
)]

use std::fs;

fn scan_audio_files(src_path: &str) -> Vec<String> {
    let extensions = vec!["mp3", "m4a", "mp4", "flac", "wav"];
    let mut list: Vec<String> = vec![];

    for content in fs::read_dir(src_path).unwrap() {
        if let Ok(entry) = content {
            if let Ok(entry_type) = entry.file_type() {
                if entry_type.is_dir() {
                    let path = scan_audio_files(entry.path().to_str().unwrap());
                    list.extend(path);
                } else if entry_type.is_file() {
                    if let Some(extension) = entry.path().extension() {
                        if extensions.contains(&extension.to_str().unwrap()) {
                            list.push(entry.path().to_str().unwrap().to_string());
                        }
                    }
                }
            }
        }
    }

    return list;
}

fn main() {
    tauri::Builder::default()
        .run(tauri::generate_context!())
        .expect("error while running tauri application");
}
