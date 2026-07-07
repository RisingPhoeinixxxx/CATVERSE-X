"use client";

import { useState } from "react";
import "./ReportCat.css";

export default function AIAnalysis() {

  const [analyzing, setAnalyzing] = useState(false);

  const [result, setResult] = useState<any>(null);

  async function runAnalysis() {

    setAnalyzing(true);

    // Temporary Demo
    // Later this will call FastAPI + Kuro

    setTimeout(() => {

      setResult({

        catDetected: true,

        confidence: "99.2%",

        breed: "Indian Domestic Short Hair",

        health: "Healthy",

        priority: "Medium",

        aiSummary:
          "The uploaded images appear to contain a healthy stray cat. No visible major injuries detected. Recommend scheduling a community rescue and health check."

      });

      setAnalyzing(false);

    }, 2500);

  }

  return (

    <div className="report-card">

      <div className="card-header">

        <h2>🤖 AI Rescue Analysis</h2>

        <p>

          Kuro AI will analyze uploaded cat images.

        </p>

      </div>

      {

        !result && (

          <button

            className="submit-report"

            onClick={runAnalysis}

            disabled={analyzing}

          >

            {

              analyzing

              ? "Analyzing..."

              : "Run AI Analysis"

            }

          </button>

        )

      }

      {

        result && (

          <div className="ai-results">

            <div className="ai-item">

              <strong>🐱 Cat Detected</strong>

              <span>

                {result.catDetected ? "Yes" : "No"}

              </span>

            </div>

            <div className="ai-item">

              <strong>🎯 Confidence</strong>

              <span>

                {result.confidence}

              </span>

            </div>

            <div className="ai-item">

              <strong>🐾 Breed</strong>

              <span>

                {result.breed}

              </span>

            </div>

            <div className="ai-item">

              <strong>❤️ Health</strong>

              <span>

                {result.health}

              </span>

            </div>

            <div className="ai-item">

              <strong>🚨 Priority</strong>

              <span>

                {result.priority}

              </span>

            </div>

            <div className="ai-summary">

              <h3>

                AI Summary

              </h3>

              <p>

                {result.aiSummary}

              </p>

            </div>

          </div>

        )

      }

    </div>

  );

}