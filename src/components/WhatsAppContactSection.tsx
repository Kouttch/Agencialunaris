import { ButtonColorful } from "@/components/ui/button-colorful";
import { BackgroundBeams } from "@/components/ui/background-beams";
export const WhatsAppContactSection = () => {
  const handleWhatsAppClick = () => {
    const whatsappUrl = "https://wa.me/11920811670?text=Ol%C3%A1%21%20Vim%20pelo%20site%20e%20quero%20conhecer%20seus%20servi%C3%A7os%20e%20planos%20dispon%C3%ADveis.";
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
  return <section className="whatsapp-contact-section min-h-screen w-full relative flex flex-col items-center justify-center antialiased py-20">
      <div className="max-w-2xl mx-auto p-4 z-10 relative">
        <h2 className="text-4xl md:text-6xl bg-clip-text text-transparent bg-gradient-to-b from-foreground to-muted-foreground text-center font-bold mb-4">
          Entre em Contato com um Consultor    
        </h2>
        <div className="glass p-8 rounded-lg max-w-md mx-auto">
          <p className="text-muted-foreground text-center text-lg mb-6">
            Envie sua mensagem diretamente pelo WhatsApp. 
            Responderemos o mais breve possível.
          </p>
          
          <div className="flex flex-col items-center gap-4">
            <ButtonColorful variant="green" label="Fale com o Consultor pelo WhatsApp" className="px-8 py-3" onClick={handleWhatsAppClick} />
          </div>
        </div>
      </div>
      <BackgroundBeams />
    </section>;
};