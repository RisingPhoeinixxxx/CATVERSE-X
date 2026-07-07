
"use client";
import "./LeftPanel.css";
import Typewriter from "./Typewriter";

export default function LeftPanel() {
  return (
    <section className="left-panel">

      {/* Top Navigation */}

      <div className="top-bar">

        <button className="back-btn">

          ← Back

        </button>

        <div className="ai-status">

          <span className="status-dot"></span>

          AI ONLINE

        </div>

      </div>

      {/* Hero */}

      <div className="hero">

        <p className="hero-tag">

          CATVERSE X

        </p>

        <h1>

          Become

          <br />

          A Guardian

        </h1>

        <p className="hero-desc">

          Every rescue begins with one decision.

          Join the AI Rescue Network and help

          protect every cat that needs a home.

        </p>

      </div>

      {/* Robot Cat */}

      <div className="cat-area">

        <img
          src="/images/login/catbot.png"
          alt="Robot Cat"
          className="robot-cat"
        />

      </div>

      {/* Dialogue */}

      <div className="dialog-card">

        <div className="dialog-header">

          🤖 AI Companion

        </div>

        <Typewriter />

      </div>

      {/* Mission Card */}

      <div className="mission-card">

        <div className="mission-top">

          <span>

            TODAY'S MISSION

          </span>

          <strong>

            82%

          </strong>

        </div>

        <div className="progress">

          <div className="progress-fill"></div>

        </div>

        <div className="mission-bottom">

          <div>

            <h2>

              247

            </h2>

            <p>

              Rescue Alerts

            </p>

          </div>

          <div>

            <h2>

              12,548

            </h2>

            <p>

              Cats Saved

            </p>

          </div>

          <div>

            <h2>

              96%

            </h2>

            <p>

              Success Rate

            </p>

          </div>

        </div>

      </div>

    </section>
  );
}