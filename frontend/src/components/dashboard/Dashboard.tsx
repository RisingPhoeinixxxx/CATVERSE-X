"use client";

import "./Dashboard.css";

import HudPanel from "../hud/HudPanel";
import LiveImpact from "./LiveImpact";
import MissionStatus from "./MissionStatus";
import TopGuardians from "./TopGuardians";

export default function Dashboard() {
  return (
    <div className="dashboard-wrapper">

      {/* Top Statistics */}
      <section className="dashboard-stats">

        <HudPanel
          title="Active Guardians"
          value="19"
          footer="+2 Today"
        />

        <HudPanel
          title="Cats Saved"
          value="248"
          footer="+7 Today"
        />

        <HudPanel
          title="Mission Success"
          value="97%"
          footer="Excellent"
        />

        <HudPanel
          title="AI Status"
          value="ONLINE"
          footer="All Systems Operational"
        />

      </section>

      {/* Dashboard Cards */}
      <section className="dashboard">

        <LiveImpact />

        <MissionStatus />

        <TopGuardians />

      </section>

    </div>
  );
}