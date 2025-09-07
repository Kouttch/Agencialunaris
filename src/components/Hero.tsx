import { Button } from "@/components/ui/button";
import { ArrowRight, BarChart3, Shield, Zap } from "lucide-react";
import heroDashboard from "@/assets/hero-dashboard.jpg";

export const Hero = () => {
  return (
    <section className="relative min-h-screen flex items-center justify-center overflow-hidden">
      {/* Background */}
      <div className="absolute inset-0 bg-gradient-to-br from-background via-card to-background">
        <img 
          src={heroDashboard} 
          alt="Futuristic dashboard" 
          className="absolute inset-0 w-full h-full object-cover opacity-20 mix-blend-overlay"
        />
      </div>
      
      {/* Floating elements */}
      <div className="absolute top-20 left-10 w-20 h-20 bg-primary/10 rounded-full blur-xl animate-float"></div>
      <div className="absolute bottom-32 right-16 w-32 h-32 bg-primary-glow/10 rounded-full blur-2xl animate-float" style={{animationDelay: '2s'}}></div>
      
      <div className="relative z-10 container mx-auto px-4 text-center">
        {/* Main content */}
        <div className="max-w-4xl mx-auto space-y-8">
          <h1 className="text-6xl md:text-8xl font-black leading-tight">
            <span className="bg-gradient-to-r from-foreground via-primary to-primary-glow bg-clip-text text-transparent animate-glow">
              Gestão de Tráfego
            </span>
            <br />
            <span className="text-muted-foreground">do Futuro</span>
          </h1>
          
          <p className="text-xl md:text-2xl text-muted-foreground max-w-2xl mx-auto leading-relaxed">
            Portal exclusivo para acompanhar suas campanhas com dashboards avançados, 
            estratégias personalizadas e gestão completa de investimentos.
          </p>
          
          {/* CTA Buttons */}
          <div className="flex flex-col sm:flex-row gap-4 justify-center items-center mt-12">
            <Button variant="neon" size="xl" className="gap-2 min-w-[200px]">
              Acessar Portal
              <ArrowRight className="w-5 h-5" />
            </Button>
            <Button variant="holographic" size="xl" className="gap-2 min-w-[200px]">
              Saiba Mais
            </Button>
          </div>
          
          {/* Features */}
          <div className="grid md:grid-cols-3 gap-6 mt-16">
            <div className="glass p-6 rounded-2xl text-center group hover:shadow-glow transition-all duration-300">
              <BarChart3 className="w-12 h-12 text-primary mx-auto mb-4 group-hover:animate-pulse" />
              <h3 className="text-xl font-bold mb-2">Dashboards Avançados</h3>
              <p className="text-muted-foreground">Visualize suas métricas semanais e mensais com precisão</p>
            </div>
            
            <div className="glass p-6 rounded-2xl text-center group hover:shadow-glow transition-all duration-300">
              <Shield className="w-12 h-12 text-primary mx-auto mb-4 group-hover:animate-pulse" />
              <h3 className="text-xl font-bold mb-2">Segurança Total</h3>
              <p className="text-muted-foreground">Dados protegidos com criptografia de ponta</p>
            </div>
            
            <div className="glass p-6 rounded-2xl text-center group hover:shadow-glow transition-all duration-300">
              <Zap className="w-12 h-12 text-primary mx-auto mb-4 group-hover:animate-pulse" />
              <h3 className="text-xl font-bold mb-2">Performance</h3>
              <p className="text-muted-foreground">Otimização contínua das suas campanhas</p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};