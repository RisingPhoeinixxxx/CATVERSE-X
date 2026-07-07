"use client";

import "./MissionStatus.css";

const missions = [
  {
    id: "RX-104",
    place: "Cubbon Park",
    status: "In Progress",
    level: "Medium",
  },
  {
    id: "RX-212",
    place: "Whitefield",
    status: "Completed",
    level: "Low",
  },
  {
    id: "RX-317",
    place: "Koramangala",
    status: "Dispatched",
    level: "High",
  },
];

export default function MissionStatus() {
  return (
    <div className="mission-card">

      <div className="mission-header">

        <h3>MISSION STATUS</h3>

        <span>LIVE</span>

      </div>

      <div className="mission-list">

        {missions.map((mission) => (

          <div className="mission-item" key={mission.id}>

            <div>

              <h4>{mission.id}</h4>

              <p>{mission.place}</p>

            </div>

            <div className="mission-right">

              <small>{mission.status}</small>

              <span>{mission.level}</span>

            </div>

          </div>

        ))}

      </div>

    </div>
  );
}