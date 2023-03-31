import { AlbumAppearance, IAlbumProps } from "../utils/models";
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

  svg {
    font-size: 1.5rem;
    color: white;
  }

  img {
    max-width: ${({ theme }) => theme.sizes.image.sm};
  }
`;

const StyledWithoutThumbnail = styled.div`
  
`;

const StyledGridCell = styled.div``;

function Album({ appearance, name, cover }: IAlbumProps) {
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
      <div>{name}</div>
    </Container>
  );
}

export default Album;
