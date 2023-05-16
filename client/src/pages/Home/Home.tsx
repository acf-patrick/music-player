import styled from "styled-components";
import Content from "./Content";
import { Outlet } from "react-router-dom";
import { useQueue } from "../../utils/hook";

const StyledContainer = styled.div`
  width: 100%;
  height: 100%;
  display: grid;
  grid-template-columns: 1fr 1fr;
`;

function Home() {
  return (
    <StyledContainer>
      <Outlet />
      <Content />
    </StyledContainer>
  );
}

export default Home;
