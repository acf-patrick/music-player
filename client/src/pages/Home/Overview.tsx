import { useContext } from "react";
import styled from "styled-components";
import { HiMagnifyingGlass } from "react-icons/hi2";
import { AudioListContext } from "../../utils";

const StyledContainer = styled.div`
  display: flex;
  flex-direction: column;
  padding: ${({ theme }) => theme.spacings.padding};

  * {
    font-size: 1.125rem;
  }
`;

const StyledForm = styled.form`
  display: flex;
  justify-content: space-between;
  padding-bottom: 5px;
  border-bottom: 1px solid rgba(0, 0, 0, 0.2);

  .field {
    flex-grow: 1;
    display: flex;
  }

  select {
    background: transparent;
    outline: none;
    border: none;
  }
  
  input {
    background: transparent;
    border: none;
    outline: none;
    flex-grow: 1;
    padding-left: 1rem;
    font-size: 1rem;
    color: rgba(0, 0, 0, 0.75);
  }

  button {
    border: none;
    background: transparent;
  }

  svg {
    font-size: 1.5rem;
  }
`;

function Overview() {
  const audios = useContext(AudioListContext);

  return (
    <StyledContainer>
      <StyledForm>
        <select name="field" id="field">
          <option value="Artists">Artists</option>
          <option value="Genre">Genre</option>
          <option value="Playlist">Playlist</option>
        </select>
        <div className="field">
          <input type="text" />
          <button type="submit">
            <HiMagnifyingGlass />
          </button>
        </div>
      </StyledForm>
      <div></div>
    </StyledContainer>
  );
}

export default Overview;
