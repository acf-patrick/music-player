import { BsFillVolumeUpFill, BsRepeat } from "react-icons/bs";
import { IoMusicalNotesOutline } from "react-icons/io5";
import {
  TbPlayerTrackPrevFilled,
  TbPlayerTrackNextFilled,
  TbPlayerPlayFilled,
  TbPlayerPauseFilled,
} from "react-icons/tb";
import { useRef, useEffect, useState, useMemo, useContext } from "react";
import styled, { keyframes } from "styled-components";
import {
  DataMutatorsContext,
  DatasContext,
  stringToDuration,
  durationToString,
} from "../utils";
import { StyledCover } from "../styles";
import { IPlayerProps } from "../utils/models";

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
  animation: ${slideUp} 500ms both;
  position: relative;
  display: flex;
  flex-direction: column;

  .slide {
    position: relative;
    height: 3px;
    display: flex;
    align-items: center;
    background: ${({ theme }) => theme.colors.song.borderBottom};
  }

  .control {
    flex-grow: 1;
    display: grid;
    grid-template-columns: repeat(3, 1fr);
    align-items: center;
    // justify-content: space-between;
    padding: 0 1.5rem;

    &__left,
    &__right {
      display: flex;
      gap: 1rem;
      align-items: center;
    }

    &__left {
      justify-content: flex-start;
    }

    &__right {
      justify-content: flex-end;
    }

    .buttons {
      display: flex;
      gap: 1rem;
      justify-content: center;
    }

    button {
      font-size: 1.25rem;
      background: transparent;
      border: none;
      cursor: pointer;
      display: grid;
      place-items: center;
    }

    .time .total,
    &__right > button {
      color: ${({ theme }) => theme.colors.player.color};
    }
  }

  .song {
    max-width: 160px;
    white-space: nowrap;

    & > div {
      text-overflow: ellipsis;
      overflow: hidden;
    }

    .artist {
      font-size: 0.75rem;
      color: ${({ theme }) => theme.colors.album.artist.listItem};
    }
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

function Player({ previous, next }: IPlayerProps) {
  const { paused, playingSong, playingSongIndex } = useContext(DatasContext);
  const { setPaused, setPlayingSongIndex } = useContext(DataMutatorsContext);

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
    if (progression >= duration) {
      setPaused!(true);
      setProgression(0);
    }
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
      <div className="control">
        <div className="control__left">
          <StyledCover>
            {playingSong?.cover ? (
              <img src={playingSong?.cover?.toString()} alt="" />
            ) : (
              <IoMusicalNotesOutline />
            )}
          </StyledCover>
          <div className="song">
            <div className="title">
              {playingSong?.title ? playingSong?.title.toString() : "Unknown"}
            </div>
            <div className="artist">
              {playingSong?.artist ? playingSong?.artist.toString() : "Unknown"}
            </div>
          </div>
        </div>
        <div className="buttons">
          <button
            onClick={() => {
              setPlayingSongIndex!(playingSongIndex - 1);
            }}
            disabled={!previous}
            title={previous ? "" : "No previous song"}
          >
            <TbPlayerTrackPrevFilled />
          </button>
          <button
            onClick={() => {
              setPaused!(!paused);
            }}
          >
            {paused ? <TbPlayerPlayFilled /> : <TbPlayerPauseFilled />}
          </button>
          <button
            onClick={() => {
              setPlayingSongIndex!(playingSongIndex + 1);
            }}
            disabled={!next}
            title={next ? "" : "Reached end of the queue"}
          >
            <TbPlayerTrackNextFilled />
          </button>
        </div>
        <div className="control__right">
          <div className="time">
            <span className="elapsed">
              {durationToString(progression, false)} /{" "}
            </span>
            <span className="total">{durationToString(duration, false)}</span>
          </div>
          <button className="volume">
            <BsFillVolumeUpFill />
          </button>
          <button className="repeat">
            <BsRepeat />
          </button>
        </div>
      </div>
    </StyledContainer>
  );
}

export default Player;
