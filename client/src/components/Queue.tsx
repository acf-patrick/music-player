import { useMemo } from "react";
import styled from "styled-components";
import { Audio } from "../utils/models";
import { BsFillPlayFill } from "react-icons/bs";
import { GoKebabVertical } from "react-icons/go";

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
    border-bottom: solid 1px rgba(0, 0, 0, 0.06);
    background: transprent;
    transition: background 500ms;
    font-size: 0.85rem;

    &:hover {
      background: ${({ theme }) => theme.colors.song.bgHovered};
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

function Queue({ songs }: { songs: Audio[] }) {
  const queue = useMemo(() => {
    return [...songs].sort((a, b) => {
      if (a.title && b.title) {
        if (a.title < b.title) return -1;
        if (a.title > b.title) return 1;
      }
      return 0;
    });
  }, [songs]);

  return (
    <StyledContainer>
      {queue ? (
        <ul>
          {songs.map((song, i) => (
            <li key={i}>
              <div className="song">
                <div className="left">
                  <button>
                    <BsFillPlayFill />
                  </button>
                  <span>{song.title}</span>
                </div>
                <div className="right">
                  <span>{song.duration}</span>
                  <button>
                    <GoKebabVertical />
                  </button>
                </div>
              </div>
            </li>
          ))}
        </ul>
      ) : (
        <h1>Played musics appear here. 🎧</h1>
      )}
    </StyledContainer>
  );
}

export default Queue;
