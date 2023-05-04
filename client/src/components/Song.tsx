import { useState, useEffect } from "react";
import styled from "styled-components";
import { Song as Audio } from "../utils/models";
import { IoMusicalNotesOutline } from "react-icons/io5";
import { StyledCover } from "../styles";
import { durationToString, createDataUri } from "../utils";
import { useImage } from "../utils/hook";

const StyledContainer = styled.div`
  display: flex;

  .datas {
    display: flex;
    flex-direction: column;
    flex-grow: 1;
    position: relative;
    padding-left: 1rem;
  }

  .title {
    font-weight: bold;
    font-size: 1rem;
    color: ${({ theme }) => theme.colors.song.title};
  }

  .artist,
  .album,
  .duration {
    font-size: 0.75rem;
  }

  .duration {
    position: absolute;
    bottom: 5px;
    right: 5px;
  }
`;

function Song({ datas }: { datas: Audio }) {
  const cover = useImage(datas.cover ? datas.cover : "");

  return (
    <StyledContainer>
      <StyledCover>
        {cover ? <img src={`${cover}`} alt="" /> : <IoMusicalNotesOutline />}
      </StyledCover>
      <div className="datas">
        <div className="title">{datas.title ? datas.title : "Unknown"}</div>
        <div className="artist">{datas.artist ? datas.artist : "Unknown"}</div>
        <div className="album">{datas.album ? datas.album : "Unknown"}</div>
        <div className="duration">{durationToString(datas.duration!)}</div>
      </div>
    </StyledContainer>
  );
}

export default Song;
