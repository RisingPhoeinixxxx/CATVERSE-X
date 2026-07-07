"use client";

import "./ReportCat.css";

import ImageUploader from "./ImageUploader";
import LocationPicker from "./LocationPicker";
import ReportForm from "./ReportForm";
import AIAnalysis from "./AIAnalysis";

export default function ReportCat() {
  return (
    <main className="report-page">

      <div className="report-container">

        <div className="report-header">

          <span className="report-badge">
            🐱 LIVE CAT RESCUE
          </span>

          <h1>
            Report a Cat
          </h1>

          <p>
            Help CATVERSE protect every cat.
            Upload photos, share the location,
            and our AI will assist in creating
            a rescue mission.
          </p>

        </div>

        <div className="report-grid">

          <div className="left-column">

            <ImageUploader />

            <LocationPicker />

          </div>

          <div className="right-column">

            <ReportForm />

            <AIAnalysis />

          </div>

        </div>

      </div>

    </main>
  );
}