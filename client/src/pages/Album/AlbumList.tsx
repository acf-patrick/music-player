import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import styled from "styled-components";
import { Album } from "../../utils/models";
import { getAlbums, getImageUri } from "../../utils/providers";

const StyledContainer = styled.div`
  background: ${({ theme }) => theme.colors.background};
  overflow-x: auto;

  h1 {
    margin: 1rem 1.5rem 2rem;
    color: ${({ theme }) => theme.colors.album.page.artist};
  }

  .list {
    margin: 0 1.5rem;
    overflow-x: auto;

    &::-webkit-scrollbar {
      display: none;
    }

    & > div {
      display: flex;
      gap: 1.5rem;
    }
  }
`;

const AlbumCard = styled.div<{ cover?: string }>`
  display: flex;
  flex-direction: column;
  align-items: center;
  max-width: 115px;
  cursor: pointer;

  .inner-circle {
    display: ${({ cover }) => (cover ? "none" : "block")};
    width: 95%;
    aspect-ratio: 1;
    position: absolute;
    background: blue;
  }

  .cover {
    position: relative;
    width: 100px;
    aspect-ratio: 1;
    border: 1px solid black;
    border-radius: 100%;
    background: ${({ cover }) => (cover ? `url(${cover})` : "black")};
    background-size: cover;

    &::after,
    &::before {
      content: "";
      position: absolute;
      left: 50%;
      top: 50%;
      transform: translate(-50%, -50%);
      border-radius: 100%;
      aspect-ratio: 1;
    }

    &::before {
      display: ${({ cover }) => (cover ? "none" : "block")};
      width: 98%;
      border: 1px solid grey;
    }

    &::after {
      display: block;
      width: 13px;
      background: ${({ theme }) => theme.colors.background};
    }
  }

  .name {
    color: ${({ theme }) => theme.colors.album.page.name};
    text-align: center;
    font-size: 0.825rem;
  }
`;

export default function AlbumList({ artists }: { artists?: string[] }) {
  const navigate = useNavigate();

  const [albums, setAlbums] = useState<Album[]>([]);
  useEffect(() => {
    const fetchAlbums = async (artists: string[] | undefined) => {
      if (!artists) return [];

      try {
        const albums = await getAlbums(artists);
        for (let album of albums) {
          if (album.cover) {
            const uri = await getImageUri(album.cover);
            album.cover = uri;
          }
        }

        return albums;
      } catch (err) {
        console.error(err);
      }

      return [];
    };

    fetchAlbums(artists).then((albums) => {
      setAlbums((list) => {
        if (list.length) return list;
        return [...albums];
      });
    });
  }, [artists]);

  const albumOnClick = (name: string) => {
    navigate(`/album`, {
      state: {
        name: name,
      },
    });
  };

  return (
    <StyledContainer>
      <h1>{artists?.join(" & ")}</h1>
      <div className="list">
        <div>
          {albums.map((album, i) => (
            <AlbumCard
              cover={album.cover}
              onClick={() => albumOnClick(album.title)}
              key={i}
            >
              <div className="cover"></div>
              <p className="name">{album.title}</p>
            </AlbumCard>
          ))}
        </div>
      </div>
    </StyledContainer>
  );
}
