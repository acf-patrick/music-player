import { useState, useRef, useContext, useEffect, useMemo } from "react";
import { HiMagnifyingGlass } from "react-icons/hi2";
import { TiArrowSortedDown } from "react-icons/ti";
import { BsFillGearFill } from "react-icons/bs";
import { AudioListContext } from "../../utils";
import { StyledForm, StyledOverview } from "../../styles";
import { Song } from "../../components";
import { AlbumAppearance, Audio, IAlbum } from "../../utils/models";
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
        name={album.name}
      />
    );
  }

  if (typeof result !== "object") {
    if (field === "Genre")
      return (
        <div>
          ♪<span>{result as String}</span>
        </div>
      );
    if (field === "Artist")
      return (
        <div>
          🎙️<span>{result as String}</span>
        </div>
      );
  }

  return <></>;
}

function Overview() {
  const audios = useContext(AudioListContext);
  const { artists, genres, albums } = useMemo(() => {
    const artists = new Set<String>();
    const genres = new Set<String>();
    const albums: IAlbum[] = [];

    for (let audio of audios) {
      if (audio.artist) artists.add(audio.artist);
      if (audio.genre) genres.add(audio.genre);
      if (audio.album) {
        if (!albums.find((album) => album.name === audio.album))
          albums.push({ name: audio.album, cover: audio.cover });
      }
    }

    return { artists, genres, albums };
  }, [audios]);

  const [results, setResults] = useState<Audio[] | String[] | IAlbum[]>([
    ...audios,
  ]);
  const [optionsFolded, setOptionsFolded] = useState(true);

  const fields = ["Song", "Artist", "Genre", "Playlist", "Album"] as const;
  const [currentField, setCurrentField] =
    useState<typeof fields[number]>("Album");

  const [albumAppearance, setAlbumAppearance] = useState(
    AlbumAppearance.WithThumbnail
  );

  const viewSetterButton = useRef<HTMLDivElement>(null);
  const [viewOptionsFolded, setViewOptionsFolded] = useState(true);

  useEffect(() => {
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
  }, [currentField]);

  const selectOnClick = () => {
    setOptionsFolded(!optionsFolded);
  };

  const optionOnClick = (index: number) => {
    setCurrentField(fields[index]);
    setOptionsFolded(true);
  };

  const viewSetterOnClick = () => {
    const button = viewSetterButton.current!;
    button.style.transform = `rotate(${viewOptionsFolded ? 180 : 0}deg)`;
    setViewOptionsFolded(!viewOptionsFolded);
  };

  const formOnSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
  };

  return (
    <StyledOverview>
      <StyledForm onSubmit={formOnSubmit}>
        <div className="select" onClick={selectOnClick}>
          <TiArrowSortedDown />
          <div>{currentField}</div>
        </div>
        {!optionsFolded && (
          <div className="options">
            {fields.map((field, i) => (
              <div
                key={i}
                onClick={() => {
                  optionOnClick(i);
                }}
              >
                {field}
              </div>
            ))}
          </div>
        )}
        <div className="field">
          <input type="text" />
          <button type="submit">
            <HiMagnifyingGlass />
          </button>
        </div>
      </StyledForm>
      {results.length ? (
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
      ) : (
        <h1 className="no-result">
          <span>No result found 😞</span>
        </h1>
      )}
      {currentField === "Album" && (
        <>
          <div className="view-setter" ref={viewSetterButton} onClick={viewSetterOnClick}>
            <BsFillGearFill />
          </div>
          {!viewOptionsFolded && (
            <>
              <div className="arrow"></div>
              <div className="view-options">
                <div>List with thumbnail</div>
                <div>List without thumbnail</div>
                <div>Grid view</div>
              </div>
            </>
          )}
        </>
      )}
    </StyledOverview>
  );
}

export default Overview;
