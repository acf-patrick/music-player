import { useRef, useEffect, useState, useMemo, useContext } from "react";
import styled, { keyframes } from "styled-components";
import { DataMutatorsContext, DatasContext, durationToString } from "../utils";
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
    position: relative;
    height: 3px;
    display: flex;
    align-items: center;
    background: ${({ theme }) => theme.colors.song.borderBottom};
  }

  .tooltip {
    position: absolute;
    top: calc(100% + 2px);
    transform: translateX(-50%);
    display: none;
    flex-direction: column;
    align-items: center;
    opacity: 0.25;
    user-select: none;

    .arrow {
      width: 0;
      height: 0;
      border-left: solid 5px transparent;
      border-right: solid 5px transparent;
      border-bottom: solid 5px ${({ theme }) => theme.colors.tooltip.background};
    }

    .text {
      color: ${({ theme }) => theme.colors.tooltip.text};
      font-size: 0.75rem;
      padding: 2px 5px;
      border-radius: 5px;
      background: ${({ theme }) => theme.colors.tooltip.background};
    }
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

  const toolTipRef = useRef<HTMLDivElement | null>(null);

  // Song duration in seconds
  const duration = useMemo(() => {
    if (playingSong) {
      if (playingSong.duration)
        return stringToDuration(playingSong.duration.toString());
    }
    return 0;
  }, [playingSong]);

  // Number of seconds elapsed
  const [progression, setProgression] = useState(0);

  // Current mouse position on mouse over
  const [mousePosition, setMousePosition] = useState("");

  const updateProgression = () => {
    if (!playerTimerHandle)
      playerTimerHandle = setInterval(() => {
        setProgression((progression) => progression + 1);
      }, 1000);
  };

  useEffect(() => {
    setProgression(0);
  }, [playingSong]);

  useEffect(() => {
    if (progression >= duration) setPaused!(true);
  }, [progression]);

  useEffect(() => {
    if (paused) {
      clearInterval(playerTimerHandle);
      playerTimerHandle = 0;
    } else {
      updateProgression();
    }
  }, [paused]);

  const slideOnMouseMove = (e: React.MouseEvent<HTMLInputElement>) => {
    const slide = slideRef.current;
    if (slide) {
      // input type range bouding box
      const rect = slide.getBoundingClientRect();

      // relative position of the mouse
      const mouseX = e.clientX - rect.x;
      if (0 <= mouseX && mouseX <= rect.width) {
        const toolTip = toolTipRef.current;
        if (toolTip) {
          toolTip.style.display = "flex";
          toolTip.style.left = `${(mouseX * 100) / rect.width}%`;
        }

        const time = durationToString(
          Math.floor((parseInt(slide.max) * mouseX) / rect.width)
        );

        setMousePosition(time);
      }
    }
  };

  return (
    <StyledContainer>
      <div
        className="slide"
        onMouseLeave={() => {
          setMousePosition("");
        }}
      >
        {duration && (
          <>
            <input
              ref={slideRef}
              type="range"
              max={duration}
              name="slide"
              style={{
                backgroundSize: `${(progression * 100) / duration}% 100%`,
              }}
              onInput={(e) => {
                const input = e.target as HTMLInputElement;
                setProgression(parseInt(input.value));
              }}
              onMouseMove={slideOnMouseMove}
              value={progression}
            />
            {mousePosition && (
              <div className="tooltip" ref={toolTipRef}>
                <span className="arrow"></span>
                <span className="text">{mousePosition}</span>
              </div>
            )}
          </>
        )}
      </div>
    </StyledContainer>
  );
}

export default Player;