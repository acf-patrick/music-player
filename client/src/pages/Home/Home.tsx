import styled from "styled-components";
import Content from "./Content";
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
      <Content />
    </StyledContainer>
  );
}

export default Home;
