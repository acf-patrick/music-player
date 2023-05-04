import { useState, useEffect } from "react";
import { getImageData, getImageUri, useAlbum } from "../../utils/hook";
import { useParams } from "react-router-dom";
import AlbumList from "./AlbumList";
import SongList from "./SongList";
import styled, { keyframes } from "styled-components";
import { createColorPalette, createDataUri } from "../../utils";

const slideRight = keyframes`
  from {
    transform: translate(0, -50%) rotate(180deg);
  } to {
    transform: translate(50%, -50%) rotate(360deg);   
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
  src: string;
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
    background: ${({ src }) => `url(${src})`};
    background-size: cover;
  }

  .square {
    width: 100%;
    height: 100%;
    position: relative;
    z-index: 2;
    box-shadow: 1px 0 3px black;
  }

  .circle {
    width: 216px;
    aspect-ratio: 1;
    position: absolute;
    top: 50%;
    right: 0;
    border-radius: 100%;
    border: 1px solid black;
    animation: ${slideRight} 1s both ease-out;

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
  // QmxhY2t3YXRlciBQYXJr
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
                setColors(
                  // [palette[len - 2], palette[len - 1]]
                  palette.map(
                    (color) =>
                      `#${color.r.toString(16)}${color.g.toString(
                        16
                      )}${color.b.toString(16)}`
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
        <StyledAlbumCover colors={colors} src={uri} show={uri.length > 0}>
          <div className="cover">
            <div className="square"></div>
            <div className="circle">
              <span className="inner"></span>
            </div>
          </div>
        </StyledAlbumCover>
        <AlbumList />
      </div>
      <SongList />
    </StyledContainer>
  );
}
