import { useRef, useEffect } from "react";
import styled, { keyframes } from "styled-components";
import { IPopupProps } from "../utils/models";

const grow = keyframes`
  0% {
    transform: scaleY(0) translateX(100%);
  } 75% {
    transform: scaleY(1.125) translateX(100%);
  } 100% {
    transform: scaleY(1) translateX(100%);
  }
`;

const StyledContainer = styled.div`
  &:focus {
    background: red;
  }
  display: flex;
  flex-direction: column;
  position: absolute;
  top: 100%;
  right: 0;
  z-index: 10;
  border-radius: 10px;
  backdrop-filter: blur(5px);
  box-shadow: 0 0 5px rgba(50, 50, 50, 0.5);
  background: ${({ theme }) => theme.colors.contextMenu.background};
  min-width: 128px;
  padding: 7px;
  transform-origin: top center;
  animation: ${grow} 300ms linear both;

  & > div {
    padding: 5px 10px;
    border-radius: 10px;
    text-transform: capitalize;
    font-size: 0.8rem;
    color: ${({ theme }) => theme.colors.contextMenu.text};
    background: transparent;
    transition: background 300ms;

    &:hover {
      color: ${({ theme }) => theme.colors.contextMenu.hovered.text};
      background: ${({ theme }) => theme.colors.contextMenu.hovered.background};
      cursor: pointer;
    }
  }
`;

function Popup({
  options,
  optionOnClick,
  separators,
}: IPopupProps) {
  return (
    <StyledContainer>
      {options.map((option, i) => (
        <div
          key={i}
          onClick={() => {
            if (optionOnClick) {
              const obj = optionOnClick.find((obj) => obj.index === i);
              if (obj) {
                obj.callback(option);
              }
            }
          }}
        >
          {option}
        </div>
      ))}
    </StyledContainer>
  );
}

export default Popup;
