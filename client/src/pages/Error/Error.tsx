import styled from "styled-components";

const StyledError = styled.div`
  width: 100%;
  height: 100%;
  display: grid;
  place-items: center;
  color: black;
`;

function Error() {
  return (
    <StyledError>
      <h1>Page not Found</h1>
    </StyledError>
  );
}

export default Error;
