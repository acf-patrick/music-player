import { useState, useEffect } from "react";
import { getImageData, getImageUri } from "../../utils/providers";
import { useAlbum } from "../../utils/hook";
import { useParams } from "react-router-dom";
import AlbumList from "./AlbumList";
import SongList from "./SongList";
import styled, { keyframes } from "styled-components";
import { createColorPalette } from "../../utils";

const slideRight = keyframes`
  from {
    bottom: 50%;
    transform: translate(0, 50%) rotate(180deg);
  } to {
    bottom: 0;
    transform: translateX(50%) rotate(360deg);
  }
`;

const StyledContainer = styled.div`
  width: 100%;
  height: 100%;
  display: grid;
  grid-template-columns: 1fr 1fr;

  .overview {
    display: grid;
    grid-template-rows: 54% 46%;
  }
`;

const StyledAlbumCover = styled.div<{
  colors: string[];
  bg: string;
  show: boolean;
}>`
  background: linear-gradient(to top, ${({ colors }) => colors.join(", ")});
  display: grid;
  place-items: center;

  .cover {
    width: 270px;
    aspect-ratio: 1;
    position: relative;
    display: ${({ show }) => (show ? "block" : "none")};
  }

  .square,
  .circle {
    background: ${({ bg }) => `url(${bg})`};
    background-size: cover;
  }

  .square {
    width: 100%;
    height: 100%;
    position: relative;
    z-index: 2;
    box-shadow: 1px 0 3px black;

    // 3D shadow
    &::after {
      content: "";
      display: block;
      width: 100%;
      height: 16px;
      position: absolute;
      left: 0;
      bottom: -32px;
      border-radius: 100%;
      filter: blur(5px);
      background: linear-gradient(to right, transparent, black, transparent);
      // box-shadow: 0 0 15px black inset;
    }
  }

  .circle {
    width: 216px;
    aspect-ratio: 1;
    position: absolute;
    right: 0;
    border-radius: 100%;
    border: 1px solid black;
    animation: ${slideRight} 1s 1s both ease-out;

    .inner {
      z-index: 100;
      position: absolute;
      left: 50%;
      top: 50%;
      transform: translate(-50%, -50%);
      width: 27px;
      border-radius: 100%;
      aspect-ratio: 1;
      background: black;
    }
  }
`;

export default function Album() {
  // VGVybWluYWwgUmVkdXg=
  const { name } = useParams();
  const [colors, setColors] = useState<string[]>([]);
  const [uri, setUri] = useState("");
  const album = useAlbum(atob(name!));

  useEffect(() => {
    if (album) {
      if (album.cover) {
        // Create data URI from album cover data
        getImageUri(album.cover)
          .then((uri) => setUri(uri))
          .catch((err) => console.error(err));

        // Extract colors from album cover
        getImageData(album.cover)
          .then((data) => {
            createColorPalette(data)
              .then((palette) => {
                const len = palette.length;
                console.log(palette);
                const colors = [
                  { r: 0, g: 0, b: 0 },
                  { r: 0, g: 0, b: 0 },
                ];

                for (let i = 0; i < len / 2; ++i) {
                  colors[1].r += palette[i].r;
                  colors[1].g += palette[i].g;
                  colors[1].b += palette[i].b;
                }
                for (let i = len - 2; i < len; ++i) {
                  colors[0].r += palette[i].r;
                  colors[0].g += palette[i].g;
                  colors[0].b += palette[i].b;
                }

                for (let i = 0; i < 2; ++i) {
                  colors[i].r /= len / 2;
                  colors[i].g /= len / 2;
                  colors[i].b /= len / 2;
                }

                setColors(
                  colors.map(
                    (color) => `rgb(${color.r}, ${color.g}, ${color.b})`
                  )
                );
              })
              .catch((err) => console.error(err));
          })
          .catch((err) => console.error(err));
      }
    }
  }, [album]);

  return (
    <StyledContainer>
      <div className="overview">
        <StyledAlbumCover
          colors={colors}
          bg={uri}
          show={colors.length > 0 && uri.length > 0}
        >
          <div className="cover">
            <div className="square"></div>
            <div className="circle">
              <span className="inner"></span>
            </div>
          </div>
        </StyledAlbumCover>
        <AlbumList artists={album?.artists} />
      </div>
      <SongList />
    </StyledContainer>
  );
}
