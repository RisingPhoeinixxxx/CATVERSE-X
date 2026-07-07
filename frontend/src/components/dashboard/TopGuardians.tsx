"use client";

import "./TopGuardians.css";

const guardians = [
  {
    name: "Aarav",
    rescued: 52,
    rank: "#1",
  },
  {
    name: "Meera",
    rescued: 47,
    rank: "#2",
  },
  {
    name: "Rahul",
    rescued: 39,
    rank: "#3",
  },
  {
    name: "Sara",
    rescued: 31,
    rank: "#4",
  },
];

export default function TopGuardians() {
  return (
    <div className="guardian-card">

      <div className="guardian-header">

        <h3>TOP GUARDIANS</h3>

        <span>THIS WEEK</span>

      </div>

      <div className="guardian-list">

        {guardians.map((guardian) => (

          <div className="guardian-item" key={guardian.rank}>

            <div className="guardian-left">

              <div className="guardian-avatar">

                🐾

              </div>

              <div>

                <h4>{guardian.name}</h4>

                <p>{guardian.rescued} rescues</p>

              </div>

            </div>

            <div className="guardian-rank">

              {guardian.rank}

            </div>

          </div>

        ))}

      </div>

    </div>
  );
}