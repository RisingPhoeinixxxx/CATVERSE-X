"use client";

import "./SearchBar.css";

type Props = {
  search: string;
  setSearch: React.Dispatch<React.SetStateAction<string>>;
};

export default function SearchBar({
  search,
  setSearch,
}: Props) {

  return (

    <div className="search-container">

      <div className="search-box">

        <span className="search-icon">
          🔍
        </span>

        <input
          type="text"
          placeholder="Search by Cat Name, ID, Location..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />

      </div>

    </div>

  );

}