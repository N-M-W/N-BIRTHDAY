"use client";

import { useEffect, useRef } from "react";

export default function FloatingDecorations() {
  const heartsRef = useRef<HTMLDivElement>(null);
  const heroRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    // Create floating hearts
    const container = heartsRef.current;
    if (!container) return;

    const symbols = ["♡", "✿", "♥", "❀", "✧", "🎀", "💖"];

    for (let i = 0; i < 20; i++) {
      const heart = document.createElement("div");
      heart.className = "heart";
      heart.textContent = symbols[Math.floor(Math.random() * symbols.length)];
      heart.style.left = `${Math.random() * 100}%`;
      heart.style.animationDuration = `${Math.random() * 10 + 10}s`;
      heart.style.animationDelay = `${Math.random() * 15}s`;
      heart.style.fontSize = `${Math.random() * 16 + 12}px`;
      container.appendChild(heart);
    }

    // Create sparkles in hero
    const hero = document.querySelector(".hero");
    if (hero) {
      for (let i = 0; i < 25; i++) {
        const sparkle = document.createElement("div");
        sparkle.className = "sparkle";
        sparkle.style.left = `${Math.random() * 100}%`;
        sparkle.style.top = `${Math.random() * 100}%`;
        sparkle.style.animationDelay = `${Math.random() * 3}s`;
        sparkle.style.animationDuration = `${Math.random() * 2 + 1.5}s`;
        hero.appendChild(sparkle);
      }
    }

    return () => {
      if (container) container.innerHTML = "";
    };
  }, []);

  return (
    <>
      {/* Background Pattern */}
      <div className="bg-pattern" />
      {/* Floating Hearts */}
      <div className="floating-hearts" ref={heartsRef} />
    </>
  );
}
