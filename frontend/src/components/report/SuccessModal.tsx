"use client";

import "./ReportCat.css";

interface SuccessModalProps {

  open: boolean;

  onClose: () => void;

}

export default function SuccessModal({

  open,

  onClose

}: SuccessModalProps) {

  if (!open) return null;

  return (

    <div className="modal-overlay">

      <div className="success-modal">

        <div className="success-icon">

          🐱

        </div>

        <h2>

          Rescue Report Submitted!

        </h2>

        <p>

          Thank you, Guardian.

          <br />

          Your rescue report has been safely
          transmitted to the CATVERSE Network.

        </p>

        <div className="success-info">

          <div>

            🤖 AI Analysis

            <span>

              Queued

            </span>

          </div>

          <div>

            📍 Mission Status

            <span>

              Pending Assignment

            </span>

          </div>

          <div>

            🚑 Nearby Guardians

            <span>

              Being Notified

            </span>

          </div>

        </div>

        <button

          className="submit-report"

          onClick={onClose}

        >

          Continue

        </button>

      </div>

    </div>

  );

}