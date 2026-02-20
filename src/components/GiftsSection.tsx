"use client";

import { useState, useEffect, useCallback } from "react";
import { Gift, giftsData } from "@/lib/gifts";
import GiftCard from "./GiftCard";
import { useConfetti } from "./Confetti";
import { useToast } from "./Toast";

const POLL_INTERVAL = 5000; // Refresh every 5 seconds

export default function GiftsSection() {
  const [gifts, setGifts] = useState<Gift[]>(giftsData);
  const [loading, setLoading] = useState(true);
  const launchConfetti = useConfetti();
  const showToast = useToast();

  // Apply claims from server to gift list
  const applyClaimsToGifts = useCallback((claims: Record<string, string>) => {
    setGifts(
      giftsData.map((g) => ({
        ...g,
        claimedBy: claims[g.id] || null,
      }))
    );
  }, []);

  // Fetch claims from API
  const fetchClaims = useCallback(async () => {
    try {
      const res = await fetch("/api/claims");
      if (res.ok) {
        const data = await res.json();
        applyClaimsToGifts(data.claims);
      }
    } catch (err) {
      console.error("Erreur de chargement:", err);
    } finally {
      setLoading(false);
    }
  }, [applyClaimsToGifts]);

  // Initial fetch + polling
  useEffect(() => {
    fetchClaims();

    const interval = setInterval(fetchClaims, POLL_INTERVAL);
    return () => clearInterval(interval);
  }, [fetchClaims]);

  const claimedCount = gifts.filter((g) => g.claimedBy).length;
  const totalCount = gifts.length;
  const progressPercent = (claimedCount / totalCount) * 100;

  const handleClaim = async (id: string, name: string) => {
    // Optimistic update
    setGifts((prev) =>
      prev.map((g) => (g.id === id ? { ...g, claimedBy: name } : g))
    );

    try {
      const res = await fetch("/api/claims", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ giftId: id, name }),
      });

      const data = await res.json();

      if (res.ok) {
        applyClaimsToGifts(data.claims);
        const gift = giftsData.find((g) => g.id === id);
        showToast(`${name} a réservé "${gift?.name}" 🎉`);
        launchConfetti();
      } else {
        // Revert — someone else claimed it
        await fetchClaims();
        showToast(data.error || "Ce cadeau est déjà réservé 😕");
      }
    } catch {
      await fetchClaims();
      showToast("Erreur de connexion 😕");
    }
  };

  const handleUnclaim = async (id: string) => {
    const gift = gifts.find((g) => g.id === id);

    // Optimistic update
    setGifts((prev) =>
      prev.map((g) => (g.id === id ? { ...g, claimedBy: null } : g))
    );

    try {
      const res = await fetch("/api/claims", {
        method: "DELETE",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ giftId: id }),
      });

      const data = await res.json();

      if (res.ok) {
        applyClaimsToGifts(data.claims);
        showToast(`"${gift?.name}" est de nouveau disponible`);
      } else {
        await fetchClaims();
      }
    } catch {
      await fetchClaims();
      showToast("Erreur de connexion 😕");
    }
  };

  return (
    <section className="gifts-section">
      <div className="gifts-section-header">
        <h2 className="gifts-section-title">✨ Liste de Cadeaux ✨</h2>
        <p className="gifts-section-desc">
          Choisis un cadeau à réserver — entre ton nom pour que tout le monde
          sache qui l&apos;offre !
        </p>

        {/* Progress counter */}
        <div className="gifts-progress">
          <div className="gifts-progress-bar">
            <div
              className="gifts-progress-fill"
              style={{ width: `${progressPercent}%` }}
            />
          </div>
          <span className="gifts-progress-text">
            {claimedCount}/{totalCount} réservés
          </span>
        </div>

        <div className="decorative-line" style={{ marginTop: "1.5rem" }} />
      </div>

      {loading ? (
        <div style={{
          textAlign: "center",
          padding: "3rem",
          color: "var(--text-light)",
          fontSize: "1rem",
        }}>
          <div style={{
            width: "40px",
            height: "40px",
            border: "3px solid var(--pink-light)",
            borderTopColor: "var(--pink-dark)",
            borderRadius: "50%",
            animation: "spin 0.8s linear infinite",
            margin: "0 auto 1rem",
          }} />
          Chargement des cadeaux...
          <style>{`@keyframes spin { to { transform: rotate(360deg); } }`}</style>
        </div>
      ) : (
        <div className="gifts-grid">
          {gifts.map((gift, i) => (
            <GiftCard
              key={gift.id}
              gift={gift}
              index={i}
              onClaim={handleClaim}
              onUnclaim={handleUnclaim}
            />
          ))}
        </div>
      )}
    </section>
  );
}
