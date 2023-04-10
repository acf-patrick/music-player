import { useContext, useEffect } from "react";
import styled from "styled-components";
import { Audio } from "../utils/models";
import { BsFillPlayFill, BsPauseFill } from "react-icons/bs";
import { GoKebabVertical } from "react-icons/go";
import { DataMutatorsContext, DatasContext } from "../utils";

const StyledContainer = styled.div`
  flex-grow: 1;
  overflow-y: auto;

  &::-webkit-scrollbar {
    display: none;
  }

  ul {
    list-style: none;
    margin: unset;
    padding: unset;
    z-index: -1;
  }

  li {
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

  .song {
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
  }
`;

function Queue() {
  const { playingSong, playingSongIndex, queue, paused } =
    useContext(DatasContext);
  const { setPlayingSongIndex, setPaused } = useContext(DataMutatorsContext);

  const playButtonOnClick = (index: number) => {
    const song = queue[index];
    setPlayingSongIndex!(index);
    if (playingSong) {
      setPaused!(song.hash === playingSong.hash ? !paused : false);
    } else setPaused!(false);
  };

  const menuButtonOnClick = (e: React.MouseEvent<HTMLButtonElement>) => {};

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
              <div className="song">
                <div className="left">
                  <button
                    onClick={() => {
                      playButtonOnClick(i);
                    }}
                  >
                    {playingSongIndex === i ? (
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
                  </div>
                </div>
              </div>
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
