use crate::{lyric_scraper, types::AppState};
use actix_web::{post, web, HttpResponse, Responder};
use serde::Deserialize;

#[derive(Deserialize)]
struct Query {
    artist: Option<String>,
    song: Option<String>,
}

#[post("")]
pub async fn get_lyrics(query: web::Json<Query>, data: web::Data<AppState>) -> impl Responder {
    if query.artist == None || query.song == None {
        HttpResponse::BadRequest().finish()
    } else {
        let mut cache = data.lyrics_cache.lock().unwrap();
        let mut lyrics: Option<String> = None;

        let artist = query.artist.clone().unwrap();
        let song = query.song.clone().unwrap();

        if cache.artist != None && cache.song != None {
            if artist == cache.artist.clone().unwrap() && song == cache.song.clone().unwrap() {
                lyrics = Some(cache.lyrics.clone());
            } else {
                lyrics = lyric_scraper::get_lyrics(&artist, &song).await;
            }
        } else {
            lyrics = lyric_scraper::get_lyrics(&artist, &song).await;
        }

        if let Some(lyrics) = lyrics {
            cache.artist = Some(artist);
            cache.song = Some(song);
            cache.lyrics = lyrics.clone();

            HttpResponse::Ok().json(lyrics)
        } else {
            HttpResponse::NotFound().finish()
        }
    }
}
