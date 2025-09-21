import { MessageCircle } from "lucide-react";
import { Button } from "@/components/ui/button";

export const FloatingWhatsAppButton = () => {
  const handleWhatsAppClick = () => {
    const whatsappUrl = "https://wa.me/5511920769644";
    
    try {
      // Primeira tentativa: window.location.href (mais confiável)
      window.location.href = whatsappUrl;
    } catch (error) {
      console.log('Erro com location.href, tentando location.assign:', error);
      try {
        // Segunda tentativa: window.location.assign
        window.location.assign(whatsappUrl);
      } catch (error2) {
        console.log('Erro com location.assign, tentando window.open:', error2);
        // Terceira tentativa: window.open como fallback
        window.open(whatsappUrl, '_blank', 'noopener,noreferrer');
      }
    }
  };

  return (
    <Button
      onClick={handleWhatsAppClick}
      className="fixed bottom-6 right-6 z-50 h-14 w-14 rounded-full bg-green-500 hover:bg-green-600 text-white shadow-lg hover:shadow-xl transition-all duration-200 p-0"
      aria-label="Contato via WhatsApp"
    >
      <MessageCircle className="h-6 w-6" />
    </Button>
  );
};