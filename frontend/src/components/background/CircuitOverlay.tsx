"use client";

import "./CircuitOverlay.css";

export default function CircuitOverlay() {
  return (
    <div className="circuit-overlay">

      {/* Horizontal */}

      <div className="line h1" />
      <div className="line h2" />
      <div className="line h3" />

      {/* Vertical */}

      <div className="line v1" />
      <div className="line v2" />
      <div className="line v3" />

      {/* Nodes */}

      <span className="node n1" />
      <span className="node n2" />
      <span className="node n3" />
      <span className="node n4" />
      <span className="node n5" />
      <span className="node n6" />

    </div>
  );
}