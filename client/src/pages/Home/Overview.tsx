import { StyledOverview } from "../../styles";
import { BsFillGearFill } from "react-icons/bs";
import { useState, useRef, useEffect, createContext } from "react";
import { Song, Searchbar, Album } from "../../components";
import {
  AlbumAppearance,
  Song as Audio,
  Album as IAlbum,
  SongSortOptions,
  AlbumSortOptions,
} from "../../utils/models";
import { Outlet, useNavigate } from "react-router-dom";

export const SearchValueContext = createContext("");

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

function Overview() {
  const navigate = useNavigate();

  // Whether the select options are shown or not
  const [optionsFolded, setOptionsFolded] = useState(true);

  const routes = ["/", "/artists", "/genres", "/playlists", "/albums"];
  const fields = ["Song", "Artist", "Genre", "Playlist", "Album"] as const;
  const [currentField, setCurrentField] =
    useState<(typeof fields)[number]>("Song");

  // Whether the options used to set album viewing are set or not
  const [viewOptionsFolded, setViewOptionsFolded] = useState(true);

  const [sortDirection, setSortDirection] = useState<
    "ascending" | "descending"
  >("ascending");

  const [sortBy, setSortBy] = useState<
    (typeof AlbumSortOptions)[number] | (typeof SongSortOptions)[number] | null
  >(null);

  const [searchValue, setSearchValue] = useState("");

  useEffect(() => {
    setSortBy(null);
  }, [currentField]);

  /* Event Handlers */

  const optionOnClick = (index: number) => {
    setCurrentField(fields[index]);
    setViewOptionsFolded(true);
    setOptionsFolded(true);
    navigate(routes[index]);
  };

  const inputOnEdit = (e: React.ChangeEvent<HTMLInputElement>) => {
    e.preventDefault();
    setSearchValue(e.currentTarget.value);
  };

  const sortDirectionButtonOnClick = () => {
    setSortDirection(
      sortDirection === "ascending" ? "descending" : "ascending"
    );
  };

  return (
    <StyledOverview>
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
        <SearchValueContext.Provider value={searchValue}>
          <Outlet />
        </SearchValueContext.Provider>
    </StyledOverview>
  );
}

export default Overview;
