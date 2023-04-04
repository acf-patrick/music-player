import styled from "styled-components";

const StyledAppContainer = styled.div`
  width: 100vw;
  height: 100vh;
  min-width: ${({ theme }) => theme.sizes.minWidth};
  min-height: ${({ theme }) => theme.sizes.minHeight};
  background: ${({ theme }) => theme.colors.background};
  margin: auto;
  color: ${({ theme }) => theme.colors.text};
  position: relative;
  overflow-y: auto;
`;

export default StyledAppContainer;
