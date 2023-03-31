import { AlbumAppearance, IAlbum } from "../utils/models";
import { IoAlbums } from "react-icons/io5";
import styled from "styled-components";

const StyledWithThumbnail = styled.div`
  display: flex;
  align-items: center;
  gap: 0.75rem;

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
  .artist {
    font-size: 0.75rem;
    color: grey;
  }

  .cover {
    display: none;
  }

  padding-left: 0.5rem;
`;

const StyledGridCell = styled.div`
  .name {
    font-size: 0.75rem;
    font-weight: bold;
    color: #505050;
  }

  .artist {
    color: black;
  }

  img {
    width: 100%;
    aspect-ratio: 1;
  }
`;

function Album({ appearance, name, artist, cover }: IAlbum) {
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
  }

  return (
    <Container>
      <div className="cover">
        {cover ? <img src={`${cover}`} alt="" /> : <IoAlbums />}
      </div>
      <div>
        <div className="name">{name}</div>
        <div className="artist">{artist}</div>
      </div>
    </Container>
  );
}

export default Album;
