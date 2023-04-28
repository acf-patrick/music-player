export async function getArtists() {
  let artists: string[] = [];
  
  try {
    const res = await fetch("/api/artists");
    const data = await res.json();
    artists = [...data];
  } catch (err) {
    console.error(err);
  }

  return artists;
}