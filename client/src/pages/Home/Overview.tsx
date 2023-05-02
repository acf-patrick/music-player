import { MdSort } from "react-icons/md";
import { GrClose } from "react-icons/gr";
import { StyledOverview } from "../../styles";
import { BsFillGearFill } from "react-icons/bs";
import { useState, useRef, useContext, useEffect } from "react";
import { Song, Searchbar, Popup, Album } from "../../components";
import {
  AiOutlineSortAscending,
  AiOutlineSortDescending,
} from "react-icons/ai";
import {
  AlbumAppearance,
  Song as Audio,
  Album as IAlbum,
  SongSortOptions,
  AlbumSortOptions,
} from "../../utils/models";
import { useAlbums, useArtists, useGenres, useSongs } from "../../utils/hook";

// Convenience component for conditional rendering
function Result({
  result,
  field,
  albumAppearance,
}: {
  result: string | Audio | IAlbum;
  field: string;
  albumAppearance: AlbumAppearance;
}) {
  if (field === "Song") return <Song datas={result as Audio} />;

  if (field === "Album") {
    const album = result as IAlbum;
    return (
      <Album
        appearance={albumAppearance}
        cover={album.cover}
        artists={album.artists}
        title={album.title}
        duration={album.duration}
      />
    );
  }

  if (typeof result === "string") {
    if (field === "Genre") {
      return (
        <div>
          ♪<span>{result as string}</span>
        </div>
      );
    }
    if (field === "Artist") {
      return (
        <div>
          🎙️<span>{result as string}</span>
        </div>
      );
    }
  }

  return <></>;
}

