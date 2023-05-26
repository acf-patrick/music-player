mod azlyrics;
mod genius;

pub async fn get_lyrics(artist: &str, song: &str) -> Option<String> {
  let mut lyrics = azlyrics::get_lyrics(artist, song).await;
  if lyrics == None {
    lyrics = genius::get_lyrics(artist, song).await;
  }

  lyrics
}

#[cfg(test)]
mod tests {
    use super::*;

    #[tokio::test]
    async fn azlyrics() {
      let lyrics = azlyrics::get_lyrics("Rick Astley", "Never gonna give you up").await;
      assert_ne!(lyrics, None);
      let lyrics = lyrics.unwrap();
      println!("{lyrics}");
    }

    #[tokio::test]
    async fn genius() {
      let lyrics = genius::get_lyrics("Rick Astley", "Never gonna give you up").await;
      assert_ne!(lyrics, None);
      let lyrics = lyrics.unwrap();
      println!("{lyrics}");
    }
}
