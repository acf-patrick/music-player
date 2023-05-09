import { useState, useEffect } from "react";
import { useSongs } from "../../../utils/hook";
import { StyledOverview as StyledContainer } from "../../../styles";
import { SongSortOptions, Song } from "../../../utils/models";
import { Song as SongComponent, NoResult } from "../../../components";
import Header from "./Header";

export default function Songs() {
  const songs = useSongs();
  const [results, setResults] = useState<Song[]>([]);

  useEffect(() => {
    setResults(songs);
  }, [songs]);

  const searchInputOnEdit = (value: string) => {
    const keyword = value.toLowerCase();
    if (!keyword) {
      setResults(songs);
      return;
    }

    setResults(
      songs.filter((song) =>
        song.title ? song.title.toLowerCase().indexOf(keyword) >= 0 : false
      )
    );
  };

  const sortOptionOnUpdate = (
    sortDirection: "ascending" | "descending",
    sortBy: string
  ) => {
    const key = sortBy as keyof Song;
    setResults((results) => {
      const sorted = [...results].sort((a, b) => {
        if (a[key]! < b[key]!) return -1;
        if (a[key]! > b[key]!) return 1;
        return 0;
      });

      return sortDirection === "ascending" ? sorted : sorted.reverse();
    });
  };

  return (
    <StyledContainer>
      <Header
        count={results.length}
        field="Song"
        searchInputOnEdit={searchInputOnEdit}
        sortOptions={[...SongSortOptions]}
        sortOptionOnUpdate={sortOptionOnUpdate}
      />
      {results.length ? (
        <div className="list-wrapper">
          <ul className="list">
            {results.map((song, i) => (
              <li key={i}>
                <SongComponent datas={song} />
              </li>
            ))}
          </ul>
        </div>
      ) : (
        <NoResult />
      )}
    </StyledContainer>
  );
}
