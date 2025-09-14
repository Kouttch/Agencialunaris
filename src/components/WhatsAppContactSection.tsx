import { useState } from "react";
import { Button } from "@/components/ui/button";
import { ButtonColorful } from "@/components/ui/button-colorful";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { MessageCircle } from "lucide-react";
import { BackgroundBeams } from "@/components/ui/background-beams";

export const WhatsAppContactSection = () => {
  const [formData, setFormData] = useState({
    name: "",
    phone: "",
    message: ""
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    const whatsappMessage = `Olá! Meu nome é ${formData.name}. 
Telefone: ${formData.phone}
Mensagem: ${formData.message}`;
    
    const whatsappURL = `https://wa.me/5511999999999?text=${encodeURIComponent(whatsappMessage)}`;
    window.open(whatsappURL, '_blank');
  };

  const handleInputChange = (field: string, value: string) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
  };

  return (
    <section className="whatsapp-contact-section min-h-screen w-full relative flex flex-col items-center justify-center antialiased py-20">
      <div className="max-w-2xl mx-auto p-4 z-10 relative">
        <h2 className="text-4xl md:text-6xl bg-clip-text text-transparent bg-gradient-to-b from-foreground to-muted-foreground text-center font-bold mb-4">
          Entre em Contato
        </h2>
        <p className="text-muted-foreground max-w-lg mx-auto mb-8 text-center text-lg">
          Preencha o formulário abaixo e envie sua mensagem diretamente pelo WhatsApp. 
          Responderemos o mais breve possível.
        </p>
        
        <div className="glass p-8 rounded-lg max-w-md mx-auto">
          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="space-y-2">
              <Label htmlFor="name" className="text-foreground font-medium">Nome</Label>
              <Input
                id="name"
                value={formData.name}
                onChange={(e) => handleInputChange("name", e.target.value)}
                placeholder="Digite seu nome"
                required
                className="bg-card/50 border-glass-border focus:ring-primary"
              />
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="phone" className="text-foreground font-medium">Telefone</Label>
              <Input
                id="phone"
                type="tel"
                value={formData.phone}
                onChange={(e) => handleInputChange("phone", e.target.value)}
                placeholder="(11) 99999-9999"
                required
                className="bg-card/50 border-glass-border focus:ring-primary"
              />
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="message" className="text-foreground font-medium">Mensagem</Label>
              <Textarea
                id="message"
                value={formData.message}
                onChange={(e) => handleInputChange("message", e.target.value)}
                placeholder="Digite sua mensagem..."
                rows={4}
                required
                className="bg-card/50 border-glass-border focus:ring-primary resize-none"
              />
            </div>
            
            <ButtonColorful 
              type="submit" 
              variant="green"
              label="Enviar via WhatsApp"
              className="w-full"
            />
          </form>
        </div>
      </div>
      <BackgroundBeams />
    </section>
  );
};