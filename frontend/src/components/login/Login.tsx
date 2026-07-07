"use client";

import "./Login.css";
import LeftPanel from "./LeftPanel";
import RightPanel from "./RightPanel";
import ParticleBackground from "./ParticleBackground";

export default function Login() {
  return (
    <main className="login-page">

      <ParticleBackground />

      <div className="login-container">

        <LeftPanel />

        <RightPanel />

      </div>

    </main>
  );
}