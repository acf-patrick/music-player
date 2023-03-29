import { useState, useContext, useEffect } from "react";
import styled from "styled-components";
import { HiMagnifyingGlass } from "react-icons/hi2";
import { TiArrowSortedDown } from "react-icons/ti";
import { AudioListContext } from "../../utils";
import { StyledForm } from "../../styles";
import { Song } from "../../components";
import { Audio } from "../../utils/models";

const StyledContainer = styled.div`
  display: flex;
  flex-direction: column;
  padding: ${({ theme }) => theme.spacings.padding};
  overflow-y: auto;

  * {
    font-size: 1.125rem;
  }

  ul {
    list-style: none;
    padding: 0;
  }

  li {
    margin: 0.5rem 0;
  }
`;

function Overview() {
  const audios = useContext(AudioListContext);
  const [results, setResults] = useState<Audio[]>([...audios]);
  const [optionsFolded, setOptionsFolded] = useState(true);
  const fields = ["Artist", "Genre", "Playlist", "Album"] as const;
  const [currentField, setCurrentField] = useState(0);

  const selectOnClick = () => {
    setOptionsFolded(!optionsFolded);
  };

  const optionOnClick = (index: number) => {
    setCurrentField(index);
    setOptionsFolded(true);
  };

  const formOnSubmit = () => {};

  return (
    <StyledContainer>
      <StyledForm onSubmit={formOnSubmit}>
        <div className="select" onClick={selectOnClick}>
          <TiArrowSortedDown />
          <div>{fields[currentField]}</div>
        </div>
        {!optionsFolded && (
          <div className="options">
            {fields.map((field, i) => (
              <div
                key={i}
                onClick={() => {
                  optionOnClick(i);
                }}
              >
                {field}
              </div>
            ))}
          </div>
        )}
        <div className="field">
          <input type="text" />
          <button type="submit">
            <HiMagnifyingGlass />
          </button>
        </div>
      </StyledForm>
      <ul className="results">
        {results.map((song, i) => (
          <li key={i}>
            <Song datas={song} />
          </li>
        ))}
      </ul>
    </StyledContainer>
  );
}

export default Overview;
