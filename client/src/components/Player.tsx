import { useContext } from "react";
import styled, { keyframes } from "styled-components";
import { DatasContext } from "../utils";

const slideUp = keyframes`
  from {
    transform: translateY(100%);
  } to {
    transform: translateY(0);
  }
`;

const StyledContainer = styled.div`
  height: 14%;
  min-height: 100px;
  background: red;
  animation: ${slideUp} 500ms both;
  position: relative;

  .slide {
    position: relative;
    left: 0;
    top: 0;
    height: 3px;
    //transform: translateY(-50%);
    display: flex;
    align-items: center;
    justify-content: flex-end;
  }

  // test

  .line {
    width: 60%;
  }

  .remainder {
    width: calc(40% - 10px);
  }

  ///////

  .line,
  .circle {
    background: ${({ theme }) => theme.colors.player.line};
  }

  .line,
  .remainder {
    height: 100%;
  }

  .circle {
    // display: none;
    cursor: pointer;
    width: 10px;
    height: 10px;
    border-radius: 100%;
    transform: scale(1);
    transition: transform 300ms;

    &:hover {
      transform: scale(1.25);
    }
  }

  .remainder {
    // box-shadow: 0 -1px 5px rgba(0, 0, 0, 1);
  }
`;

function Player() {
  const { playingSong } = useContext(DatasContext);

  return (
    <StyledContainer>
      <div className="slide">
        <span className="line"></span>
        <span className="circle"></span>
        <span className="remainder"></span>
      </div>
    </StyledContainer>
  );
}

export default Player;
