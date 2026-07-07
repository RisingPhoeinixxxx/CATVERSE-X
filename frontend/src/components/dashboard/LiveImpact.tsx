"use client";

import "./LiveImpact.css";

export default function LiveImpact() {
  return (
    <div className="impact-card">

      <div className="impact-header">

        <span className="impact-title">
          LIVE IMPACT
        </span>

        <span className="impact-status">
          ● LIVE
        </span>

      </div>

      <div className="impact-grid">

        <div className="impact-box">
          <h2>248</h2>
          <p>Cats Protected</p>
        </div>

        <div className="impact-box">
          <h2>34</h2>
          <p>Rescue Missions</p>
        </div>

        <div className="impact-box">
          <h2>97%</h2>
          <p>AI Accuracy</p>
        </div>

        <div className="impact-box">
          <h2>19</h2>
          <p>Active Guardians</p>
        </div>

      </div>

    </div>
  );
}