import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { LogIn, User } from "lucide-react";
import { useNavigate } from "react-router-dom";

export const ClientPortalSection = () => {
  const navigate = useNavigate();

  return (
    <section className="py-24 px-4 bg-gradient-to-b from-card/30 to-background">
      <div className="container mx-auto">
        <div className="text-center mb-12">
          <h2 className="text-4xl md:text-5xl font-bold mb-4">
            <span className="bg-gradient-to-r from-foreground to-primary bg-clip-text text-transparent">
              Portal do Cliente
            </span>
          </h2>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            Acesse sua conta ou faça login para visualizar seus dados
          </p>
        </div>

        <div className="grid md:grid-cols-2 gap-8 max-w-3xl mx-auto">
          <Card 
            className="glass border-glass-border hover:shadow-glow transition-all duration-500 group cursor-pointer"
            onClick={() => navigate("/auth")}
          >
            <CardHeader className="text-center">
              <div className="w-16 h-16 bg-gradient-to-br from-primary to-primary-glow rounded-lg flex items-center justify-center mb-4 group-hover:animate-pulse mx-auto">
                <LogIn className="w-8 h-8 text-primary-foreground" />
              </div>
              <CardTitle className="text-2xl group-hover:text-primary transition-colors">
                Login
              </CardTitle>
            </CardHeader>
            <CardContent className="text-center">
              <p className="text-muted-foreground">
                Acesse o portal com suas credenciais
              </p>
            </CardContent>
          </Card>

          <Card 
            className="glass border-glass-border hover:shadow-glow transition-all duration-500 group cursor-pointer"
            onClick={() => navigate("/minha-conta")}
          >
            <CardHeader className="text-center">
              <div className="w-16 h-16 bg-gradient-to-br from-primary to-primary-glow rounded-lg flex items-center justify-center mb-4 group-hover:animate-pulse mx-auto">
                <User className="w-8 h-8 text-primary-foreground" />
              </div>
              <CardTitle className="text-2xl group-hover:text-primary transition-colors">
                Minha Conta
              </CardTitle>
            </CardHeader>
            <CardContent className="text-center">
              <p className="text-muted-foreground">
                Gerencie suas informações e preferências
              </p>
            </CardContent>
          </Card>
        </div>
      </div>
    </section>
  );
};
