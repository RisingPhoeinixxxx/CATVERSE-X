"use client";

import "./FilterBar.css";

type Props = {
  filter: string;
  setFilter: React.Dispatch<React.SetStateAction<string>>;
};

const filters = [
  "All",
  "Safe",
  "Missing",
  "Rescue",
  "Adopted",
  "Critical",
];

export default function FilterBar({
  filter,
  setFilter,
}: Props) {

  return (

    <div className="filter-bar">

      {filters.map((item) => (

        <button
          key={item}
          className="filter-btn"
          onClick={() => setFilter(item)}
          style={{
            background: filter === item ? "#ff4fd8" : "",
            color: filter === item ? "#fff" : "",
          }}
        >
          {item}
        </button>

      ))}

    </div>

  );

}