function Overview({ songs }: { songs: Audio[] }) {
  const artists = useArtists();
  const genres = useGenres();
  const albums = useAlbums();

  const [results, setResults] = useState<Audio[] | string[] | IAlbum[]>([]);

  // Whether the select options are shown or not
  const [optionsFolded, setOptionsFolded] = useState(true);

  const fields = ["Song", "Artist", "Genre", "Playlist", "Album"] as const;
  const [currentField, setCurrentField] =
    useState<(typeof fields)[number]>("Song");

  // How album items will be displayed
  const [albumAppearance, setAlbumAppearance] = useState(
    AlbumAppearance.WithThumbnail
  );

  const viewSetterButton = useRef<HTMLButtonElement>(null);
  const viewOptions = useRef<HTMLDivElement>(null);

  // button displayed in album view setter
  const [viewButton, setViewButton] = useState(<BsFillGearFill />);

  // Whether the options used to set album viewing are set or not
  const [viewOptionsFolded, setViewOptionsFolded] = useState(true);

  const [sortDirection, setSortDirection] = useState<
    "ascending" | "descending"
  >("ascending");

  const [sortBy, setSortBy] = useState<
    (typeof AlbumSortOptions)[number] | (typeof SongSortOptions)[number] | null
  >(null);

  const [sortPopupShown, setSortPopupShown] = useState(false);

  const getDefaultResults = () => {
    switch (currentField) {
      case "Song":
        return [...songs];
        break;
      case "Artist":
        return [...artists];
        break;
      case "Genre":
        return [...genres];
        break;
      case "Album":
        return [...albums];
        break;
      case "Playlist":
        return [];
        break;
      default:
    }

    return [];
  };

  // Show all occurencies
  const resetResults = () => {
    setResults(getDefaultResults());
  };

  useEffect(() => {
    // Setting result view according to field chosen by the user
    resetResults();
  }, [songs, currentField]);

  useEffect(() => {
    setSortBy(null);
  }, [currentField]);

  useEffect(() => {
    setResults(results.reverse());
  }, [sortDirection]);

  useEffect(() => {
    const button = viewSetterButton.current;
    if (button)
      button.style.transform = `rotate(${viewOptionsFolded ? 180 : 0}deg)`;
    const div = viewOptions.current;
    if (div) div.style.transform = `scaleY(${viewOptionsFolded ? 0 : 1})`;
    setTimeout(() => {
      setViewButton(viewOptionsFolded ? <BsFillGearFill /> : <GrClose />);
    }, 300);
  }, [viewOptionsFolded]);

  useEffect(() => {
    if (sortBy) {
      const sort = (arr: any[], key: string) => {
        arr.sort((a, b) => {
          if (a[key] < b[key]) return -1;
          if (a[key] > b[key]) return 1;
          return 0;
        });

        return sortDirection === "ascending" ? arr : arr.reverse();
      };
      setResults(sort([...results], sortBy.toString()));
    }
  }, [sortDirection, sortBy]);

  /* Event Handlers */

  const optionOnClick = (index: number) => {
    setCurrentField(fields[index]);
    setAlbumAppearance(AlbumAppearance.WithThumbnail);
    setViewOptionsFolded(true);
    setOptionsFolded(true);
  };

  const viewOptionOnClick = (appearance: AlbumAppearance) => {
    setAlbumAppearance(appearance);
    setViewOptionsFolded(true);
  };

  const inputOnEdit = (e: React.ChangeEvent<HTMLInputElement>) => {
    e.preventDefault();
    const input = e.target as HTMLInputElement;
    const keyword = input.value.toLowerCase();
    if (!keyword) {
      resetResults();
      return;
    }

    switch (currentField) {
      case "Album":
        setResults(
          albums.filter(
            (album) => album.title.toLowerCase().indexOf(keyword) >= 0
          )
        );
        break;
      case "Genre":
        setResults(
          genres.filter((genre) => genre.toLowerCase().indexOf(keyword) >= 0)
        );
        break;
      case "Artist":
        setResults(
          artists.filter((artist) => artist.toLowerCase().indexOf(keyword) >= 0)
        );
        break;
      case "Song":
        setResults(
          songs.filter((song) =>
            song.title ? song.title.toLowerCase().indexOf(keyword) >= 0 : false
          )
        );
        break;
      default:
        break;
    }
  };

  const sortDirectionButtonOnClick = () => {
    setSortDirection(
      sortDirection === "ascending" ? "descending" : "ascending"
    );
  };

  return (
    <StyledOverview albumAppearance={albumAppearance}>
      <Searchbar
        currentField={currentField}
        fields={[...fields]}
        inputOnEdit={inputOnEdit}
        optionOnClick={optionOnClick}
        optionsFolded={optionsFolded}
        selectOnClick={() => {
          setOptionsFolded(!optionsFolded);
        }}
      />
      {results.length ? (
        <>
          <div className="sort-container">
            {(currentField === "Song" || currentField === "Album") && (
              <div
                className="buttons"
                onMouseLeave={() => {
                  setSortPopupShown(false);
                }}
              >
                {sortBy && (
                  <button
                    className="sort-direction"
                    title={sortDirection}
                    onClick={sortDirectionButtonOnClick}
                  >
                    {sortDirection === "ascending" ? (
                      <AiOutlineSortAscending />
                    ) : (
                      <AiOutlineSortDescending />
                    )}
                  </button>
                )}
                <button
                  className="sort-by"
                  onClick={() => {
                    setSortPopupShown(!sortPopupShown);
                  }}
                >
                  <MdSort />
                </button>
                {sortPopupShown && (
                  <Popup
                    options={(currentField === "Song"
                      ? SongSortOptions
                      : AlbumSortOptions
                    ).map((option, i) => {
                      return {
                        text: option,
                        callback: () => {
                          setSortBy(option);
                          setSortPopupShown(false);
                        },
                      };
                    })}
                  />
                )}
              </div>
            )}
            <div className="count">
              <span>{results.length}</span>
              {`result${results.length > 1 ? "s" : ""}`}
            </div>
          </div>
          <div className="results-wrapper">
            <ul className="results">
              {results.map((result, i) => (
                <li key={i}>
                  <Result
                    result={result}
                    field={currentField}
                    albumAppearance={albumAppearance}
                  />
                </li>
              ))}
            </ul>
          </div>
        </>
      ) : (
        <h1 className="no-result">
          <span>No result found 😞</span>
        </h1>
      )}
      {currentField === "Album" && (
        <>
          <button
            className="view-setter"
            ref={viewSetterButton}
            onClick={() => {
              setViewOptionsFolded(!viewOptionsFolded);
            }}
          >
            {viewButton}
          </button>
          <div className="view-options" ref={viewOptions}>
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
        </>
      )}
    </StyledOverview>
  );
}

export default Overview;
