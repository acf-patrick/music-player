use super::types;
use indicatif::ProgressBar;
use lofty::{Accessor, AudioFile, Picture, PictureType, Probe, TaggedFileExt};
use rusqlite::{params, Connection, Error, Error::SqlInputError};
use std::fs;

/// Print error message generated by sqlite on fail
fn manage_db_error(result: Result<usize, Error>) {
    if let Err(error) = result {
        if let SqlInputError { msg, .. } = error {
            eprintln!("{msg}");
        }
    }
}

/// Create database tables
pub fn create_database(db_name: &str) -> Result<Connection, Error> {
    let conn = Connection::open(db_name)?;

    // Tables created according to type definition in "types"

    manage_db_error(conn.execute("DELETE FROM song", ()));
    manage_db_error(conn.execute("DELETE FROM image", ()));

    manage_db_error(conn.execute(
        r#"CREATE TABLE "image"(
			"id" TEXT NOT NULL PRIMARY KEY,
			"mime_type" TEXT,
			"data" BLOB);"#,
        (),
    ));

    manage_db_error(conn.execute(
        r#"CREATE TABLE "song"(
        "id" TEXT NOT NULL PRIMARY KEY,
        "path" TEXT,
        "liked" INTEGER,
        "year" INTEGER,
        "title" TEXT,
        "artist" TEXT,
		    "genre" TEXT,
        "track_number" INTEGER,
        "cover" TEXT,
        "album" TEXT,
        "duration" INTEGER,
        FOREIGN KEY("cover") REFERENCES image("id"));"#,
        (),
    ));

    manage_db_error(conn.execute(
        r#"CREATE TABLE "playlist"(
          "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
          "name" TEXT,
          "song" TEXT,
          FOREIGN KEY("song") REFERENCES song("id"));"#,
        (),
    ));

    manage_db_error(conn.execute(
        r#"CREATE TABLE "queue"(
        "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
        "song" TEXT,
        FOREIGN KEY ("song") REFERENCES song("id"));"#,
        (),
    ));

    println!("{} Database created", '\u{1F680}');

    Ok(conn)
}

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

fn save_song(song: &types::Song, conn: &Connection) {
    manage_db_error(conn.execute(
        r#"INSERT INTO song VALUES(?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)"#,
        (
            &song.id,
            &song.path,
            &song.liked,
            &song.year,
            &song.title,
            &song.artist,
            &song.genre,
            &song.track_number,
            &song.cover,
            &song.album,
            &song.duration,
        ),
    ));
}

pub fn store_audio_metadatas(audio_path: &str, conn: &Connection) -> bool {
    let audio_id = generate_audio_id(audio_path);
    if audio_id.is_empty() {
        eprintln!("Unable to read {audio_path}");
        return false;
    }

    let mut path = String::new();
    if let Some(back_slash) = audio_path.find("public") {
        for i in (back_slash + 6)..audio_path.len() {
            path.push(char::from(audio_path.as_bytes()[i]));
        }
    } else {
        path = audio_path.to_owned();
    }

    let mut song = types::Song {
        id: audio_id.clone(),
        path: path.clone(),
        liked: false,
        album: None,
        year: None,
        title: None,
        artist: None,
        genre: None,
        track_number: None,
        cover: None,
        duration: None,
    };

    let tagged = Probe::open(audio_path)
        .expect(&format!("{audio_path} invaid path."))
        .read()
        .expect("Unable to open {audio_path}");

    if let Some(tags) = tagged.primary_tag() {
        if let Some(year) = tags.year() {
            song.year = Some(year);
        }

        if let Some(title) = tags.title() {
            song.title = Some(title.to_string());
        } else {
            if let Some(i) = audio_path.rfind("\\") {
                song.title = Some(audio_path[(i + 1)..].to_string());
            } else {
                let i = audio_path.rfind("/").unwrap();
                song.title = Some(audio_path[(i + 1)..].to_string());
            }
        }

        if let Some(artist) = tags.artist() {
            song.artist = Some(artist.to_string());
        }

        if let Some(genre) = tags.genre() {
            song.genre = Some(genre.to_string());
        }

        if let Some(track_number) = tags.track() {
            song.track_number = Some(track_number);
        }

        if let Some(album) = tags.album() {
            song.album = Some(album.to_string());
        }

        let duration = tagged.properties().duration();
        song.duration = Some(duration.as_secs());

        let pics = tags.pictures();
        let mut cover: Option<&Picture> = None;

        if pics.len() == 1 {
            cover = Some(&pics[0]);
        } else {
            for pic in pics {
                if pic.pic_type() == PictureType::CoverFront {
                    cover = Some(pic);
                    break;
                }
            }
        }

        if let Some(cover) = cover {
            let cover_id = sha256::digest(cover.data());
            if !cover_id.is_empty() {
                let mime_type = cover.mime_type().to_string();
                song.cover = Some(cover_id.clone());

                // save image into database
                manage_db_error(conn.execute(
                    "INSERT INTO image VALUES(?, ?, ?)",
                    (&cover_id, &mime_type, cover.data()),
                ));
            }
        }

        save_song(&song, conn);
    } else {
        let mut title = String::new();
        if let Some(i) = audio_path.rfind("\\") {
            title = audio_path[(i + 1)..].to_string();
        } else {
            let i = audio_path.rfind("/").unwrap();
            title = audio_path[(i + 1)..].to_string();
        }
        let song = types::Song {
            id: audio_id,
            path,
            liked: false,
            album: None,
            year: None,
            title: Some(title),
            artist: None,
            genre: None,
            track_number: None,
            cover: None,
            duration: None,
        };
        save_song(&song, &conn);
        println!("{audio_path} : no tags to read.");
    }

    true
}

/// Search audio files inside folder and store metadatas into database
pub fn scan_folder(src_path: &str, conn: &Connection) {
    println!("{} Searching audio files", '\u{1F50E}');
    let files = scan_audio_files(src_path);
    let prog = ProgressBar::new(u64::try_from(files.len()).unwrap());

    println!("{} Fetching audio metadatas", '\u{1F4C3}');
    for file in files {
        if !store_audio_metadatas(&file, &conn) {
            eprintln!("Failed to extract {file} metadatas");
        }
        prog.inc(1);
    }
    prog.finish_with_message("done");
}

#[cfg(test)]
mod tests {
    use super::*;
    use std::env;

    #[test]
    #[ignore]
    fn fill_database() {
        let DATABASE = "node/database.db";
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
            panic!("Failed to connect to application database.");
        }
    }

    #[test]
    fn fill_queue() {
        if let Ok(conn) = Connection::open("node/database.db") {
            if let Err(error) = conn.execute("DELETE FROM queue;", ()) {
                panic!("{error}");
            }
            if let Ok(mut stmt) = conn.prepare("SELECT id FROM song ORDER BY RANDOM() LIMIT 15") {
                if let Ok(iter) = stmt.query_map([], |row| {
                    let mut id = String::new();
                    if let Ok(value) = row.get(0) {
                        id = value;
                    }
                    Ok(id)
                }) {
                    let mut i = 0;
                    for id in iter {
                        if let Ok(id) = id {
                            manage_db_error(
                                conn.execute("INSERT INTO queue VALUES(?, ?)", params![i, id]),
                            );
                            i = i + 1;
                        }
                    }
                }
            } else {
                panic!("Failed to feed 'queue' table");
            }
        } else {
            panic!("Failed to open database");
        }
    }
}
