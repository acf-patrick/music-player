import { useEffect, useState } from "react";
import { ThemeProvider } from "styled-components";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { DatasContext, stringToDuration } from "./utils";
import { Home, Error } from "./pages";

import { StyledAppContainer } from "./styles";
import themes from "./styles/themes";
import useAudios from "./utils/hook";
import { Artist, Genre, Album, Audio } from "./utils/models";

function App() {
  const audios = useAudios();
  const [artists, setArtists] = useState<Artist[]>([]);
  const [genres, setGenres] = useState<Genre[]>([]);
  const [albums, setAlbums] = useState<Album[]>([]);
  const [queue, setQueue] = useState<Audio[]>([]);

  useEffect(() => {
    if (audios.length > 0) {
      const audio = audios[audios.length - 1];
      if (audio.album) {
        const album = albums.find((album) => album.name === audio.album);
        if (album) {
          const songs = album.songs!;
          if (!songs.has(audio.hash)) {
            songs.add(audio.hash);
            if (audio.year !== undefined)
              album.year = Math.max(
                album.year === undefined ? 0 : album.year,
                audio.year.valueOf()
              );
            album.duration! += stringToDuration(audio.duration?.toString()!);
          }
        } else {
          albums.push({
            name: audio.album,
            artist: audio.artist ? audio.artist : "Unknown",
            cover: audio.cover,
            songs: new Set([audio.hash]),
            year: audio.year?.valueOf(),
            duration: stringToDuration(audio.duration?.toString()!),
          });
        }
      }

      if (audio.genre) {
        const genre = genres.find((genre) => genre.name === audio.genre);
        if (genre) {
          genre.songs!.add(audio.hash);
        } else {
          genres.push({
            name: audio.genre,
            songs: new Set([audio.hash]),
          });
        }

        genres.sort((a, b) => (a.name < b.name ? -1 : a.name > b.name ? 1 : 0));
      }

      if (audio.artist) {
        const artist = artists.find((artist) => artist.name === audio.artist);
        if (artist) {
          artist.songs!.add(audio.hash);
          if (audio.album) artist.albums!.add(audio.album);
        } else {
          const artist: Artist = {
            name: audio.artist,
            songs: new Set([audio.hash]),
          };
          artists.push(artist);
          if (audio.album) {
            const albums = artist.albums;
            if (albums) albums.add(audio.album);
            else artist.albums = new Set([audio.album]);
          }
        }

        artists.sort((a, b) =>
          a.name < b.name ? -1 : a.name > b.name ? 1 : 0
        );
      }
    }
  }, [audios]);

  return (
    <ThemeProvider theme={themes}>
      <DatasContext.Provider value={{ audios, albums, genres, artists, queue }}>
        <StyledAppContainer>
          <Router>
            <Routes>
              <Route path="/" element={<Home />} />
              <Route path="*" element={<Error />} />
            </Routes>
          </Router>
        </StyledAppContainer>
      </DatasContext.Provider>
    </ThemeProvider>
  );
}

export default App;
