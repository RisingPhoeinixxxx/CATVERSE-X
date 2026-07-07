"use client";

import { useEffect, useState } from "react";

import "./Scene2.css";

type Scene2Props = {
  onComplete: () => void;
};

const dialogue = [
  "Hello...",
  "My name is Luna.",
  "I am the last Digital Twin.",
  "I have searched across every network...",
  "Waiting for someone...",
  "...like you."
];

export default function Scene2({
  onComplete,
}: Scene2Props) {

  const [currentLine, setCurrentLine] = useState(0);

  useEffect(() => {

    if (currentLine >= dialogue.length) {

      const timer = setTimeout(() => {

        onComplete();

      }, 2500);

      return () => clearTimeout(timer);

    }

    const timer = setTimeout(() => {

      setCurrentLine((previous) => previous + 1);

    }, 2500);

    return () => clearTimeout(timer);

  }, [currentLine, onComplete]);

  return (

    <section className="scene2">

      <div className="scene2-background"/>

      <div className="scene2-container">

        <div className="luna-glow">

          <img
            src="/images/hero/cyber-cat.png"
            alt="Luna"
            className="luna-image"
          />

        </div>

        <div className="dialogue-box">

          {dialogue.slice(0, currentLine).map((text, index) => (

            <p
              key={index}
              className="dialogue-line"
            >
              {text}
            </p>

          ))}

        </div>

      </div>

    </section>

  );

}