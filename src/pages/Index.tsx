import { Header } from "@/components/Header";
import { HeroNew } from "@/components/HeroNew";
import { Features } from "@/components/Features";
import { Footer } from "@/components/Footer";
import { WhatsAppContactSection } from "@/components/WhatsAppContactSection";
import { FloatingWhatsAppButton } from "@/components/FloatingWhatsAppButton";

const Index = () => {
  return (
    <main className="min-h-screen">
      <Header />
      <HeroNew />
      <Features />
      <WhatsAppContactSection />
      <Footer />
      <FloatingWhatsAppButton />
    </main>
  );
};

export default Index;
