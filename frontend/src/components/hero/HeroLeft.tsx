"use client";

import "./HeroLeft.css";
import Link from "next/link";
export default function HeroLeft() {
  return (
    <div className="hero-left">

      {/* AI Badge */}

      <div className="hero-badge">

        <span className="hero-badge-dot"></span>

        AI DIGITAL TWIN NETWORK

      </div>

      {/* Main Title */}

      <h1 className="hero-title">

        CATVERSE <span>X</span>

      </h1>

      {/* Subtitle */}

      <h2 className="hero-subtitle">

        AI-Powered Digital Twin
        <br />

        Rescue Intelligence Platform

      </h2>

      {/* Description */}

      <p className="hero-description">

        Connecting cats, shelters, rescuers and communities
        through intelligent Digital Twins, predictive AI,
        real-time rescue missions and next-generation analytics.

      </p>

      {/* Buttons */}

      <div className="hero-buttons">

  <button className="launch-btn">
    Launch Command Center
  </button>

  <Link href="/cats" className="explore-btn">
    Explore Platform
  </Link>

</div>

      {/* Live Status */}

      <div className="system-status">

        <div className="status-item">

          <span className="status-number">

            ONLINE

          </span>

          <span className="status-label">

            Neural Network

          </span>

        </div>

        <div className="status-divider"></div>

        <div className="status-item">

          <span className="status-number">

            READY

          </span>

          <span className="status-label">

            AI Oracle

          </span>

        </div>

      </div>

    </div>
  );
}