import styled from "styled-components";

const StyledAppContainer = styled.div`
  width: 100vw;
  height: 100vh;
  max-width: 1280px;
  max-height: 720px;
  background: ${({ theme }) => theme.colors.background};
  margin: auto;
  color: ${({ theme }) => theme.colors.text};
`;

export default StyledAppContainer;
