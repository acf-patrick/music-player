import styled from "styled-components";
import { Audio } from "../utils/models";
import { IoMusicalNotesOutline } from "react-icons/io5";

const StyledContainer = styled.div`
  display: flex;

  .picture {
    display: grid;
    place-items: center;
    border: 1px solid black;
    background: #2d2727;

    svg {
      font-size: 1.5rem;
      width: ${({ theme }) => theme.sizes.image.md};
      color: white;
    }

    img {
      max-width: ${({ theme }) => theme.sizes.image.md};
    }
  }

  .datas {
    display: flex;
    flex-direction: column;
    flex-grow: 1;
    position: relative;
    padding-left: 1rem;
  }

  .title {
    font-weight: bold;
    font-size: 1rem;
    color: ${({ theme }) => theme.colors.songTitle};
  }

  .artist,
  .album,
  .duration {
    font-size: 0.75rem;
  }

  .duration {
    position: absolute;
    bottom: 5px;
    right: 5px;
  }
`;

function Song({ datas }: { datas: Audio }) {
  return (
    <StyledContainer>
      <div className="picture">
        {datas.cover ? (
          <img src={`${datas.cover}`} alt="" />
        ) : (
          <IoMusicalNotesOutline />
        )}
      </div>
      <div className="datas">
        <div className="title">{datas.title ? datas.title : "Unknown"}</div>
        <div className="artist">{datas.artist ? datas.artist : "Unknown"}</div>
        <div className="album">{datas.album ? datas.album : "Unknown"}</div>
        <div className="duration">{datas.duration}</div>
      </div>
    </StyledContainer>
  );
}

export default Song;
