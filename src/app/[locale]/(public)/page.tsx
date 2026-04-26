import { Footer } from "@/components/shared/Footer";
import { Header } from "@/components/shared/Header";
import { HeroSection } from "@/components/shared/HeroSection";

// Page d’accueil publique : coquille marketing (aucune logique métier)
export default function HomePage() {
  return (
    <>
      <Header />
      <main id="main-content" className="flex-1">
        <HeroSection />
      </main>
      <Footer />
    </>
  );
}
