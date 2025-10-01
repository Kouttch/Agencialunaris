import { useNavigate } from "react-router-dom";
import { Card } from "@/components/ui/card";
import { LogIn, User } from "lucide-react";
import { useAuth } from "@/hooks/useAuth";

export const ClientPortalSection = () => {
  const navigate = useNavigate();
  const { user } = useAuth();

  const handleMinhaContaClick = () => {
    if (user) {
      navigate("/minha-conta");
    } else {
      navigate("/auth");
    }
  };

  return (
    <section className="py-20 px-6 bg-background">
      <div className="max-w-7xl mx-auto">
        <h2 className="text-4xl font-bold text-center mb-12 text-foreground">
          Portal do Cliente
        </h2>
        
        <div className="grid md:grid-cols-2 gap-8 max-w-3xl mx-auto">
          {/* Login Card */}
          <Card
            className="p-8 cursor-pointer hover:shadow-lg transition-all duration-300 hover:scale-105 bg-card border-border"
            onClick={() => navigate("/auth")}
          >
            <div className="flex flex-col items-center text-center space-y-4">
              <div className="p-4 rounded-full bg-primary/10">
                <LogIn className="w-8 h-8 text-primary" />
              </div>
              <h3 className="text-2xl font-semibold text-foreground">Login</h3>
              <p className="text-muted-foreground">
                Acesse sua conta
              </p>
            </div>
          </Card>

          {/* Minha Conta Card */}
          <Card
            className="p-8 cursor-pointer hover:shadow-lg transition-all duration-300 hover:scale-105 bg-card border-border"
            onClick={handleMinhaContaClick}
          >
            <div className="flex flex-col items-center text-center space-y-4">
              <div className="p-4 rounded-full bg-primary/10">
                <User className="w-8 h-8 text-primary" />
              </div>
              <h3 className="text-2xl font-semibold text-foreground">Minha Conta</h3>
              <p className="text-muted-foreground">
                Gerencie seu perfil
              </p>
            </div>
          </Card>
        </div>
      </div>
    </section>
  );
};
