import styled from "styled-components";
import { IPopupProps } from "../utils/models";

const StyledContainer = styled.div`
	display: flex;
	flex-direction: column;
	position: absolute;
`;

function Popup({ options, separators }: IPopupProps) {
  return (
    <StyledContainer>
      {options.map(([option, callback], i) => (
        <div
          key={i}
          onClick={() => {
            callback(option);
          }}
        >
          {option}
        </div>
      ))}
    </StyledContainer>
  );
}

export default Popup;
