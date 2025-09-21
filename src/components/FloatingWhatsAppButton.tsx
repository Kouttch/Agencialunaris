import { MessageCircle } from "lucide-react";
import { Button } from "@/components/ui/button";

export const FloatingWhatsAppButton = () => {
  const handleWhatsAppClick = () => {
    window.open("https://bit.ly/3W3Nd1O", '_blank');
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