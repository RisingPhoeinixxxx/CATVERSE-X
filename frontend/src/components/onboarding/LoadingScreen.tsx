"use client";

import { useEffect, useState } from "react";

import { useRouter } from "next/navigation";

import "./LoadingScreen.css";

const loadingSteps = [
  "Initializing CATVERSE Core...",
  "Loading Rescue Intelligence...",
  "Connecting to AI Oracle...",
  "Synchronizing Digital Twin...",
  "Loading Guardian Profile...",
  "Restoring Previous Missions...",
  "Preparing Rescue Network...",
  "Launching Command Center..."
];

export default function LoadingScreen() {

  const router = useRouter();

  const [currentStep, setCurrentStep] = useState(0);

  const [progress, setProgress] = useState(0);

  useEffect(() => {

    const interval = setInterval(() => {

      setProgress((previous) => {

        if (previous >= 100) {

          clearInterval(interval);

          setTimeout(() => {

            router.replace("/dashboard");

          }, 1200);

          return 100;

        }

        return previous + 2;

      });

    }, 90);

    return () => clearInterval(interval);

  }, [router]);

  useEffect(() => {

    if (currentStep >= loadingSteps.length - 1) {

      return;

    }

    const timer = setTimeout(() => {

      setCurrentStep((previous) => previous + 1);

    }, 1000);

    return () => clearTimeout(timer);

  }, [currentStep]);

  return (

    <section className="loading-screen">

      <div className="loading-card">

        <h1>

          CATVERSE X

        </h1>

        <p className="loading-subtitle">

          Guardian Command Center

        </p>

        <div className="loading-progress">

          <div
            className="loading-bar"
            style={{
              width: `${progress}%`
            }}
          />

        </div>

        <p className="loading-percent">

          {progress}%

        </p>

        <div className="loading-log">

          {loadingSteps
            .slice(0, currentStep + 1)
            .map((step, index) => (

              <p
                key={index}
                className="loading-line"
              >
                ✔ {step}
              </p>

            ))}

        </div>

      </div>

    </section>

  );

}