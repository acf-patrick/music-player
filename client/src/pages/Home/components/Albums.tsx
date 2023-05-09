import styled from "styled-components";
import { useRef, useEffect, useState, useContext } from "react";
import { BsFillGearFill } from "react-icons/bs";
import { GrClose } from "react-icons/gr";
import { Album } from "../../../components";
import { AlbumAppearance } from "../../../utils/models";
import { SearchValueContext } from "../Overview";
import { useAlbums } from "../../../utils/hook";

const StyledContainer = styled.div`
  .view-setter {
    position: absolute;
    right: calc(50% + 32px);
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
    right: calc(50% + 32px);
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
    right: calc(50% + 40px);
    border-top: solid 16px black;
    border-left: solid 16px transparent;
    border-right: solid 16px transparent;
  }
`;

export default function Albums() {
  const searchValue = useContext(SearchValueContext);

  // List of albums
  const albums = useAlbums();

  const viewOptionsRef = useRef<HTMLDivElement | null>(null);
  const viewSetterButtonRef = useRef<HTMLButtonElement | null>(null);

  // button displayed in album view setter
  const [viewButton, setViewButton] = useState(<BsFillGearFill />);

  // Whether the options used to set album viewing are set or not
  const [viewOptionsFolded, setViewOptionsFolded] = useState(true);

  // How album items will be displayed
  const [albumAppearance, setAlbumAppearance] = useState(
    AlbumAppearance.WithThumbnail
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

  return (
    <StyledContainer>
      <ul className="results">
        {albums.map((album, i) => (
          <li key={i}>
            <Album {...album} appearance={albumAppearance} />
          </li>
        ))}
      </ul>
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
    </StyledContainer>
  );
}
