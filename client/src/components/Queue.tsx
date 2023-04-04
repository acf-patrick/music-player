import styled from "styled-components";
import { Audio } from "../utils/models";

const StyledContainer = styled.div`
  flex-grow: 1;
  overflow-y: auto;

  &::-webkit-scrollbar {
    display: none;
  }

  ul {
  }
`;

function Queue({ songs }: { songs: Audio[] }) {
  return (
    <StyledContainer>
      {songs ? (
        <ul>
          <li>song</li>
          <li>song</li>
          <li>song</li>
          <li>song</li>
          <li>song</li>
          <li>song</li>
          <li>song</li>
          <li>song</li>
          <li>song</li>
          <li>song</li>
          <li>song</li>
          <li>song</li>
          <li>song</li>
          <li>song</li>
          <li>song</li>
          <li>song</li>
          <li>song</li>
          <li>song</li>
          <li>song</li>
          <li>song</li>
          <li>song</li>
        </ul>
      ) : (
        <h1>Played musics appear here. 🎧</h1>
      )}
    </StyledContainer>
  );
}

export default Queue;
