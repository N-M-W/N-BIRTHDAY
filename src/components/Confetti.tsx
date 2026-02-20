"use client";

import { useCallback } from "react";

export function useConfetti() {
  const launch = useCallback(() => {
    const container = document.getElementById("confetti-container");
    if (!container) return;

    const colors = [
      "#ec407a",
      "#f48fb1",
      "#ffd700",
      "#d5b8ff",
      "#f8bbd0",
      "#d4a574",
      "#ff80ab",
    ];
    const shapes = ["circle", "square"];

    for (let i = 0; i < 60; i++) {
      const piece = document.createElement("div");
      piece.className = "confetti-piece";
      const color = colors[Math.floor(Math.random() * colors.length)];
      const shape = shapes[Math.floor(Math.random() * shapes.length)];
      const size = Math.random() * 8 + 6;

      piece.style.cssText = `
        left: ${Math.random() * 100}%;
        top: -10px;
        width: ${size}px;
        height: ${size}px;
        background: ${color};
        border-radius: ${shape === "circle" ? "50%" : "2px"};
        animation-duration: ${Math.random() * 2 + 2}s;
        animation-delay: ${Math.random() * 0.5}s;
      `;

      container.appendChild(piece);
      setTimeout(() => piece.remove(), 4000);
    }
  }, []);

  return launch;
}

export default function ConfettiContainer() {
  return <div className="confetti-container" id="confetti-container" />;
}
