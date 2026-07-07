"use client";

import "./Navbar.css";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useEffect, useState } from "react";

const menu = [
  { name: "HOME", path: "/dashboard" },
  { name: "REPORT", path: "/report" },
  { name: "CATS", path: "/cats" },
  { name: "MISSIONS", path: "/missions" },
  { name: "MAP", path: "/map" },
  { name: "SHELTERS", path: "/shelters" },
  { name: "ADOPTIONS", path: "/adoptions" },
  { name: "ANALYTICS", path: "/analytics" },

  { name: "ABOUT", path: "/about" },
];

export default function Navbar() {

  const pathname = usePathname();
  const router = useRouter();

  const [loggedIn, setLoggedIn] = useState(false);
  const [guardianName, setGuardianName] = useState("Guardian");
  const [guardianLevel, setGuardianLevel] = useState("1");

  useEffect(() => {

    const token = localStorage.getItem("token");

    if (token) {

      setLoggedIn(true);

      setGuardianName(
        localStorage.getItem("guardian_name") || "Guardian"
      );

      setGuardianLevel(
        localStorage.getItem("guardian_level") || "1"
      );

    }

  }, []);

  function logout() {

    localStorage.removeItem("token");
    localStorage.removeItem("guardian_name");
    localStorage.removeItem("guardian_level");

    router.push("/login");

  }

  return (

    <header className="navbar">

      <div className="navbar-container">

        {/* Logo */}

        <Link
          href="/dashboard"
          className="logo-area"
        >

          <div className="logo-circle">

            🐱

          </div>

          <div>

            <h1 className="logo-title">

              CATVERSE <span>X</span>

            </h1>

            <p className="logo-subtitle">

              NO CAT LEFT UNSEEN

            </p>

          </div>

        </Link>

        {/* Navigation */}

        <nav className="nav-links">

          {menu.map((item) => (

            <Link
              key={item.name}
              href={item.path}
              className={
                pathname === item.path
                  ? "active-link"
                  : ""
              }
            >
              {item.name}
            </Link>

          ))}

        </nav>

        {/* Right */}

        {

          loggedIn ? (

            <div className="guardian-profile">

              <div className="guardian-info">

                <span className="guardian-text">

                  Guardian

                </span>

                <h4>

                  {guardianName}

                </h4>

                <small>

                  LEVEL {guardianLevel}

                </small>

              </div>

              <button
                className="logout-button"
                onClick={logout}
              >

                Logout

              </button>

            </div>

          ) : (

            <Link
              href="/login"
              className="login-button"
            >

              Login / Register

            </Link>

          )

        }

      </div>

    </header>

  );

}