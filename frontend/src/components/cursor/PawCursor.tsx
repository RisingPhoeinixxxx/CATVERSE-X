"use client";

import { useEffect, useState } from "react";
import "./PawCursor.css";

export default function PawCursor() {
  const [position, setPosition] = useState({ x: 0, y: 0 });

  useEffect(() => {
    const moveCursor = (e: MouseEvent) => {
      setPosition({
        x: e.clientX,
        y: e.clientY,
      });
    };

    window.addEventListener("mousemove", moveCursor);

    return () => {
      window.removeEventListener("mousemove", moveCursor);
    };
  }, []);

  return (
  <div
    style={{
      position: "fixed",
      left: position.x,
      top: position.y,
      width: "30px",
      height: "30px",
      background: "red",
      borderRadius: "50%",
      zIndex: 999999,
      pointerEvents: "none",
      transform: "translate(-50%, -50%)",
    }}
  />
);
}