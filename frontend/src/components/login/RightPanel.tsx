"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

import "./RightPanel.css";

import { login } from "../../../lib/api";

import { FcGoogle } from "react-icons/fc";
import { FaGithub, FaDiscord } from "react-icons/fa";

export default function RightPanel() {

  const router = useRouter();

  const [email, setEmail] = useState("");

  const [password, setPassword] = useState("");

  const [loading, setLoading] = useState(false);

  const [error, setError] = useState("");

  async function handleLogin(
    e: React.FormEvent
  ) {
    console.log("🚀 Login button clicked");

    e.preventDefault();

    setLoading(true);

    setError("");

    try {

      const data = await login(
        email,
        password
      );

      localStorage.setItem(
    "token",
    data.access_token
);

      localStorage.setItem(
        "guardian_name",
        data.guardian
      );

      localStorage.setItem(
        "guardian_level",
        String(data.level)
      );

      router.push("/dashboard");

    }

    catch (err: any) {

      setError(
        err.message
      );

    }

    finally {

      setLoading(false);

    }

  }

  return (

    <section className="right-panel">

      <div className="login-card">

        <div className="login-top">

          <span className="login-badge">

            AI MISSION AUTHORIZATION

          </span>

          <h1>

            Welcome

            <br />

            <span>

              Guardian

            </span>

          </h1>

          <p>

            Access the CATVERSE Rescue Network
            and continue today's mission.

          </p>

        </div>

        <form
          className="login-form"
          onSubmit={handleLogin}
        >

          <div className="input-group">

            <label>

              Guardian Email

            </label>

            <input

              type="email"

              placeholder="guardian@catverse.ai"

              value={email}

              onChange={(e) =>
                setEmail(e.target.value)
              }

              required

            />

          </div>

          <div className="input-group">

            <label>

              Access Key

            </label>

            <input

              type="password"

              placeholder="••••••••••••"

              value={password}

              onChange={(e) =>
                setPassword(e.target.value)
              }

              required

            />

          </div>

          {

            error && (

              <p
                style={{
                  color:"#ff4fd8",
                  fontSize:"14px"
                }}
              >

                {error}

              </p>

            )

          }

          <div className="login-options">

            <label className="remember">

              <input type="checkbox"/>

              Remember this device

            </label>

            <a href="#">

              Forgot Key?

            </a>

          </div>

          <button

            type="submit"

            className="login-button"

            disabled={loading}

          >

            {

              loading

              ?

              "Connecting..."

              :

              "🚀 START RESCUE"

            }

          </button>
                  </form>

        <div className="separator">

          <span>

            OR CONNECT WITH

          </span>

        </div>

        <div className="social-grid">

          <button title="Google">

            <FcGoogle size={28} />

          </button>

          <button title="Discord">

            <FaDiscord size={26} />

          </button>

          <button title="GitHub">

            <FaGithub size={26} />

          </button>

        </div>

        <div className="guardian-level">

          <div>

            <span>

              Guardian Rank

            </span>

            <h2>

              LEVEL 12

            </h2>

          </div>

          <div className="rank-icon">

            🛡️

          </div>

        </div>

        <div className="register-box">

          <p>

            New to CATVERSE?

          </p>

          <button
            type="button"
            className="register-button"
          >

            Create Guardian Account

          </button>

        </div>

      </div>

    </section>

  );

}