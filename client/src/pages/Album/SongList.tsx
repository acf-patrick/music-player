import { BiArrowBack } from "react-icons/bi";
import styled from "styled-components";

const StyledContainer = styled.div`
  .header {
    display: flex;
    justify-content: space-between;
    padding: 0.5rem 2rem;
  }
`;

const StyledLines = styled.div`
  width: 42px;
  height: 16px;
  display: flex;
  flex-direction: column;
  justify-content: space-between;

  div {
    background: black;
  }

  &::after, &::before {
    display: block;
    content: "";
    width: 40%;
  }

  div, &::after, &::before {
    background: black;
    height: 2px;
  }
`;

export default function SongList() {
  return (
    <StyledContainer>
      <div className="header">
        <button className="back">
          <BiArrowBack />
          <span>Back</span>
        </button>
        <StyledLines>
          <div></div>
        </StyledLines>
      </div>
    </StyledContainer>
  );
}
