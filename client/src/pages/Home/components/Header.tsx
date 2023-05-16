import { useState, useEffect, Dispatch, SetStateAction } from "react";
import { useNavigate } from "react-router-dom";
import { Popup, Searchbar } from "../../../components";
import { MdSort } from "react-icons/md";
import {
  AiOutlineSortAscending,
  AiOutlineSortDescending,
} from "react-icons/ai";
import { fields } from "../../../router";

interface HeaderProps {
  field: string;
  sortOptions?: string[];
  sortOptionOnUpdate?: (
    sortDirection: "ascending" | "descending",
    sortBy?: string
  ) => void;
  searchInputOnEdit: (value: string) => void;
  count: number;
}

export default function Header({
  field,
  sortOptions,
  sortOptionOnUpdate,
  searchInputOnEdit,
  count,
}: HeaderProps) {
  const navigate = useNavigate();

  const [sortPopupShown, setSortPopupShown] = useState(false);
  const [sortBy, setSortBy] = useState<string | null>(null);
  const [sortDirection, setSortDirection] = useState<
    "ascending" | "descending"
  >("ascending");

  useEffect(() => {
    if (sortOptionOnUpdate)
      sortOptionOnUpdate(sortDirection, sortBy ? sortBy : undefined);
  }, [sortBy, sortDirection]);

  return (
    <>
      <Searchbar
        currentField={field}
        fields={fields.map((field) => field.name)}
        inputOnEdit={(e) => {
          e.preventDefault();
          searchInputOnEdit(e.target.value);
        }}
        optionOnClick={(i) => {
          if (field !== fields[i].name) {
            navigate(fields[i].path);
          }
        }}
      />
      {count ? (
        <>
          <div className="sort-container">
            <div
              className="buttons"
              onMouseLeave={() => setSortPopupShown(false)}
            >
              {(sortOptions ? sortBy : true) && (
                <button
                  className="sort-direction"
                  title={sortDirection}
                  onClick={() =>
                    setSortDirection((sortDirection) =>
                      sortDirection === "ascending" ? "descending" : "ascending"
                    )
                  }
                >
                  {sortDirection === "ascending" ? (
                    <AiOutlineSortAscending />
                  ) : (
                    <AiOutlineSortDescending />
                  )}
                </button>
              )}
              {sortOptions && (
                <button
                  className="sort-by"
                  onClick={() =>
                    setSortPopupShown((sortPopupShown) => !sortPopupShown)
                  }
                >
                  <MdSort />
                </button>
              )}
              {sortPopupShown && (
                <Popup
                  options={
                    sortOptions
                      ? sortOptions.map((option, i) => {
                          return {
                            text: option,
                            callback: () => {
                              setSortBy(option);
                              setSortPopupShown(false);
                            },
                          };
                        })
                      : []
                  }
                />
              )}
            </div>
            <div className="count">
              <span>{count}</span>
              {`result${count > 1 ? "s" : ""}`}
            </div>
          </div>
        </>
      ) : (
        <></>
      )}
    </>
  );
}
