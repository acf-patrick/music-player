import { useMemo, useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { AlbumAppearance, Album as IAlbum } from "../utils/models";
import { IoAlbums } from "react-icons/io5";
import styled from "styled-components";
import { durationToString, createDataUri } from "../utils";

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

  .duration {
    display: none;
  }

  .name {
    font-size: 0.75rem;
    font-weight: bold;
    color: ${({ theme }) => theme.colors.albumName};
    overflow: hidden;
    white-space: nowrap;
    text-overflow: ellipsis;
  }

  .artist {
    color: ${({ theme }) => theme.colors.album.artist.gridCell};
  }

  img {
    width: 100%;
    aspect-ratio: 1;
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

  const [cover, setCover] = useState("");
  useEffect(() => {
    if (coverId)
      fetch(`/api/image/${coverId}`)
        .then((res) => res.json())
        .then(
          (data: {
            id: string;
            mime_type: string;
            data: { type: string; data: number[] };
          }) => {
            setCover(createDataUri(data.mime_type, data.data.data));
          }
        )
        .catch((error) => {
          console.error(error);
        });
  }, [coverId]);

  const artist = useMemo(() => {
    let artist = "";
    if (artists) {
      for (let i = 0; i < artists.length; ++i) {
        artist += artists[i];
        if (i) artist += ", ";
      }
      return artist;
    } else return "";
  }, [artists]);

  const handleOnClick = () => {
    navigate(`/album/${btoa(title)}`);
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
        {cover ? <img src={`${cover}`} alt="" /> : <IoAlbums />}
      </div>
      <div>
        <div className="name">{title}</div>
        <div className="artist-duration">
          <div className="artist">{artist}</div>
          <div className="duration">{durationToString(duration!)}</div>
        </div>
      </div>
    </Container>
  );
}

export default Album;
