"use client";

import { useState } from "react";

import "./CatsPage.css";

import SearchBar from "./SearchBar";
import FilterBar from "./FilterBar";
import CatGrid from "./CatGrid";

export default function CatsPage() {

  const [search, setSearch] = useState("");

  const [filter, setFilter] = useState("All");

  return (

    <main className="cats-page">

      <div className="cats-header">

        <span className="cats-tag">
          DIGITAL TWIN DATABASE
        </span>

        <h1>
          CAT
          <span> REGISTRY</span>
        </h1>

        <p>
          Explore every registered digital twin,
          monitor health, rescue status,
          AI predictions and adoption readiness.
        </p>

      </div>

      <SearchBar
        search={search}
        setSearch={setSearch}
      />

      <FilterBar
        filter={filter}
        setFilter={setFilter}
      />

      <CatGrid
        search={search}
        filter={filter}
      />

    </main>

  );

}