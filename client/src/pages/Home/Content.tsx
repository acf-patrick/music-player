import { useContext } from "react";
import { DataMutatorsContext, DatasContext } from "../../utils";
import { CiSearch } from "react-icons/ci";
import { FaPause, FaPlay } from "react-icons/fa";
import { StyledHomeContent } from "../../styles";
import { Queue, Player } from "../../components";

function Content() {
  const { audios, playingSong, paused, queue } = useContext(DatasContext);
  const { setPlayingSong, setPaused } = useContext(DataMutatorsContext);

  const playButtonOnClick = () => {
    if (playingSong) setPaused!(!paused);
    else if (queue) {
      if (queue.length) {
        setPlayingSong!(queue[0]);
        setPaused!(false);
      }
    }
  };

  return (
    <StyledHomeContent headerBg={playingSong?.cover?.toString()}>
      <div className="header">
        <div className="texts">
          <h1>Library</h1>
          <p>
            {audios.length} song{audios.length > 1 ? "s" : ""}
          </p>
        </div>
        <div className="play-button">
          <button onClick={playButtonOnClick}>
            {paused ? <FaPlay /> : <FaPause />}
          </button>
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
        <Queue songs={[...audios]} />
        {playingSong && <Player />}
      </div>
    </StyledHomeContent>
  );
}

export default Content;
