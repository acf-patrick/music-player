import { IPopupProps } from "../utils/models";
import { StyledPopup } from "../styles";
import { useRef, useState, useEffect, useMemo } from "react";

// Renders a context menu on the bottom right position of the direct relative container
function Popup({ options, optionOnClick, separators }: IPopupProps) {
  const containerRef = useRef<HTMLDivElement | null>(null);
  const position = useMemo(() => {
    const container = containerRef.current;
    if (container) {
      let [v, h] = ["bottom", "right"];
      const rect = container.getBoundingClientRect();
      if (rect.x + rect.width > window.innerWidth) v = "left";
      if (rect.y + rect.height > window.innerHeight) h = "top";
      return [v, h];
    }

    return ["bottom", "right"];
  }, [containerRef]);

  return (
    <StyledPopup position={["bottom", "right"]} ref={containerRef}>
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
