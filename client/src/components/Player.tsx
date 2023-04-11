import {
  BsFillVolumeUpFill,
  BsFillVolumeDownFill,
  BsRepeat,
  BsRepeat1,
  BsFillVolumeOffFill,
  BsFillVolumeMuteFill,
} from "react-icons/bs";
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
import { Howl, Howler } from "howler";

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

    .activated {
      color: ${({ theme }) => theme.colors.player.activated};
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
    &__right button {
      color: ${({ theme }) => theme.colors.player.color};
    }
  }

  .song {
    @media (max-width: 1428px) {
      max-width: 148px;
    }

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
    appearance: none;
    -webkit-appearance: none;
    margin: unset;
    background-image: ${({ theme }) =>
      `linear-gradient(${theme.colors.player.line}, ${theme.colors.player.line})`};
    background-size: 0 100%;
    background-repeat: no-repeat;

    &::-webkit-slider-thumb {
      -webkit-appearance: none;
      width: 8px;
      height: 8px;
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

    &::-moz-range-thumb {
      appearance: none;
      -webkit-appearance: none;
      width: 8px;
      height: 8px;
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
  const { paused, queue, playingSong, playingSongIndex } =
    useContext(DatasContext);
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

  // Currently playing Song
  const [song, setSong] = useState<Howl | null>(null);

  // infinitely : 1, no-repeat: 0, repeat once: 2
  enum Repeat {
    NO_REPEAT = 0,
    ONCE = 2,
    INFINITELY = 1,
  }
  const [repeat, setRepeat] = useState<Repeat>(0);

  const [volume, setVolume_] = useState(100 * Howler.volume());
  const [prevVolume, setPrevVolume] = useState(volume);
  const setVolume = (v: number) => {
    setPrevVolume(volume);
    setVolume_(v);
    Howler.volume(v / 100);
  };

  const VolumeIcon = useMemo(() => {
    if (volume === 0) return BsFillVolumeMuteFill;
    if (volume <= 25) return BsFillVolumeOffFill;
    if (25 < volume && volume <= 50) return BsFillVolumeDownFill;
    return BsFillVolumeUpFill;
  }, [volume]);

  const updateProgression = () => {
    if (!playerTimerHandle)
      playerTimerHandle = setInterval(() => {
        setProgression((progression) => progression + 1);
      }, 1000);
  };

  useEffect(() => {
    setProgression(0);

    if (playingSong) {
      Howler.unload();
      const song = new Howl({
        src: playingSong.source.toString(),
        autoplay: true,
        onload: (id) => {},
        onloaderror: (id, error) => {},
      });
      setSong(song);
      setPaused!(false);
    }
  }, [playingSong]);

  useEffect(() => {
    if (progression >= duration) {
      if (playingSongIndex < queue.length - 1) {
        setPlayingSongIndex!(playingSongIndex + 1);
      } else {
        setPaused!(true);
        setProgression(0);
      }
    }
  }, [progression]);

  useEffect(() => {
    if (paused) {
      clearInterval(playerTimerHandle);
      playerTimerHandle = 0;
      song?.pause();
    } else {
      updateProgression();
      song?.play();
    }
  }, [paused]);

  const sliderOnClick = (e: React.FormEvent<HTMLInputElement>) => {
    const input = e.target as HTMLInputElement;
    const progression = parseInt(input.value);
    setProgression(progression);
    song?.seek(progression);
  };

  const onMouseWheel = (delta: number) => {
    const offset = delta > 0 ? 1 : -1;
    song?.seek(progression + offset);
    setProgression(progression + offset);
  };

  const volumeOnClick = () => {
    if (volume === 0) setVolume(prevVolume);
    else setVolume(0);
  };

  const volumeOnMouseWheel = (e: React.WheelEvent<HTMLButtonElement>) => {
    const offset = e.deltaY < 0 ? 1 : -1;
    let v = volume + offset * 5;
    if (v < 0) v = 0;
    if (v > 100) v = 100;
    setVolume(v);
  };

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
              onInput={sliderOnClick}
              onWheel={(e) => onMouseWheel(e.deltaY)}
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
            disabled={playingSongIndex === 0}
            title={playingSongIndex > 0 ? "" : "No previous song"}
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
            disabled={playingSongIndex === queue.length - 1}
            title={
              playingSongIndex < queue.length - 1
                ? ""
                : "Reached end of the queue"
            }
          >
            <TbPlayerTrackNextFilled />
          </button>
        </div>
        <div className="control__right">
          <div className="time" onWheel={(e) => onMouseWheel(e.deltaY)}>
            <span className="elapsed">
              {durationToString(progression, false)} /{" "}
            </span>
            <span className="total">{durationToString(duration, false)}</span>
          </div>
          <button
            className="volume"
            title={`${volume ? volume : "Muted"}`}
            onClick={volumeOnClick}
            onWheel={volumeOnMouseWheel}
          >
            <VolumeIcon />
          </button>
          <button
            className={`repeat ${repeat != Repeat.NO_REPEAT && "activated"}`}
            onClick={() => {
              setRepeat((repeat + 1) % 3);
            }}
          >
            {repeat === Repeat.ONCE ? <BsRepeat1 /> : <BsRepeat />}
          </button>
        </div>
      </div>
    </StyledContainer>
  );
}

export default Player;
