import { useState, useEffect, Dispatch, SetStateAction } from "react";
import { useNavigate } from "react-router-dom";
import { Popup, Searchbar } from "../../../components";
import { MdSort } from "react-icons/md";
import {
  AiOutlineSortAscending,
  AiOutlineSortDescending,
} from "react-icons/ai";

interface HeaderProps {
  field: string;
  sortOptions?: string[];
  sortOptionOnUpdate?: (
    sortDirection: "ascending" | "descending",
    sortBy: string
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
  const fields = ["Song", "Artist", "Genre", "Album", "Playlist"];
  const routes = ["/", "artists", "genres", "albums", "playlists"];

  const navigate = useNavigate();

  const [sortPopupShown, setSortPopupShown] = useState(false);
  const [sortBy, setSortBy] = useState<string | null>(null);
  const [sortDirection, setSortDirection] = useState<
    "ascending" | "descending"
  >("ascending");

  useEffect(() => {
    if (sortOptionOnUpdate && sortBy) sortOptionOnUpdate(sortDirection, sortBy);
  }, [sortBy, sortDirection]);

  return (
    <>
      <Searchbar
        currentField={field}
        fields={fields}
        inputOnEdit={(e) => {
          e.preventDefault();
          searchInputOnEdit(e.target.value);
        }}
        optionOnClick={(i) => {
          if (field !== fields[i]) {
            navigate(routes[i]);
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
              {sortBy && (
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
                              console.log(option);
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
