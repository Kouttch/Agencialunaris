import { ButtonColorful } from "@/components/ui/button-colorful";
import { BackgroundBeams } from "@/components/ui/background-beams";

export const WhatsAppContactSection = () => {

  return (
    <section className="whatsapp-contact-section min-h-screen w-full relative flex flex-col items-center justify-center antialiased py-20">
      <div className="max-w-2xl mx-auto p-4 z-10 relative">
        <h2 className="text-4xl md:text-6xl bg-clip-text text-transparent bg-gradient-to-b from-foreground to-muted-foreground text-center font-bold mb-4">
          Entre em Contato
        </h2>
        <p className="text-muted-foreground max-w-lg mx-auto mb-8 text-center text-lg">
          Envie sua mensagem diretamente pelo WhatsApp. 
          Responderemos o mais breve possível.
        </p>
        
        <div className="flex justify-center">
          <ButtonColorful 
            variant="green"
            label="Enviar via WhatsApp"
            className="px-8 py-3"
            onClick={() => window.open('https://api.whatsapp.com/send?phone=5511974232091&text=Olá! vim pelo site, fiquei interessado no Tráfego pago, gostaria de mais informações.', '_blank')}
          />
        </div>
      </div>
      <BackgroundBeams />
    </section>
  );
};