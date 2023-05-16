import { useState, useEffect } from "react";
import styled, { keyframes } from "styled-components";
import { AiOutlineLoading } from "react-icons/ai";
import { useSong } from "../../../utils/hook";
import { StyledOverview as StyledContainer } from "../../../styles";
import { SongSortOptions, Song } from "../../../utils/models";
import { Song as SongComponent, NoResult } from "../../../components";
import Header from "./Header";

const spin = keyframes`
  from {
    transform: rotate(0);
  } to {
    transform: rotate(360deg);
  }
`;

const Loader = styled.div`
  position: absolute;
  bottom: 0;
  left: 50%;
  transform: translateX(-50%);
  font-size: 1.5rem;
  
  svg {
    animation: ${spin} 750ms ease-in-out infinite;
  }
`;

export default function Songs() {
  const [results, setResults] = useState<Song[]>([]);
  const [currentPage, setCurrentPage] = useState(0);
  const { pending, totalItems, totalPages, songs } = useSong(currentPage);

  // useEffect(() => {
  //   setResults(songs);
  // }, [songs]);

  useEffect(() => {
    setResults((results) =>
      (currentPage === 0 && results.length === 0) || currentPage > 0
        ? [...results, ...songs]
        : results
    );
  }, [currentPage, songs]);

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
    sortBy?: string
  ) => {
    if (sortBy) {
      const key = sortBy as keyof Song;
      setResults((results) => {
        const sorted = [...results].sort((a, b) => {
          if (a[key]! < b[key]!) return -1;
          if (a[key]! > b[key]!) return 1;
          return 0;
        });

        return sortDirection === "ascending" ? sorted : sorted.reverse();
      });
    }
  };

  const listOnScroll = (e: React.UIEvent<HTMLDivElement>) => {
    const threshold = 1;
    const div = e.currentTarget;
    if (
      Math.abs(div.scrollHeight - div.clientHeight - div.scrollTop) < threshold
    ) {
      setCurrentPage((currentPage) =>
        currentPage < totalPages ? currentPage + 1 : currentPage
      );
    }
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
        <div className="list-wrapper" onScroll={listOnScroll}>
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
      {pending && <Loader>
        <AiOutlineLoading />
      </Loader>}
    </StyledContainer>
  );
}
