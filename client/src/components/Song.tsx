import styled from "styled-components";
import { Audio } from "../utils/models";

const StyledContainer = styled.div`
    img {
        max-width: 64px;
    }
`;

function Song({ datas }: { datas: Audio }) {
  return (
    <StyledContainer>
      <div className="picture">
        <img src={`${datas.cover}`} alt="" />
      </div>
      <div>{datas.duration}</div>
    </StyledContainer>
  );
}

export default Song;
