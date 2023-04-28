export async function getGenres() {
  let genres: string[] = [];
  
  try {
    const res = await fetch("/api/genres");
    const data = await res.json();
    genres = [...data];
  } catch (err) {
    console.error(err);
  }

  return genres;
}