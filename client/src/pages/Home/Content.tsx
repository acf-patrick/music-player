import { useContext, useEffect, useState } from "react";
import { CiSearch } from "react-icons/ci";
import { StyledHomeContent } from "../../styles";
import { Queue, Player, PlayButton } from "../../components";
import { useImage } from "../../utils/hook";
import { AppContext } from "../../context";
import { getAudioCount } from "../../utils/providers";

function Content() {
  const { state, dispatch } = useContext(AppContext);
  const [totalSongs, setTotalSongs] = useState(0);

  useEffect(() => {
    getAudioCount()
      .then((count) => setTotalSongs(count))
      .catch((err) => {
        console.error(err);
      });
  }, []);

  // state.playingSong.metadatas
  const playingSong = state.playingSong.metadatas;

  const coverId = playingSong?.cover ? playingSong?.cover : "";
  const cover = useImage(coverId);

  const playButtonOnClick = () => {
    if (state.paused)
      dispatch({ type: "play", song: { source: "queue", index: 0 } });
    else dispatch({ type: "pause" });
  };

  return (
    <StyledHomeContent headerBg={cover}>
      <div className="header">
        <div className="texts">
          <h1>Library</h1>
          <p>
            {totalSongs} song{totalSongs > 1 ? "s" : ""}
          </p>
        </div>
        <div className="play-button">
          <PlayButton paused={state.paused} onClick={playButtonOnClick} />
        </div>
      </div>
      <div className="inner">
        <div className="searchbar">
          <div className="input">
            <input type="text" placeholder="Search" />
            <span>
              <CiSearch />
            </span>
          </div>
          <div>
            By <span>Title</span>
          </div>
        </div>
        <Queue songs={state.queue} />
        {playingSong ? <Player /> : <></>}
      </div>
    </StyledHomeContent>
  );
}

export default Content;
