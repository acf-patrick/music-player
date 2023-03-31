import styled, { keyframes } from "styled-components";

const dropUp = keyframes`
  from {
    transform: scaleY(0);
  } to {
    transform: scaleY(1);
  }
`;

const StyledOverview = styled.div`
  display: flex;
  flex-direction: column;
  overflow-y: auto;
  padding: ${({ theme }) => theme.spacings.padding};
  position: relative;

  ::-webkit-scrollbar {
    display: none;
  }

  ul {
    list-style: none;
    font-size: 1rem;
    padding: 0;
  }

  li {
    padding: 0.5rem;
    cursor: pointer;
    border-radius: ${({ theme }) => theme.borderRadius};
    background: transparent;
    transition: background 300ms;

    &:hover {
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
    right: 32px;
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
    transform: rotate(0);
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
    right: 32px;
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
    right: 42px;
    border-top: solid 16px black;
    border-left: solid 16px transparent;
    border-right: solid 16px transparent;
  }
`;

export default StyledOverview;
