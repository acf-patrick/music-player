import { useContext, useEffect } from "react";
import { DataMutatorsContext, DatasContext } from "../../utils";
import { Song } from "../../utils/models";
import { CiSearch } from "react-icons/ci";
import { FaPause, FaPlay } from "react-icons/fa";
import { StyledHomeContent } from "../../styles";
import { Queue, Player } from "../../components";
import { useImage } from "../../utils/hook";

function Content({ songs }: { songs: Song[] }) {
  const { playingSong, paused, queue } = useContext(DatasContext);
  const { setPlayingSongIndex, setPaused, setQueue } =
    useContext(DataMutatorsContext);

  const coverId = playingSong?.cover ? playingSong?.cover : "";
  const cover = useImage(coverId);

  useEffect(() => {
    setQueue!(songs.map((song) => song.id));
  }, []);

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
            {songs.length} song{songs.length > 1 ? "s" : ""}
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
        <Queue songs={queue} />
        {playingSong ? <Player /> : <></>}
      </div>
    </StyledHomeContent>
  );
}

export default Content;
