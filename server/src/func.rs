use std::fs;

/// Scan audio files inside given directory
///
/// supported format : mp3, m4a, mp4, flac, wav
pub fn scan_audio_files(src_path: &str) -> Vec<String> {
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

/// Generate an ID from audio file content using SHA256
pub fn generate_audio_id(src_path: &str) -> String {
  let audio = std::path::Path::new(src_path);
  if audio.is_file() {
      if let Ok(hash) = sha256::try_digest(audio) {
          return hash;
      }
  } else {
      eprintln!("{src_path} is not a path to an audio file.");
  }

  String::new()
}
