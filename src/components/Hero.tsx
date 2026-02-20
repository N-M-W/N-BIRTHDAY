"use client";

export default function Hero() {
  return (
    <section className="hero">
      <div className="ribbon-top" />
      <div className="hero-content">
        <div className="crown">👑</div>
        <h1 className="hero-title">Joyeux Anniversaire</h1>
        <div className="hero-name">Nada</div>
        <div className="decorative-line" />
        <p className="hero-subtitle">Une reine mérite le meilleur</p>
        <div className="scroll-hint">
          Découvre la liste de cadeaux
          <br />
          <span className="scroll-arrow">↓</span>
        </div>
      </div>
    </section>
  );
}
