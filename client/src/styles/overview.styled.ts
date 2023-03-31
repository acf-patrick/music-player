import styled, { keyframes } from "styled-components";
import { AlbumAppearance } from "../utils/models";

const dropUp = keyframes`
  from {
    transform: scaleY(0);
  } to {
    transform: scaleY(1);
  }
`;

const StyledOverview = styled.div<{ albumAppearance: AlbumAppearance }>`
  display: flex;
  overflow-y: auto;
  flex-direction: column;
  padding: ${({ theme }) => theme.spacings.padding} 2rem 0;

  .results-wrapper {
    overflow-y: auto;

    ::-webkit-scrollbar {
      display: none;
    }
  }

  ul.results {
    display: ${({ albumAppearance }) =>
      albumAppearance === AlbumAppearance.GridCell ? "grid" : "block"};

    font-size: ${({ albumAppearance }) =>
      albumAppearance === AlbumAppearance.GridCell ? "0.75rem" : "1rem"};

    list-style: none;
    padding: 0;

    grid-template-columns: repeat(auto-fit, minmax(128px, 144px));
    align-items: start;
    justify-items: center;
  }

  li {
    padding: 0.5rem;
    cursor: pointer;
    border-radius: ${({ theme }) => theme.borderRadius};
    overflow: hidden;
    background: transparent;
    transition: background 300ms, transform 300ms;

    &:hover {
      transform: translateY(-3px);
      box-shadow: 0 2px 5px rgba(0, 0, 0, 0.5);
      background: ${({ theme }) => theme.colors.hovered.background};
      outline: solid 1px ${({ theme }) => theme.colors.hovered.border};
    }
  }

  span {
    margin-left: 0.5rem;
  }

  .no-result {
    flex-grow: 1;
    display: grid;
    place-items: center;
  }

  .view-setter {
    position: absolute;
    right: calc(50% + 32px);
    bottom: 32px;
    width: 46px;
    aspect-ratio: 1;
    border: none;
    outline: none;
    border-radius: 100%;
    display: grid;
    place-items: center;
    cursor: pointer;
    background: transparent;
    transform: rotate(180deg);
    transition: background 300ms, transform 500ms ease-out;
    backdrop-filter: blur(15px);

    &:hover {
      background: ${({ theme }) => theme.colors.hovered.background};
    }

    svg {
      font-size: 1.5rem;
    }
  }

  .view-options {
    position: absolute;
    z-index: 10;
    right: calc(50% + 32px);
    bottom: 98px;
    border-radius: 5px;
    overflow: hidden;
    box-shadow: 0 3px 10px rgba(0, 0, 0, 0.4);
    background: black;
    transform-origin: bottom center;
    transform: scaleY(0);
    transition: transform 200ms ease-out;

    div {
      font-size: 0.85rem;
      color: white;
      cursor: pointer;
      padding: 0.5rem 1rem;
      background: transparent;
      transition: background 300ms;

      &:hover {
        color: black;
        background: ${({ theme }) => theme.colors.hovered.background};
      }
    }
  }

  .arrow {
    z-index: 3;
    width: 0;
    position: absolute;
    bottom: 82px;
    right: calc(50% + 40px);
    border-top: solid 16px black;
    border-left: solid 16px transparent;
    border-right: solid 16px transparent;
  }
`;

export default StyledOverview;
