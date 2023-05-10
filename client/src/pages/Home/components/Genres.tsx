import { useState, useEffect } from "react";
import Header from "./Header";
import { NoResult } from "../../../components";
import { useGenres } from "../../../utils/hook";
import { StyledOverview as StyledContainer } from "../../../styles";

export default function Genres() {
  const genres = useGenres();
  const [results, setResults] = useState<string[]>([]);

  useEffect(() => {
    setResults(genres);
  }, [genres]);

  const searchInputOnEdit = (value: string) => {
    const keyword = value.toLowerCase();
    if (!keyword) {
      setResults(genres);
      return;
    }

    setResults(
      genres.filter((genre) =>
        genre ? genre.toLowerCase().indexOf(keyword) >= 0 : false
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
        field="Genre"
        searchInputOnEdit={searchInputOnEdit}
        sortOptionOnUpdate={sortOptionOnUpdate}
      />
      {results.length ? (
        <div className="list-wrapper">
          <ul className="list">
            {results.map((genre, i) => (
              <li key={i}>
                <div>
                  ♪<span>{genre}</span>
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
