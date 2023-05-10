import { useState, useEffect } from "react";
import Header from "./Header";
import { NoResult } from "../../../components";
import { useArtists } from "../../../utils/hook";
import { StyledOverview as StyledContainer } from "../../../styles";

export default function Artists() {
  const artists = useArtists();
  const [results, setResults] = useState<string[]>([]);

  useEffect(() => {
    setResults(artists);
  }, [artists]);

  const searchInputOnEdit = (value: string) => {
    const keyword = value.toLowerCase();
    if (!keyword) {
      setResults(artists);
      return;
    }

    setResults(
      artists.filter((artist) =>
        artist ? artist.toLowerCase().indexOf(keyword) >= 0 : false
      )
    );
  };

  const sortOptionOnUpdate = (
    sortDirection: "ascending" | "descending",
    sortBy?: string
  ) => {
    setResults((results) => {
      const sorted = [...results].sort();
      return sortDirection === "ascending" ? sorted : sorted.reverse();
    });
  };

  return (
    <StyledContainer>
      <Header
        count={results.length}
        field="Artist"
        searchInputOnEdit={searchInputOnEdit}
        sortOptionOnUpdate={sortOptionOnUpdate}
      />
      {results.length ? (
        <div className="list-wrapper">
          <ul className="list">
            {results.map((artist, i) => (
              <li key={i}>
                <div>
                  🎙️<span>{artist}</span>
                </div>
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
