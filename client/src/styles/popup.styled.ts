import styled, { CSSProperties, keyframes } from "styled-components";

const grow = keyframes`
  0% {
    transform: scaleY(0);
  } 75% {
    transform: scaleY(1.125);
  } 100% {
    transform: scaleY(1);
  }
`;

const StyledPopupOption = styled.div<{ override: CSSProperties }>`
  display: flex;
  align-items: center;
  justify-content: space-between;

  padding: 5px 10px;
  border-radius: 10px;
  text-transform: capitalize;
  font-size: 0.8rem;
  color: ${({ theme }) => theme.colors.contextMenu.text};
  background: transparent;
  transition: background 300ms;
  position: relative;

  white-space: nowrap;
  text-overflow: ellipsis;
  overflow: hidden;

  &:hover {
    color: ${({ theme }) => theme.colors.contextMenu.hovered.text};
    background: ${({ theme }) => theme.colors.contextMenu.hovered.background};
    cursor: pointer;
  }

  &#option:hover {
    ${({ override }) => {
      return { ...override };
    }};
  }
`;

const StyledPopup = styled.div<{
  position: string[];
  fixedHeight: boolean;
}>`
  position: absolute;
  ${({ position }) => (position[0] === "top" ? "bottom" : "top")}: 0;
  ${({ position }) => (position[1] === "left" ? "right" : "left")}: 100%;
  z-index: 10 !important;
  border-radius: 10px;
  backdrop-filter: blur(5px);
  box-shadow: 0 0 5px rgba(50, 50, 50, 0.5);
  background: ${({ theme }) => theme.colors.contextMenu.background};
  min-width: ${({ theme }) => theme.sizes.contextMenu.minWidth};
  max-width: ${({ theme }) => theme.sizes.contextMenu.maxWidth};
  max-height: ${({ theme, fixedHeight }) =>
    fixedHeight ? theme.sizes.contextMenu.maxHeight : "unset"};
  padding: 7px 0;
  transform-origin: ${({ position }) =>
      position[0] === "top" ? "bottom" : "top"}
    center;
  animation: ${grow} 300ms linear both;
  display: flex;
  flex-direction: column;

  .list {
    overflow-y: auto;

    &::-webkit-scrollbar {
      display: none;
    }
  }

  .bar {
    padding: 0.5rem;
    position: relative;

    & > div {
      background: ${({ theme }) => theme.colors.contextMenu.searchbar};
      display: flex;
      align-items: center;
      padding-left: 5px;
    }

    svg {
      font-size: 1.25rem;
    }

    input {
      padding: 5px;
      width: 100%;

      &::placeholder {
        padding: unset;
      }
    }
  }

  ul {
    display: flex;
    flex-direction: column;
    margin: unset;
    padding: unset;
    list-style: none;

    li {
      padding: 0 7px;
    }

    .separator {
      height: 1.25px;
      margin: 3px 2px;
      background: ${({ theme }) => theme.colors.contextMenu.separator};
    }

    li:hover > div:nth-of-type(1) {
      background: ${({ theme }) => theme.colors.contextMenu.hovered.background};
    }
  }
`;

export { StyledPopup, StyledPopupOption };
