import { useParams } from "react-router-dom";
import AlbumList from "./AlbumList";
import SongList from "./SongList";
import styled from "styled-components";

const StyledContainer = styled.div`
  width: 100%;
  height: 100%;
  display: grid;
  grid-template-columns: 1fr 1fr;

  .overview {
    display: grid;
    grid-template-rows: 54% 46%;
  }

  .album-cover {
    background: black;
  }
`;

export default function Album() {
  // QmxhY2t3YXRlciBQYXJr
  const { name } = useParams();

  return (
    <StyledContainer>
      <div className="overview">
        <div className="album-cover"></div>
        <AlbumList />
      </div>
      <SongList />
    </StyledContainer>
  );
}
