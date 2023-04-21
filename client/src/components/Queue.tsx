import { useContext, useState, FC } from "react";
import styled from "styled-components";
import { Audio } from "../utils/models";
import { DatasContext, DataMutatorsContext } from "../utils";
import { BsFillPlayFill, BsPauseFill } from "react-icons/bs";
import { GoKebabVertical } from "react-icons/go";
import { Popup } from ".";

const StyledSong = styled.div`
  display: flex;
  justify-content: space-between;
  color: ${({ theme }) => theme.colors.song.color};

  button {
    cursor: pointer;
    background: transparent;
    border: none;
    color: ${({ theme }) => theme.colors.song.color};
    font-size: 1.25rem;
    padding: 5px;
    display: grid;
    place-items: center;
  }

  .right,
  .left {
    display: flex;
    gap: 0.5rem;
    align-items: center;
  }

  .menu-btn {
    position: relative;
  }
`;

const Song: FC<{
  index: number;
  song: Audio;
}> = ({ index, song }) => {
  const contextMenuOptions = [
    {
      text: "Play",
    },
    {
      text: "Add to queue",
    },
    {
      text: "Add to playlist",
    },
    {
      text: "Show album",
    },
    {
      text: "Remove from queue",
    },
    {
      text: "Delete",
      styles: {
        background: "red",
        color: "white",
      },
    },
  ];

  const { queue, paused, playingSong, playingSongIndex } =
    useContext(DatasContext);
  const { setPlayingSongIndex, setPaused } = useContext(DataMutatorsContext);
  const [contextMenu, setContextMenu] = useState(false);

  const playButtonOnClick = (index: number) => {
    const song = queue[index];
    setPlayingSongIndex!(index);
    if (playingSong) {
      setPaused!(song.hash === playingSong.hash ? !paused : false);
    } else setPaused!(false);
  };

  const menuButtonOnClick = () => {
    setContextMenu((contextMenu) => !contextMenu);
  };

  return (
    <StyledSong>
      <div className="left">
        <button
          onClick={() => {
            playButtonOnClick(index);
          }}
        >
          {playingSongIndex === index ? (
            paused ? (
              <BsFillPlayFill />
            ) : (
              <BsPauseFill />
            )
          ) : (
            <BsFillPlayFill />
          )}
        </button>
        <span>{song.title}</span>
      </div>
      <div className="right">
        <span>{song.duration}</span>
        <div className="menu-btn">
          <button onClick={menuButtonOnClick}>
            <GoKebabVertical />
          </button>
          {contextMenu && (
            <Popup options={contextMenuOptions} separators={[3]} />
          )}
        </div>
      </div>
    </StyledSong>
  );
};

const StyledContainer = styled.div`
  flex-grow: 1;
  overflow-y: auto;

  &::-webkit-scrollbar {
    display: none;
  }

  & > ul {
    list-style: none;
    margin: unset;
    padding: unset;
    z-index: -1;
  }

  & > ul > li {
    padding: 1rem 1rem 0.75rem 2.25rem;
    color: white;
    border-bottom: solid 1px ${({ theme }) => theme.colors.song.borderBottom};
    background: transprent;
    transition: background 500ms;
    font-size: 0.85rem;

    &:hover {
      background: ${({ theme }) => theme.colors.song.bgHovered};
    }
  }

  .empty-queue {
    height: 100%;
    display: grid;
    place-items: center;

    h1 {
      font-size: 1.5rem;
    }
  }
`;

function Queue() {
  const { playingSong, playingSongIndex, queue, paused } =
    useContext(DatasContext);
  const { setPlayingSongIndex, setPaused } = useContext(DataMutatorsContext);
  const [contextMenu, setContextMenu] = useState(false);

  const playButtonOnClick = (index: number) => {
    const song = queue[index];
    setPlayingSongIndex!(index);
    if (playingSong) {
      setPaused!(song.hash === playingSong.hash ? !paused : false);
    } else setPaused!(false);
  };

  const menuButtonOnClick = (e: React.MouseEvent<HTMLButtonElement>) => {
    setContextMenu((contextMenu) => !contextMenu);
  };

  return (
    <StyledContainer>
      {queue && queue.length ? (
        <ul>
          {queue.map((song, i) => (
            <li
              key={i}
              onDoubleClick={() => {
                playButtonOnClick(i);
              }}
            >
              <Song index={i} song={{ ...song }} />
            </li>
          ))}
        </ul>
      ) : (
        <div className="empty-queue">
          <h1>Played musics appear here. 🎧</h1>
        </div>
      )}
    </StyledContainer>
  );
}

export default Queue;
