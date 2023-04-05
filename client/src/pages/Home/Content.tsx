import { useContext } from "react";
import { DatasContext } from "../../utils";
import { CiSearch } from "react-icons/ci";
import { FaPlay } from "react-icons/fa";
import { StyledHomeContent } from "../../styles";
import { Queue, Player } from "../../components";

function Content() {
  const { audios, playingSong, queue } = useContext(DatasContext);

  const playButtonOnClick = () => {};

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
            <FaPlay />
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
