import { useRef } from "react";
import { HiMagnifyingGlass } from "react-icons/hi2";
import { TiArrowSortedDown } from "react-icons/ti";
import { StyledForm } from "../styles";

interface ISearchbarProps {
  optionsFolded: boolean;
  inputOnEdit: React.ChangeEventHandler<HTMLInputElement>;
  selectOnClick: () => void;
  currentField: String;
  fields: String[];
  optionOnClick: (i: number) => void;
}

function Searchbar({
  optionsFolded,
  inputOnEdit,
  selectOnClick,
  currentField,
  fields,
  optionOnClick,
}: ISearchbarProps) {
  return (
    <StyledForm
      arrowDown={optionsFolded}
      onSubmit={(e) => {
        e.preventDefault;
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
