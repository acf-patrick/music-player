import { AlbumAppearance, Album as IAlbum } from "../utils/models";
import { IoAlbums } from "react-icons/io5";
import styled from "styled-components";
import { durationToString } from "../utils";

const StyledWithThumbnail = styled.div`
  display: flex;
  align-items: center;
  gap: 0.75rem;

  & > div:nth-of-type(2) {
    flex-grow: 1;
  }

  .artist-duration {
    display: flex;
    justify-content: space-between;
  }

  .duration {
    color: rgba(100, 100, 100, 0.75);
  }
  .cover {
    display: grid;
    background: black;
    place-items: center;
    width: ${({ theme }) => theme.sizes.image.sm};
    aspect-ratio: 1;
  }

  .artist {
    font-size: 0.75rem;
    color: grey;
  }

  svg {
    font-size: 1.5rem;
    color: white;
  }

  img {
    max-width: ${({ theme }) => theme.sizes.image.sm};
    aspect-ratio: 1;
  }
`;

const StyledWithoutThumbnail = styled.div`
  padding-bottom: 0.25rem;
  border-bottom: solid 1px #1E1E1E;

  &:hover {
    border: none;
  }

  & > div:nth-of-type(2) {
    flex-grow: 1;
  }

  .duration {
    color: rgba(100, 100, 100, 0.75);
  }
  .artist {
    font-size: 0.75rem;
    color: grey;
  }

  .artist-duration {
    display: flex;
    justify-content: space-between;
  }

  .cover {
    display: none;
  }

  padding-left: 0.5rem;
`;

const StyledGridCell = styled.div`
  height: 100%;
  padding: 0.25rem;

  .duration {
    display: none;
  }

  .name {
    font-size: 0.75rem;
    font-weight: bold;
    color: #505050;
    overflow: hidden;
    white-space: nowrap;
    text-overflow: ellipsis;
  }

  .artist {
    color: black;
  }

  img {
    width: 100%;
    aspect-ratio: 1;
  }
`;

function Album({ appearance, name, artist, cover, duration }: IAlbum) {
  let Container: any = null;
  switch (appearance) {
    case AlbumAppearance.GridCell:
      Container = StyledGridCell;
      break;
    case AlbumAppearance.WithThumbnail:
      Container = StyledWithThumbnail;
      break;
    case AlbumAppearance.WithoutThumbnail:
      Container = StyledWithoutThumbnail;
      break;
    default:
      Container = StyledWithThumbnail;
      break;
  }

  return (
    <Container>
      <div className="cover">
        {cover ? <img src={`${cover}`} alt="" /> : <IoAlbums />}
      </div>
      <div>
        <div className="name">{name}</div>
        <div className="artist-duration">
          <div className="artist">{artist}</div>
          <div className="duration">{durationToString(duration!)}</div>
        </div>
      </div>
    </Container>
  );
}

export default Album;
