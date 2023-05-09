import { useState } from "react";
import { HiMagnifyingGlass } from "react-icons/hi2";
import { TiArrowSortedDown } from "react-icons/ti";
import { StyledForm } from "../styles";

interface SearchbarProps {
  inputOnEdit: React.ChangeEventHandler<HTMLInputElement>;
  currentField: String;
  fields: String[];
  optionOnClick: (i: number) => void;
}

function Searchbar({
  inputOnEdit,
  currentField,
  fields,
  optionOnClick,
}: SearchbarProps) {
  const [optionsFolded, setOptionsFolded] = useState(true);

  const selectOnClick = () => {
    setOptionsFolded((optionsFolded) => !optionsFolded);
  };

  return (
    <StyledForm
      arrowDown={optionsFolded}
      onSubmit={(e) => {
        e.preventDefault();
      }}
    >
      <div className="select" onClick={selectOnClick}>
        <TiArrowSortedDown />
        <div>{currentField}</div>
      </div>
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
      <div className="field">
        <input type="text" name="keyword" onChange={inputOnEdit} />
        <button type="submit">
          <HiMagnifyingGlass />
        </button>
      </div>
    </StyledForm>
  );
}

export default Searchbar;
