import FloatingDecorations from "@/components/FloatingDecorations";
import Hero from "@/components/Hero";
import GiftsSection from "@/components/GiftsSection";
import ConfettiContainer from "@/components/Confetti";
import Toast from "@/components/Toast";

export default function Home() {
  return (
    <>
      <FloatingDecorations />
      <Hero />
      <GiftsSection />

      <footer className="footer">
        <p className="footer-title">🎀 Joyeux Anniversaire, Nada ! 🎀</p>
        <p className="footer-sub">Fait avec 💖</p>
      </footer>

      <ConfettiContainer />
      <Toast />
    </>
  );
}
