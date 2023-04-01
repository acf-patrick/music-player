import styled from "styled-components";
import Contents from "./Contents";
import Overview from "./Overview";

const StyledContainer = styled.div`
  width: 100%;
  height: 100%;
  display: grid;
  grid-template-columns: 1fr 1fr;
`;

function Home() {
  return (
    <StyledContainer>
      <Overview />
      <Contents />
    </StyledContainer>
  );
}

export default Home;
