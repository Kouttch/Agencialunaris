import { Link } from "react-router-dom";

export const Footer = () => {
  return <footer className="py-12 px-4 border-t border-glass-border bg-card/30">
      <div className="container mx-auto">
        <div className="grid md:grid-cols-3 gap-8 mb-8">
          {/* Brand */}
          <div>
            <div className="mb-4">
              <img 
                src="/lunaris-logo.png" 
                alt="Lunaris Logo" 
                className="h-[34px] w-auto object-contain"
              />
            </div>
            <p className="text-muted-foreground">
              O futuro da gestão de tráfego pago. Transparência, inovação e resultados excepcionais.
            </p>
          </div>

          {/* Links */}
          <div>
            <h3 className="font-semibold mb-4">Portal do Cliente</h3>
            <ul className="space-y-2 text-muted-foreground">
              <li>
                <Link to="/auth" className="hover:text-primary transition-colors">Login</Link>
              </li>
              <li>
                <a href="#" className="hover:text-primary transition-colors">Dashboards</a>
              </li>
              <li>
                <a href="#" className="hover:text-primary transition-colors">Estratégias</a>
              </li>
              <li>
                <a href="#" className="hover:text-primary transition-colors">Pagamentos</a>
              </li>
            </ul>
          </div>

          {/* Contact */}
          <div>
            <h3 className="font-semibold mb-4">Suporte</h3>
            <ul className="space-y-2 text-muted-foreground">
              <li>
                <a href="https://wa.me/5511974232091?text=Ol%C3%A1%2C%20eu%20estou%20tendo%20alguns%20problemas%2C%20gostaria%20de%20ajuda" target="_blank" rel="noopener noreferrer" className="hover:text-primary transition-colors">Central de Ajuda</a>
              </li>
              <li>
                <a href="/contact" className="hover:text-primary transition-colors">Contato</a>
              </li>
              <li>
                <a href="/terms-of-use" className="hover:text-primary transition-colors">Termos de Uso</a>
              </li>
              <li>
                <a href="/privacy" className="hover:text-primary transition-colors">Privacidade</a>
              </li>
            </ul>
          </div>
        </div>

        {/* Bottom */}
        <div className="pt-8 border-t border-glass-border text-center text-muted-foreground">
          <p>© 2025 Agência Lunaris. Todos os direitos reservados. Plataforma segura com Supabase.</p>
        </div>
      </div>
    </footer>;
};