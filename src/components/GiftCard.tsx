"use client";

import { useState, useRef } from "react";
import Image from "next/image";
import { Gift } from "@/lib/gifts";

interface GiftCardProps {
  gift: Gift;
  index: number;
  onClaim: (id: string, name: string) => void;
  onUnclaim: (id: string) => void;
}

export default function GiftCard({ gift, index, onClaim, onUnclaim }: GiftCardProps) {
  const [inputError, setInputError] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);

  const handleClaim = () => {
    const name = inputRef.current?.value.trim();
    if (!name) {
      setInputError(true);
      setTimeout(() => setInputError(false), 2000);
      return;
    }
    onClaim(gift.id, name);
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === "Enter") handleClaim();
  };

  return (
    <div
      className={`gift-card ${gift.claimedBy ? "claimed" : ""}`}
      style={{ animationDelay: `${index * 0.1}s` }}
    >
      <div className="gift-image-wrapper">
        <Image
          src={gift.image}
          alt={gift.name}
          fill
          sizes="(max-width: 768px) 100vw, 400px"
          style={{ objectFit: "cover" }}
          priority={index < 3}
        />
        <span className={`gift-badge ${gift.claimedBy ? "taken" : "available"}`}>
          {gift.claimedBy ? "✓ Réservé" : "♡ Disponible"}
        </span>
      </div>

      <div className="gift-info">
        <div className="gift-name">{gift.name}</div>

        {gift.claimedBy ? (
          <div className="claimed-by">
            <div className="avatar">{gift.claimedBy.charAt(0).toUpperCase()}</div>
            <div className="claim-text">
              Réservé par <strong>{gift.claimedBy}</strong>
            </div>
            <button className="unclaim-btn" onClick={() => onUnclaim(gift.id)}>
              ✕
            </button>
          </div>
        ) : (
          <div className="gift-claim-form">
            <input
              ref={inputRef}
              type="text"
              placeholder="Entre ton nom..."
              maxLength={30}
              className={inputError ? "error" : ""}
              onKeyPress={handleKeyPress}
            />
            <button className="claim-btn" onClick={handleClaim}>
              Réserver 🎁
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
