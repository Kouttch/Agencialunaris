import { ButtonColorful } from "@/components/ui/button-colorful";
import { BackgroundBeams } from "@/components/ui/background-beams";

export const WhatsAppContactSection = () => {

  return (
    <section className="whatsapp-contact-section min-h-screen w-full relative flex flex-col items-center justify-center antialiased py-20">
      <div className="max-w-2xl mx-auto p-4 z-10 relative">
        <h2 className="text-4xl md:text-6xl bg-clip-text text-transparent bg-gradient-to-b from-foreground to-muted-foreground text-center font-bold mb-4">
          Entre em Contato
        </h2>
        <div className="glass p-8 rounded-lg max-w-md mx-auto">
          <p className="text-muted-foreground text-center text-lg mb-6">
            Envie sua mensagem diretamente pelo WhatsApp. 
            Responderemos o mais breve possível.
          </p>
          
          <div className="flex flex-col items-center gap-4">
            <a 
              href="https://wa.me/5511974232091?text=Ol%C3%A1%2C%20vim%20pelo%20seu%20site%2C%20gostaria%20de%20saber%20mais%20sobre%20o%20seu%20tr%C3%A1fego%20pago."
              target="_blank" 
              rel="noopener noreferrer"
              style={{
                display: 'inline-block',
                background: '#25D366',
                color: '#fff',
                padding: '12px 20px',
                borderRadius: '8px',
                textDecoration: 'none',
                font: '600 16px/1.2 Arial, sans-serif'
              }}
            >
              💬 Fale no WhatsApp
            </a>
          </div>
        </div>
      </div>
      <BackgroundBeams />
    </section>
  );
};