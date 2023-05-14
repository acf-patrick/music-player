import styled from "styled-components";
import { useRef, useEffect, useState } from "react";
import { BsFillGearFill } from "react-icons/bs";
import { GrClose } from "react-icons/gr";
import Header from "./Header";
import { Album, NoResult } from "../../../components";
import {
  Album as TAlbum,
  AlbumAppearance,
  AlbumSortOptions,
} from "../../../utils/models";
import { useAlbums } from "../../../utils/hook";
import { StyledOverview as StyledContainer } from "../../../styles";

const StyledViewSetter = styled.div`
  .view-setter {
    position: absolute;
    right: 32px;
    bottom: 32px;
    width: 46px;
    height: 46px;
    border: none;
    outline: none;
    border-radius: 100%;
    display: grid;
    place-items: center;
    cursor: pointer;
    background: transparent;
    transform: rotate(180deg);
    transition: background 300ms, transform 500ms ease-out;
    backdrop-filter: blur(15px);

    &:hover {
      background: ${({ theme }) => theme.colors.hovered.background};
    }

    svg {
      font-size: 1.5rem;
    }
  }

  .view-options {
    position: absolute;
    right: 32px;
    bottom: 98px;
    border-radius: 5px;
    overflow: hidden;
    box-shadow: 0 3px 10px rgba(0, 0, 0, 0.4);
    background: black;
    transform-origin: bottom center;
    transform: scaleY(0);
    transition: transform 200ms ease-out;

    div {
      font-size: 0.85rem;
      color: white;
      cursor: pointer;
      padding: 0.5rem 1rem;
      background: transparent;
      transition: background 300ms;

      &:hover {
        color: black;
        background: ${({ theme }) => theme.colors.hovered.background};
      }
    }
  }

  .arrow {
    z-index: 3;
    width: 0;
    position: absolute;
    bottom: 82px;
    right: 40px;
    border-top: solid 16px black;
    border-left: solid 16px transparent;
    border-right: solid 16px transparent;
  }
`;

export default function Albums() {
  // List of albums
  const albums = useAlbums();
  const [results, setResults] = useState<TAlbum[]>([]);

  useEffect(() => {
    setResults(albums);
  }, [albums]);

  const viewOptionsRef = useRef<HTMLDivElement | null>(null);
  const viewSetterButtonRef = useRef<HTMLButtonElement | null>(null);

  // button displayed in album view setter
  const [viewButton, setViewButton] = useState(<BsFillGearFill />);

  // Whether the options used to set album viewing are set or not
  const [viewOptionsFolded, setViewOptionsFolded] = useState(true);

  // How album items will be displayed
  const [albumAppearance, setAlbumAppearance] = useState(
    AlbumAppearance.GridCell
  );

  useEffect(() => {
    const button = viewSetterButtonRef.current;
    if (button)
      button.style.transform = `rotate(${viewOptionsFolded ? 180 : 0}deg)`;
    const div = viewOptionsRef.current;
    if (div) div.style.transform = `scaleY(${viewOptionsFolded ? 0 : 1})`;
    setTimeout(() => {
      setViewButton(viewOptionsFolded ? <BsFillGearFill /> : <GrClose />);
    }, 300);
  }, [viewOptionsFolded]);

  const viewOptionOnClick = (appearance: AlbumAppearance) => {
    setAlbumAppearance(appearance);
    setViewOptionsFolded(true);
  };

  const searchInputOnEdit = (value: string) => {
    const keyword = value.toLowerCase();
    if (!keyword) {
      setResults(albums);
      return;
    }

    setResults(
      albums.filter((album) =>
        album.title ? album.title.toLowerCase().indexOf(keyword) >= 0 : false
      )
    );
  };

  const sortOptionOnUpdate = (
    sortDirection: "ascending" | "descending",
    sortBy?: string
  ) => {
    if (sortBy) {
      setResults((results) => {
        const sorted = [...results].sort((a, b) => {
          if (sortBy === "artist") {
            if (a.artists && b.artists) {
              if (a.artists.join(", ") < b.artists.join(", ")) return -1;
              if (a.artists.join(", ") > b.artists.join(", ")) return 1;
            }
          } else if (sortBy === "name") {
            if (a.title < b.title) return -1;
            if (a.title > b.title) return 1;
          } else {
            if (a.duration && b.duration) {
              if (a.duration < b.duration) return -1;
              if (a.duration > b.duration) return 1;
            }
          }
          return 0;
        });

        return sortDirection === "ascending" ? sorted : sorted.reverse();
      });
    }
  };

  return (
    <StyledContainer>
      <Header
        count={results.length}
        field="Album"
        searchInputOnEdit={searchInputOnEdit}
        sortOptionOnUpdate={sortOptionOnUpdate}
        sortOptions={[...AlbumSortOptions]}
      />
      {results.length ? (
        <div className="list-wrapper">
          <ul
            className={`list ${
              albumAppearance === AlbumAppearance.GridCell && "grid"
            }`}
          >
            {results.map((album, i) => (
              <li key={i}>
                <Album {...album} appearance={albumAppearance} />
              </li>
            ))}
          </ul>
        </div>
      ) : (
        <NoResult />
      )}
      <StyledViewSetter>
        <button
          className="view-setter"
          ref={viewSetterButtonRef}
          onClick={() => {
            setViewOptionsFolded(!viewOptionsFolded);
          }}
        >
          {viewButton}
        </button>
        <div className="view-options" ref={viewOptionsRef}>
          <div
            onClick={() => {
              viewOptionOnClick(AlbumAppearance.WithThumbnail);
            }}
          >
            List with thumbnail
          </div>
          <div
            onClick={() => {
              viewOptionOnClick(AlbumAppearance.GridCell);
            }}
          >
            Grid view
          </div>
        </div>
        {!viewOptionsFolded && <div className="arrow"></div>}
      </StyledViewSetter>
    </StyledContainer>
  );
}
