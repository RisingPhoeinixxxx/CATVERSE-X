"use client";

import { useEffect, useState } from "react";

import "./Scene1.css";

type Scene1Props = {
  onComplete: () => void;
};

const messages = [
  "Year 2048...",
  "Artificial Intelligence transformed the world.",
  "Humanity built intelligent cities.",
  "But someone...",
  "was forgotten."
];

export default function Scene1({
  onComplete,
}: Scene1Props) {

  const [index, setIndex] = useState(0);

  useEffect(() => {

    if (index >= messages.length) {

      const timer = setTimeout(() => {

        onComplete();

      }, 2000);

      return () => clearTimeout(timer);

    }

    const timer = setTimeout(() => {

      setIndex((previous) => previous + 1);

    }, 2500);

    return () => clearTimeout(timer);

  }, [index, onComplete]);

  return (

    <section className="scene1">

      <div className="scene1-overlay" />

      <div className="scene1-content">

        {messages.slice(0, index).map((message, i) => (

          <p
            key={i}
            className="scene1-line"
          >
            {message}
          </p>

        ))}

      </div>

    </section>

  );

}