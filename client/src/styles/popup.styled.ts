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

    ${({ override }) => {
      return { ...override };
    }};
  }
`;

const StyledPopup = styled.ul<{ position: string[] }>`
  display: flex;
  flex-direction: column;
  margin: unset;
  list-style: none;
  position: absolute;
  ${({ position }) => (position[0] === "top" ? "bottom" : "top")}: 50%;
  ${({ position }) => (position[1] === "left" ? "right" : "left")}: 100%;
  z-index: 10 !important;
  border-radius: 10px;
  backdrop-filter: blur(5px);
  box-shadow: 0 0 5px rgba(50, 50, 50, 0.5);
  background: ${({ theme }) => theme.colors.contextMenu.background};
  min-width: 128px;
  max-width: 256px;
  padding: 7px;
  transform-origin: ${({ position }) =>
      position[0] === "top" ? "bottom" : "top"}
    center;
  animation: ${grow} 300ms linear both;

  .separator {
    height: 1.25px;
    margin: 3px 2px;
    background: ${({ theme }) => theme.colors.contextMenu.separator};
  }
`;

export { StyledPopup, StyledPopupOption };
