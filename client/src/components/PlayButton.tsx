import styled, { keyframes } from "styled-components";
import { FaPlay, FaPause } from "react-icons/fa";

const showPlayButton = keyframes`
  from {
    opacity: 0;
    transform: translateY(0);
  } to {
    opacity: 1;
    transform: translateY(-10px);
  }
`;

const StyledPlayButton = styled.button`
  width: 60px;
  height: 60px;
  border-radius: 100%;
  overflow: hidden;
  display: grid;
  place-items: center;
  font-size: 1.25rem;
  cursor: pointer;
  border: none;
  box-shadow: 0 5px 10px rgba(0, 0, 0, 0.5);
  animation: ${showPlayButton} 500ms 1s both;

  &:active {
    box-shadow: 0 0 5px rgba(0, 0, 0, 1) inset;
  }

  svg {
    transform: translateX(1px);
  }
`;

type ButtonProps = React.ButtonHTMLAttributes<HTMLButtonElement> & {
  paused: boolean;
};

const PlayButton = ({ paused, ...props }: ButtonProps) => {
  return (
    <StyledPlayButton {...props}>
      {paused ? <FaPlay /> : <FaPause />}
    </StyledPlayButton>
  );
};

export default PlayButton;
