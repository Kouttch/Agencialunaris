import { Header } from "@/components/Header";
import { HeroNew } from "@/components/HeroNew";
import { Features } from "@/components/Features";
import { Footer } from "@/components/Footer";

const Index = () => {
  return (
    <main className="min-h-screen bg-background text-foreground">
      <Header />
      <HeroNew />
      <Features />
      <Footer />
    </main>
  );
};

export default Index;
