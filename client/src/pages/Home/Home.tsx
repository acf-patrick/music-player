import styled from "styled-components";
import Content from "./Content";
import Overview from "./Overview";
import { useSongs } from "../../utils/hook";

const StyledContainer = styled.div`
  width: 100%;
  height: 100%;
  display: grid;
  grid-template-columns: 1fr 1fr;
`;

function Home() {
  const songs = useSongs();

  return (
    <StyledContainer>
      <Overview songs={songs} />
      <Content songs={songs} />
    </StyledContainer>
  );
}

export default Home;
