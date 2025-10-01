import { useNavigate } from "react-router-dom";
import { Card } from "@/components/ui/card";
import { LogIn, User } from "lucide-react";
import { useAuth } from "@/hooks/useAuth";
export const ClientPortalSection = () => {
  const navigate = useNavigate();
  const {
    user
  } = useAuth();
  const handleMinhaContaClick = () => {
    if (user) {
      navigate("/minha-conta");
    } else {
      navigate("/auth");
    }
  };
  
  return (
    <section className="py-16 px-4 bg-background">
      <div className="container mx-auto">
        <h2 className="text-3xl font-bold text-center mb-12">Portal do Cliente</h2>
        <div className="grid md:grid-cols-2 gap-6 max-w-2xl mx-auto">
          <Card className="p-8 hover:shadow-lg transition-shadow cursor-pointer" onClick={() => navigate("/auth")}>
            <div className="flex flex-col items-center text-center space-y-4">
              <LogIn className="w-12 h-12 text-primary" />
              <h3 className="text-xl font-semibold">Login</h3>
              <p className="text-muted-foreground">Acesse sua conta</p>
            </div>
          </Card>
          
          <Card className="p-8 hover:shadow-lg transition-shadow cursor-pointer" onClick={handleMinhaContaClick}>
            <div className="flex flex-col items-center text-center space-y-4">
              <User className="w-12 h-12 text-primary" />
              <h3 className="text-xl font-semibold">Minha Conta</h3>
              <p className="text-muted-foreground">Gerencie suas informações</p>
            </div>
          </Card>
        </div>
      </div>
    </section>
  );
};