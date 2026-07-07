
"use client";
import "./Typewriter.css";
import { useEffect, useState } from "react";

const messages = [

  "I've been waiting for you, Guardian.",

  "247 rescue alerts detected.",

  "Every life matters.",

  "Ready to begin today's mission?",

  "No Cat Left Unseen."

];

export default function Typewriter() {

  const [text, setText] = useState("");

  const [index, setIndex] = useState(0);

  const [char, setChar] = useState(0);

  useEffect(() => {

    if (char < messages[index].length) {

      const timeout = setTimeout(() => {

        setText(messages[index].slice(0, char + 1));

        setChar(char + 1);

      }, 45);

      return () => clearTimeout(timeout);

    }

    const pause = setTimeout(() => {

      setText("");

      setChar(0);

      setIndex((index + 1) % messages.length);

    }, 2200);

    return () => clearTimeout(pause);

  }, [char, index]);

  return (

    <div className="typewriter">

      <span>{text}</span>

      <span className="cursor">|</span>

    </div>

  );

}