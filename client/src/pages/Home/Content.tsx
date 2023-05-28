import { useContext } from "react";
import { DataMutatorsContext, DatasContext } from "../../utils";
import { CiSearch } from "react-icons/ci";
import { StyledHomeContent } from "../../styles";
import { Queue, Player, PlayButton } from "../../components";
import { useImage, useQueue } from "../../utils/hook";

function Content() {
  const { playingSong, paused } = useContext(DatasContext);
  const { setPlayingSongIndex, setPaused } = useContext(DataMutatorsContext);

  const queue = useQueue();

  const coverId = playingSong?.cover ? playingSong?.cover : "";
  const cover = useImage(coverId);

  const playButtonOnClick = () => {
    if (playingSong) setPaused!(!paused);
    else if (queue) {
      if (queue.length) {
        setPlayingSongIndex!(0);
        setPaused!(false);
      }
    }
  };

  return (
    <StyledHomeContent headerBg={cover}>
      <div className="header">
        <div className="texts">
          <h1>Library</h1>
          <p>
            {queue.length} song{queue.length > 1 ? "s" : ""}
          </p>
        </div>
        <div className="play-button">
          <PlayButton
            paused={paused ? true : false}
            onClick={playButtonOnClick}
          />
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
        <Queue songs={queue} />
        {playingSong ? <Player /> : <></>}
      </div>
    </StyledHomeContent>
  );
}

export default Content;
