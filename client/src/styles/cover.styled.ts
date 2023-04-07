import styled from "styled-components";

const StyledCover = styled.div`
  display: grid;
  place-items: center;
  border: 1px solid black;
  background: ${({ theme }) => theme.colors.song.cover.background};
  aspect-ratio: 1;

  svg {
    font-size: 1.5rem;
    width: ${({ theme }) => theme.sizes.image.md};
    color: ${({ theme }) => theme.colors.song.cover.color};
  }

  img {
    max-width: ${({ theme }) => theme.sizes.image.md};
  }
`;

export default StyledCover;
