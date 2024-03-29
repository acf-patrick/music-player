import { useMemo, useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Album as IAlbum } from "../utils/models";
import { AlbumAppearance } from "../utils/types";
import { IoAlbums } from "react-icons/io5";
import styled from "styled-components";
import { durationToString, createDataUri } from "../utils";
import { useImage } from "../utils/hook";

const StyledWithThumbnail = styled.div`
  display: flex;
  align-items: center;
  gap: 0.75rem;

  & > div:nth-of-type(2) {
    flex-grow: 1;
  }

  .artist-duration {
    display: flex;
    justify-content: space-between;
  }

  .duration {
    color: rgba(100, 100, 100, 0.75);
  }

  .cover {
    display: grid;
    background: black;
    place-items: center;
    width: ${({ theme }) => theme.sizes.image.sm};
    aspect-ratio: 1;
  }

  .artist {
    font-size: 0.75rem;
    color: ${({ theme }) => theme.colors.album.artist.listItem};
  }

  svg {
    font-size: 1.5rem;
    color: white;
  }

  img {
    max-width: ${({ theme }) => theme.sizes.image.sm};
    aspect-ratio: 1;
  }
`;

const StyledGridCell = styled.div`
  height: 100%;
  padding: 0.25rem;
  isolation: isolate;

  .cover {
    position: relative;
    display: flex;
    min-width: 134px;
    aspect-ratio: 1;
    background: black;

    &::after,
    &::before {
      display: block;
      content: "";
      position: absolute;
      left: 50%;
      top: 50%;
      transform: translate(-50%, -50%);
      aspect-ratio: 1;
      border-radius: 100%;
    }

    &::after {
      width: 15%;
      border: 10px solid ${({ theme }) => theme.colors.album.cover};
    }

    &::before {
      width: 45%;
      border: 5px solid ${({ theme }) => theme.colors.album.cover};
    }
  }

  .duration {
    display: none;
  }

  .name,
  .artist {
    overflow: hidden;
    white-space: nowrap;
    text-overflow: ellipsis;
  }

  .name {
    font-size: 0.75rem;
    font-weight: bold;
    color: ${({ theme }) => theme.colors.albumName};
  }

  .artist {
    color: ${({ theme }) => theme.colors.album.artist.gridCell};
  }

  img {
    flex-grow: 1;
    object-fit: cover;
    aspect-ratio: 1;
    z-index: 1;
  }
`;

function Album({
  appearance,
  title,
  artists,
  cover: coverId,
  duration,
}: IAlbum) {
  const navigate = useNavigate();
  const cover = useImage(coverId ? coverId : "");

  const handleOnClick = () => {
    navigate(`/album`, { state: { name: title } });
  };

  const containers = [StyledGridCell, StyledWithThumbnail] as const;
  let Container: (typeof containers)[number] | null = null;
  switch (appearance) {
    case AlbumAppearance.GridCell:
      Container = StyledGridCell;
      break;
    case AlbumAppearance.WithThumbnail:
      Container = StyledWithThumbnail;
      break;
    default:
      Container = StyledWithThumbnail;
      break;
  }

  return (
    <Container onClick={handleOnClick}>
      <div className="cover">
        {cover ? (
          <img src={`${cover}`} alt="" />
        ) : appearance === AlbumAppearance.GridCell ? (
          <></>
        ) : (
          <IoAlbums />
        )}
      </div>
      <div>
        <div className="name">{title}</div>
        <div className="artist-duration">
          <div className="artist">{artists?.join(", ")}</div>
          <div className="duration">{durationToString(duration!)}</div>
        </div>
      </div>
    </Container>
  );
}

export default Album;
