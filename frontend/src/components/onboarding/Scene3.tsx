"use client";

import { useEffect, useState } from "react";

import "./Scene3.css";

type Scene3Props = {
  onComplete: () => void;
};

const alerts = [
  "⚠ AI EMERGENCY BROADCAST",
  "247 Rescue Alerts Detected",
  "42 Shelters Offline",
  "Thousands of Cats Need Immediate Help",
  "Searching For Guardian...",
  "Guardian Signal Detected."
];

export default function Scene3({
  onComplete,
}: Scene3Props) {

  const [current, setCurrent] = useState(0);

  useEffect(() => {

    if (current >= alerts.length) {

      const timer = setTimeout(() => {

        onComplete();

      }, 2500);

      return () => clearTimeout(timer);

    }

    const timer = setTimeout(() => {

      setCurrent((previous) => previous + 1);

    }, 2000);

    return () => clearTimeout(timer);

  }, [current, onComplete]);

  return (

    <section className="scene3">

      <div className="warning-overlay"/>

      <div className="scan-line"/>

      <div className="scene3-content">

        {alerts.slice(0, current).map((message, index) => (

          <p
            key={index}
            className={
              index === 0
                ? "warning-title"
                : "warning-line"
            }
          >
            {message}
          </p>

        ))}

      </div>

    </section>

  );

}