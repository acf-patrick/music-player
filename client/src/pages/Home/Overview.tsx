import { useState, useRef, useContext, useEffect, useMemo } from "react";
import { BsFillGearFill } from "react-icons/bs";
import { GrClose } from "react-icons/gr";
import { DatasContext, stringToDuration } from "../../utils";
import { StyledOverview } from "../../styles";
import { Song, Searchbar } from "../../components";
import {
  AlbumAppearance,
  Audio,
  Album as IAlbum,
  Genre,
  Artist,
} from "../../utils/models";
import Album from "../../components/Album";

// Convenience component for conditional rendering
function Result({
  result,
  field,
  albumAppearance,
}: {
  result: String | Audio | IAlbum;
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
        artist={album.artist}
        name={album.name}
      />
    );
  }

  if (field === "Genre") {
    const genre = result as Genre;
    return (
      <div>
        ♪<span>{genre.name}</span>
      </div>
    );
  }
  if (field === "Artist") {
    const artist = result as Artist;
    return (
      <div>
        🎙️<span>{artist.name}</span>
      </div>
    );
  }

  return <></>;
}

function Overview() {
  const { audios, artists, genres, albums } = useContext(DatasContext);

  const [results, setResults] = useState<Audio[] | String[] | IAlbum[]>([]);

  // Whether the select options are shown or not
  const [optionsFolded, setOptionsFolded] = useState(true);

  const fields = ["Song", "Artist", "Genre", "Playlist", "Album"] as const;
  const [currentField, setCurrentField] =
    useState<typeof fields[number]>("Song");

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

  useEffect(() => {
    // Setting result view according to field chosen by the user

    switch (currentField) {
      case "Song":
        setResults([...audios]);
        break;
      case "Artist":
        setResults([...artists]);
        break;
      case "Genre":
        setResults([...genres]);
        break;
      case "Album":
        setResults([...albums]);
        break;
      case "Playlist":
        setResults([]);
        break;
      default:
    }
  }, [audios, currentField]);

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

  /* Event Handlers */

  const containerOnScroll = () => {};

  const selectOnClick = () => {
    setOptionsFolded(!optionsFolded);
  };

  const optionOnClick = (index: number) => {
    setCurrentField(fields[index]);
    setAlbumAppearance(AlbumAppearance.WithThumbnail);
    setViewOptionsFolded(true);
    setOptionsFolded(true);
  };

  const viewSetterOnClick = () => {
    setViewOptionsFolded(!viewOptionsFolded);
  };

  const viewOptionOnClick = (appearance: AlbumAppearance) => {
    setAlbumAppearance(appearance);
    setViewOptionsFolded(true);
  };

  const formOnSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
  };

  return (
    <StyledOverview
      onScroll={containerOnScroll}
      albumAppearance={albumAppearance}
    >
      <Searchbar
        currentField={currentField}
        fields={[...fields]}
        formOnSubmit={formOnSubmit}
        optionOnClick={optionOnClick}
        optionsFolded={optionsFolded}
        selectOnClick={selectOnClick}
      />
      {results.length ? (
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
            onClick={viewSetterOnClick}
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
                viewOptionOnClick(AlbumAppearance.WithoutThumbnail);
              }}
            >
              List without thumbnail
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
