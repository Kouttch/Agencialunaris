import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";
import { Instagram, MessageCircle, Mail } from "lucide-react";

const Contact = () => {
  return (
    <div className="min-h-screen">
      <Header />
      <main className="container mx-auto px-4 py-20">
        <div className="max-w-3xl mx-auto">
          <h1 className="text-4xl font-bold text-center mb-8">Contato</h1>
          <p className="text-center text-muted-foreground mb-12">
            Entre em contato conosco através dos canais abaixo
          </p>
          
          <div className="grid gap-8 md:grid-cols-1 max-w-md mx-auto">
            {/* Instagram */}
            <div className="glass p-6 rounded-lg text-center">
              <Instagram className="h-8 w-8 mx-auto mb-4 text-pink-500" />
              <h3 className="font-semibold mb-2">Instagram</h3>
              <p className="text-muted-foreground">@Somoslunaris</p>
            </div>
            
            {/* WhatsApp */}
            <div className="glass p-6 rounded-lg text-center">
              <MessageCircle className="h-8 w-8 mx-auto mb-4 text-green-500" />
              <h3 className="font-semibold mb-2">WhatsApp</h3>
              <p className="text-muted-foreground">55+ (11) 974232091</p>
            </div>
            
            {/* Email */}
            <div className="glass p-6 rounded-lg text-center">
              <Mail className="h-8 w-8 mx-auto mb-4 text-blue-500" />
              <h3 className="font-semibold mb-2">E-mail</h3>
              <div className="space-y-1 text-muted-foreground">
                <p>thiagomoggi@agencialunaris.com</p>
                <p>ou</p>
                <p>higorcoutinho@agencialunaris.com</p>
              </div>
            </div>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
};

export default Contact;