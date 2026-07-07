"use client";

import { useEffect, useState } from "react";

import "./Synchronize.css";

type SynchronizeProps = {
  onComplete?: () => void;
};

const steps = [
  "Scanning Guardian Identity...",
  "Authenticating Neural Signature...",
  "Loading Previous Rescue Records...",
  "Synchronizing Digital Twin...",
  "Connecting to CATVERSE Network...",
  "Synchronization Complete."
];

export default function Synchronize({
  onComplete,
}: SynchronizeProps) {

  const [currentStep, setCurrentStep] = useState(0);

  useEffect(() => {

    if (currentStep >= steps.length) {

      const timer = setTimeout(() => {

        if (onComplete) {

          onComplete();

        }

      }, 1500);

      return () => clearTimeout(timer);

    }

    const timer = setTimeout(() => {

      setCurrentStep((previous) => previous + 1);

    }, 1800);

    return () => clearTimeout(timer);

  }, [currentStep, onComplete]);

  return (

    <section className="sync-screen">

      <div className="sync-circle" />

      <div className="sync-card">

        <h1>Guardian Synchronization</h1>

        <div className="sync-list">

          {steps.slice(0, currentStep).map((step, index) => (

            <div
              key={index}
              className="sync-item"
            >

              <span>✔</span>

              <p>{step}</p>

            </div>

          ))}

        </div>

      </div>

    </section>

  );

}