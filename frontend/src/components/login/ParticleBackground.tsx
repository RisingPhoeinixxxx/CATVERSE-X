
"use client";
import "./ParticleBackground.css";
import { useEffect, useState } from "react";

type Particle = {
  id: number;
  left: number;
  top: number;
  size: number;
  delay: number;
  duration: number;
};

export default function ParticleBackground() {

  const [particles, setParticles] = useState<Particle[]>([]);

  useEffect(() => {

    const list: Particle[] = [];

    for (let i = 0; i < 70; i++) {

      list.push({
        id: i,
        left: Math.random() * 100,
        top: Math.random() * 100,
        size: 2 + Math.random() * 6,
        delay: Math.random() * 6,
        duration: 5 + Math.random() * 6,
      });

    }

    setParticles(list);

  }, []);

  return (

    <div className="particle-layer">

      {particles.map((p) => (

        <span
          key={p.id}
          className="particle"
          style={{
            left: `${p.left}%`,
            top: `${p.top}%`,
            width: p.size,
            height: p.size,
            animationDelay: `${p.delay}s`,
            animationDuration: `${p.duration}s`,
          }}
        />

      ))}

    </div>

  );

}