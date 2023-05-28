import { MdKeyboardBackspace } from "react-icons/md";
import styled from "styled-components";
import { Album } from "../../utils/models";
import { PlayButton, Queue } from "../../components";
import { useEffect, useState } from "react";
import { getAlbumSongs } from "../../utils/providers";
import { useNavigate } from "react-router-dom";

const StyledContainer = styled.div`
  display: flex;
  flex-direction: column;
  overflow-y: auto;
  background: ${({ theme }) =>
    `linear-gradient(to top right, ${theme.colors.album.background.primary}, ${theme.colors.album.background.secondary})`};

  & > div:first-of-type {
    padding-left: 4rem;
    padding-right: 3rem;
  }

  .header {
    padding: 2rem 0;
    display: flex;
    justify-content: space-between;
  }

  .back {
    color: ${({ theme }) => theme.colors.album.colors.secondary};
    border: none;
    background: transparent;
    display: flex;
    align-items: center;
    font-size: 1.25rem;
    gap: 5px;
    padding: 0;
    cursor: pointer;
  }

  .songs {
    overflow-y: auto;

    &::-webkit-scrollbar {
      display: none;
    }

    li {
      padding-left: 4rem !important;
      padding-right: 3rem !important;
    }
  }
`;

const StyledLines = styled.div`
  width: 40px;
  height: 16px;
  display: flex;
  flex-direction: column;
  justify-content: space-between;

  div:not(:nth-of-type(2)) {
    width: 40%;
  }

  div:first-of-type {
    align-self: flex-end;
  }

  div {
    background: ${({ theme }) => theme.colors.album.colors.secondary};
    height: 2px;
  }
`;

const StyledAlbumName = styled.div`
  @media (width <= ${({ theme }) => theme.sizes.minWidth}) {
    padding: 3rem 0;
  }

  padding: 4rem 0;
  margin-bottom: 1rem;

  h1 {
    @media (width <= ${({ theme }) => theme.sizes.minWidth}) {
      font-size: 2.5rem;
    }

    font-size: 3rem;
    text-transform: capitalize;
    margin: unset;
  }

  button {
    flex-shrink: 0;
  }

  & > div:first-of-type {
    margin-bottom: 1rem;

    .genre {
      text-transform: uppercase;
      color: ${({ theme }) => theme.colors.album.colors.secondary};
    }

    .year {
      color: ${({ theme }) => theme.colors.album.colors.tertiary};
    }
  }

  & > div:last-of-type {
    display: flex;
    gap: 1.5rem;
    justify-content: space-between;
    align-items: end;
  }
`;

export default function SongList({ album }: { album: Album }) {
  const navigate = useNavigate();
  const [songs, setSongs] = useState<string[]>([]);

  useEffect(() => {
    getAlbumSongs(album.title)
      .then((songs) => setSongs(songs))
      .catch((e) => console.error(e));
  }, [album]);

  return (
    <StyledContainer>
      <div>
        <div className="header">
          <button
            className="back"
            onClick={() => {
              navigate("/albums");
            }}
          >
            <MdKeyboardBackspace />
            <span>Back</span>
          </button>
          <StyledLines>
            <div></div>
            <div></div>
            <div></div>
          </StyledLines>
        </div>
        <StyledAlbumName>
          <div>
            {album.genres ? (
              <span className="genre">{album.genres.join(" & ")}</span>
            ) : (
              <></>
            )}
            {album.genres && album.year ? <span> / </span> : <></>}
            {album.year ? <span className="year">{album.year}</span> : <></>}
          </div>
          <div>
            <h1>{album.title}</h1>
            <PlayButton paused={true} />
          </div>
        </StyledAlbumName>
      </div>
      <div className="songs">
        <Queue songs={songs} />
      </div>
    </StyledContainer>
  );
}
