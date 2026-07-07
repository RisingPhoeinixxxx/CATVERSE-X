"use client";

import { useState } from "react";
import "./ReportCat.css";
import { submitReport } from "@/lib/report";

export default function ReportForm() {

  const [catName, setCatName] = useState("");
  const [status, setStatus] = useState("Stray");
  const [health, setHealth] = useState("Healthy");
  const [priority, setPriority] = useState("Medium");
  const [description, setDescription] = useState("");

  async function submitReportHandler(
    e: React.FormEvent
  ) {

    e.preventDefault();

    try {

      await submitReport({

    cat_name: catName,

    status,

    health,

    priority,

    description,

    latitude: 12.9716,
    longitude: 77.5946,

});

      alert("✅ Rescue Report Submitted!");

      setCatName("");
      setStatus("Stray");
      setHealth("Healthy");
      setPriority("Medium");
      setDescription("");

    } catch (error) {

      console.error(error);

      alert("❌ Submission Failed");

    }

  }

  return (

    <form
      className="report-card"
      onSubmit={submitReportHandler}
    >

      <div className="card-header">

        <h2>📝 Rescue Report</h2>

        <p>
          Complete the rescue information.
        </p>

      </div>

      <div className="form-group">

        <label>Cat Name (Optional)</label>

        <input
          type="text"
          value={catName}
          onChange={(e) => setCatName(e.target.value)}
          placeholder="Example: Luna"
        />

      </div>

      <div className="form-group">

        <label>Rescue Status</label>

        <select
          value={status}
          onChange={(e) => setStatus(e.target.value)}
        >

          <option>Stray</option>
          <option>Lost</option>
          <option>Injured</option>
          <option>Abandoned</option>
          <option>Needs Medical Help</option>

        </select>

      </div>

      <div className="form-group">

        <label>Health Condition</label>

        <select
          value={health}
          onChange={(e) => setHealth(e.target.value)}
        >

          <option>Healthy</option>
          <option>Minor Injury</option>
          <option>Critical</option>
          <option>Unknown</option>

        </select>

      </div>

      <div className="form-group">

        <label>Rescue Priority</label>

        <select
          value={priority}
          onChange={(e) => setPriority(e.target.value)}
        >

          <option>Low</option>
          <option>Medium</option>
          <option>High</option>
          <option>Emergency</option>

        </select>

      </div>

      <div className="form-group">

        <label>Description</label>

        <textarea
          rows={6}
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          placeholder="Describe the cat, surroundings, injuries, behaviour..."
        />

      </div>

      <button
        type="submit"
        className="submit-report"
      >
        🚀 Submit Rescue Report
      </button>

    </form>

  );

}