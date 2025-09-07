export const Footer = () => {
  return (
    <footer className="py-12 px-4 border-t border-glass-border bg-card/30">
      <div className="container mx-auto">
        <div className="grid md:grid-cols-3 gap-8 mb-8">
          {/* Brand */}
          <div>
            <div className="flex items-center space-x-2 mb-4">
              <div className="w-8 h-8 bg-gradient-to-br from-primary to-primary-glow rounded-lg shadow-glow"></div>
              <span className="text-xl font-bold bg-gradient-to-r from-foreground to-muted bg-clip-text text-transparent">
                TrafficPro
              </span>
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
                <a href="#login" className="hover:text-primary transition-colors">Login</a>
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
                <a href="#" className="hover:text-primary transition-colors">Central de Ajuda</a>
              </li>
              <li>
                <a href="#" className="hover:text-primary transition-colors">Contato</a>
              </li>
              <li>
                <a href="#" className="hover:text-primary transition-colors">Termos de Uso</a>
              </li>
              <li>
                <a href="#" className="hover:text-primary transition-colors">Privacidade</a>
              </li>
            </ul>
          </div>
        </div>

        {/* Bottom */}
        <div className="pt-8 border-t border-glass-border text-center text-muted-foreground">
          <p>© 2024 TrafficPro. Todos os direitos reservados. Plataforma segura com Supabase.</p>
        </div>
      </div>
    </footer>
  );
};