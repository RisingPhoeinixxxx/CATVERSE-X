"use client";

import "./GuardianChoice.css";

import { useRouter } from "next/navigation";

export default function GuardianChoice() {

  const router = useRouter();

  return (

    <section className="guardian-choice">

      <div className="guardian-overlay"/>

      <div className="guardian-card">

        <p className="guardian-small">

          DIGITAL TWIN ONLINE

        </p>

        <h1>

          Will You Become
          <br />
          <span>The Guardian</span>

        </h1>

        <p className="guardian-description">

          Luna has searched across every network.

          Thousands of cats are still waiting.

          Your decision will determine their future.

        </p>

        <div className="guardian-buttons">

          <button
            className="register-btn"
            onClick={() => router.push("/register")}
          >
            🛡 Become a Guardian
          </button>

          <button
            className="login-btn"
            onClick={() => router.push("/login")}
          >
            🔑 Continue My Mission
          </button>

        </div>

      </div>

    </section>

  );

}