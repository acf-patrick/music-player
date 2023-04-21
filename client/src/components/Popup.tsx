import { IPopupProps } from "../utils/models";
import { StyledPopup, StyledPopupOption } from "../styles";
import { useRef, useMemo, useEffect, useState } from "react";

// Renders a context menu on the bottom right position of the direct relative container
function Popup({ options, separators }: IPopupProps) {
  const containerRef = useRef<HTMLUListElement | null>(null);

  const [position, setPosition] = useState(["bottom", "right"]);
  useEffect(() => {
    const container = containerRef.current;
    if (container) {
      container.focus();
      let [v, h] = [...position];
      const rect = container.getBoundingClientRect();
      if (rect.right > window.innerWidth) h = "left";
      if (rect.y > window.innerHeight * 0.65) v = "top";
      setPosition([v, h]);
    }
  }, [containerRef]);

  return (
    <StyledPopup position={position} ref={containerRef}>
      {options.map((option, i) => (
        <li key={i}>
          <StyledPopupOption
            className="option"
            override={
              typeof option === "string"
                ? {}
                : option.styles
                ? option.styles
                : {}
            }
            onClick={() => {
              if (typeof option !== "string") {
                const optionOnClick = option.callback;
                if (optionOnClick) optionOnClick();
              }
            }}
          >
            {typeof option === "string" ? option : option.text}
          </StyledPopupOption>
          {separators &&
            separators.indexOf(i) >= 0 &&
            i < options.length - 1 && <div className="separator"></div>}
        </li>
      ))}
    </StyledPopup>
  );
}

export default Popup;
