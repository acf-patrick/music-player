import { useRef, useEffect, useState, useMemo, useContext } from "react";
import styled, { keyframes } from "styled-components";
import { DataMutatorsContext, DatasContext } from "../utils";
import { stringToDuration } from "../utils";

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
  // background: red;
  animation: ${slideUp} 500ms both;
  position: relative;

  .slide {
    height: 3px;
    display: flex;
    align-items: center;
    background: ${({ theme }) => theme.colors.song.borderBottom};
  }

  input {
    height: 3px;
    flex-grow: 1;
    -webkit-appearance: none;
    margin: unset;
    background-image: ${({ theme }) =>
      `linear-gradient(${theme.colors.player.line}, ${theme.colors.player.line})`};
    background-size: 0 100%;
    background-repeat: no-repeat;

    &::-webkit-slider-thumb {
      -webkit-appearance: none;
      width: 8px;
      aspect-ratio: 1;
      background: black;
      border-radius: 100%;
      outline: solid 0px transparent;
      transition: outline 300ms;
      background: ${({ theme }) => theme.colors.player.line};

      &:hover {
        cursor: pointer;
        outline: solid 2px ${({ theme }) => theme.colors.player.line};
      }
    }
  }
`;

let playerTimerHandle = 0;

function Player() {
  const { paused, playingSong } = useContext(DatasContext);
  const { setPaused } = useContext(DataMutatorsContext);

  const slideRef = useRef<HTMLInputElement | null>(null);

  // Song duration in seconds
  const duration = useMemo(() => {
    if (playingSong) {
      if (playingSong.duration)
        return stringToDuration(playingSong.duration.toString());
    }
    return 0;
  }, [playingSong]);

  useEffect(() => {
    const slide = slideRef.current;
    if (slide) {
      slide.value = "0";
      slide.style.backgroundSize = "0";
    }
  }, [playingSong]);

  // Number of seconds elapsed
  const [progression, setProgression] = useState(0);

  /* useEffect(() => {
    if (!playerTimerHandle)
      playerTimerHandle = setInterval(() => {
        setProgression((progression) => progression + 1);
      }, duration * 10);
  }, [playingSong]);

  useEffect(() => {}, []);

  useEffect(() => {
    if (progression >= 100) {
      setPaused!(true);
      clearInterval(playerTimerHandle);
    }
  }, [progression]); */

  const slideOnMouseOver = (e: React.MouseEvent<HTMLDivElement>) => {};

  return (
    <StyledContainer>
      <div className="slide">
        {duration && (
          <input
            ref={slideRef}
            type="range"
            max={duration}
            name="slide"
            style={{
              backgroundSize: `${Math.floor(
                (progression * 100) / duration
              )}% 100%`,
            }}
            onInput={(e) => {
              const input = e.target as HTMLInputElement;
              setProgression(parseInt(input.value));
            }}
            defaultValue={0}
          />
        )}
      </div>
    </StyledContainer>
  );
}

export default Player;
