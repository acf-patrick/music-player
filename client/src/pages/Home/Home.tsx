import styled from "styled-components";
import Contents from "./Contents";
import Overview from "./Overview";
import { AudioListContext } from "../../utils";
import { useContext } from "react";

const StyledContainer = styled.div`
  width: 100%;
  height: 100%;
  display: grid;
  grid-template-columns: 1fr 1fr;
`;

function Home() {
  const audios = useContext(AudioListContext);

  return (
    <StyledContainer>
      <Overview />
      <Contents />
    </StyledContainer>
  );
}

export default Home;
