import { IPopupProps } from "../utils/models";
import { StyledPopup } from "../styles";

// Renders a context menu on the bottom right position of the direct relative container
function Popup({ options, optionOnClick, separators, inverted }: IPopupProps) {
  return (
    <StyledPopup inverted={inverted!}>
      {options.map((option, i) => (
        <div key={i}>
          <div
            className="option"
            onClick={() => {
              if (optionOnClick) {
                const obj = optionOnClick.find((obj) => obj.index === i);
                if (obj) {
                  obj.callback(option);
                }
              }
            }}
          >
            {option}
          </div>
          {separators &&
            separators.indexOf(i) >= 0 &&
            i < options.length - 1 && <div className="separator"></div>}
        </div>
      ))}
    </StyledPopup>
  );
}

export default Popup;
