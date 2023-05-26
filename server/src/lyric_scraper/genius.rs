use reqwest::StatusCode;
use scraper::{Html, Selector};
use unidecode::unidecode;

fn convert_to_lowercase(s: &str) -> String {
    let mut result = String::new();
    let s = unidecode(s);

    for c in s.chars() {
        if c.is_ascii_alphabetic() {
            let lowercase_c = c.to_ascii_lowercase();
            if lowercase_c >= 'a' && lowercase_c <= 'z' {
                result.push(lowercase_c);
            }
        } else if c >= '0' && c <= '9' {
            result.push(c);
        } else if c == ' ' {
            result.push('-');
        }
    }

    result
}

pub async fn get_lyrics(artist: &str, song: &str) -> Option<String> {
    let url = format!(
        "https://www.genius.com/{}-{}-lyrics",
        convert_to_lowercase(artist),
        convert_to_lowercase(song)
    );

    match reqwest::get(url).await {
        Ok(res) => {
            if res.status() == StatusCode::OK {
                if let Ok(html) = res.text().await {
                    let document = Html::parse_document(&html);
                    let selector = Selector::parse("div[data-lyrics-container]").unwrap();

                    let parts = document.select(&selector).map(|container| {
                        let texts: Vec<&str> = container.text().collect();
                        texts.join("\n")
                    });

                    let parts: Vec<String> = parts.collect();
                    let lyrics = parts.join("\n");

                    Some(lyrics)
                } else {
                    None
                }
            } else {
                None
            }
        }
        Err(error) => {
            eprintln!("Failed to get lyrics : {}", error);
            None
        }
    }
}
