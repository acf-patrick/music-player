import styled, { keyframes } from "styled-components";

const grow = keyframes`
  0% {
    transform: scaleY(0);
  } 75% {
    transform: scaleY(1.125);
  } 100% {
    transform: scaleY(1);
  }
`;

const StyledPopup = styled.div<{ position: string[] }>`
  display: flex;
  flex-direction: column;
  position: absolute;
  top: 50%;
  ${({ inverted }) => (inverted ? "right" : "left")}: 100%;
  z-index: 10;
  border-radius: 10px;
  backdrop-filter: blur(5px);
  box-shadow: 0 0 5px rgba(50, 50, 50, 0.5);
  background: ${({ theme }) => theme.colors.contextMenu.background};
  min-width: 128px;
  max-width: 256px;
  padding: 7px;
  transform-origin: top center;
  animation: ${grow} 300ms linear both;

  .option {
    padding: 5px 10px;
    border-radius: 10px;
    text-transform: capitalize;
    font-size: 0.8rem;
    color: ${({ theme }) => theme.colors.contextMenu.text};
    background: transparent;
    transition: background 300ms;

    white-space: nowrap;
    text-overflow: ellipsis;
    overflow: hidden;

    &:hover {
      color: ${({ theme }) => theme.colors.contextMenu.hovered.text};
      background: ${({ theme }) => theme.colors.contextMenu.hovered.background};
      cursor: pointer;
    }
  }

  .separator {
    height: 1.25px;
    margin: 3px 2px;
    background: ${({ theme }) => theme.colors.contextMenu.separator};
  }
`;

export default StyledPopup;
