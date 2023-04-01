import { ThemeProvider } from "styled-components";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { DatasContext, stringToDuration } from "./utils";
import { Home, Error } from "./pages";

import { StyledAppContainer } from "./styles";
import themes from "./styles/themes";
import useAudios from "./utils/hook";
import { useMemo } from "react";
import { Artist, Genre, Album } from "./utils/models";

function App() {
  const audios = useAudios();
  const { artists, genres, albums } = useMemo(() => {
    const albums: Album[] = [];
    const genres: Genre[] = [];
    const artists: Artist[] = [];

    for (let audio of audios) {
      if (audio.album) {
        const album = albums.find((album) => album.name === audio.album);
        if (album) {
          const songs = album.songs!;
          if (!songs.has(audio.hash)) {
            songs.add(audio.hash);
            album.duration! += stringToDuration(audio.duration?.toString()!);
          }
        } else {
          albums.push({
            name: audio.album,
            artist: audio.artist ? audio.artist : "Unknown",
            cover: audio.cover,
            songs: new Set([audio.hash]),
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
      }
    }

    return { artists, genres, albums };
  }, [audios]);

  return (
    <ThemeProvider theme={themes}>
      <DatasContext.Provider value={{ audios, albums, genres, artists }}>
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
