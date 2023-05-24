pub mod azlyrics;
pub mod genius;

#[cfg(test)]
mod tests {
    use super::*;

    #[tokio::test]
    async fn azlyrics() {
      let lyrics = azlyrics::get_lyrics("Paul McCartney", "Ebony And Ivory").await;
      assert_ne!(lyrics, None);
    }

    #[tokio::test]
    async fn genius() {
      let lyrics = genius::get_lyrics("Paul McCartney", "Ebony And Ivory").await;
      assert_ne!(lyrics, None);
    }
}
