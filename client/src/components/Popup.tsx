import { RxMagnifyingGlass } from "react-icons/rx";
import { IPopupProps } from "../utils/types";
import { StyledPopup, StyledPopupOption } from "../styles";
import { useRef, useMemo, useEffect, useState } from "react";
import { IoIosArrowForward } from "react-icons/io";

// Renders a context menu on the bottom right position of the direct relative container
function Popup({ options, separators, searchbar }: IPopupProps) {
  const containerRef = useRef<HTMLDivElement | null>(null);

  const [searchResults, setSearchResults] = useState([...options]);

  const [childrenShown, setChildrenShown] = useState(
    options.map((option) => false)
  );

  const [position, setPosition] = useState(["bottom", "right"]);
  useEffect(() => {
    const container = containerRef.current;
    if (container) {
      container.focus();
      let [v, h] = position;
      const rect = container.getBoundingClientRect();
      if (rect.right > window.innerWidth) h = "left";
      if (rect.y > window.innerHeight * 0.65) v = "top";
      setPosition([v, h]);
    }
  }, [containerRef]);

  const searchbarOnChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value.toLowerCase();
    if (value) {
      const results = [] as typeof searchResults;
      for (const option of options)
        if (option.text.toLowerCase().indexOf(value) >= 0) results.push(option);
      setSearchResults(results);
    } else setSearchResults([...options]);
  };

  const optionOnHover = (index: number) => {
    setChildrenShown((childrenShown) => {
      childrenShown[index] = true;
      return [...childrenShown];
    });
  };

  const optionOnMouseLeave = (index: number) => {
    setChildrenShown((childrenShown) => {
      childrenShown[index] = false;
      return [...childrenShown];
    });
  };

  return (
    <StyledPopup
      position={position}
      fixedHeight={searchbar !== undefined}
      ref={containerRef}
    >
      {searchbar && (
        <div className="bar">
          <div>
            <RxMagnifyingGlass />
            <input
              type="text"
              placeholder={searchbar}
              onChange={searchbarOnChange}
            />
          </div>
        </div>
      )}
      <div className="list">
        <ul>
          {(searchbar ? searchResults : options).map((option, i) => (
            <li
              key={i}
              onMouseEnter={() => {
                if (option.options) optionOnHover(i);
              }}
              onMouseLeave={() => {
                if (option.options) optionOnMouseLeave(i);
              }}
            >
              <StyledPopupOption
                id="option"
                override={option.styles ? option.styles : {}}
                onClick={() => {
                  if (typeof option !== "string") {
                    const optionOnClick = option.callback;
                    if (optionOnClick) optionOnClick();
                  }
                }}
              >
                <span>{option.text}</span>
                {option.options ? <IoIosArrowForward /> : <></>}
              </StyledPopupOption>
              {option.options && childrenShown[i] ? (
                <Popup {...option.options} />
              ) : (
                <></>
              )}
              {separators &&
                separators.indexOf(i) >= 0 &&
                i < options.length - 1 && <div className="separator"></div>}
            </li>
          ))}
        </ul>
      </div>
    </StyledPopup>
  );
}

export default Popup;
