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
    padding: 0.5rem 1rem 0.75rem 2rem;
    color: white;
  }

  .song {
    display: flex;
    justify-content: space-between;

    button {
      cursor: pointer;
      background: transparent;
      border: none;
      color: white;
    }
  }
`;

function Queue({ songs }: { songs: Audio[] }) {
  return (
    <StyledContainer>
      {songs ? (
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
