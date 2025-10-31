import { Button } from "@/components/ui/button";
import { Moon, Sun } from "lucide-react";
import { useState, useEffect } from "react";
import { CustomerAvatar } from "@/components/CustomerAvatar";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/hooks/useAuth";
import { useUserRole } from "@/hooks/useUserRole";
import ChecklistManagement from "./ChecklistManagement";
import ModernDashboard from "@/components/ModernDashboard";

export default function CustomerDashboard() {
  const { user } = useAuth();
  const { isAdmin, isModerator } = useUserRole();
  const [theme, setTheme] = useState<"light" | "dark">("dark");
  const [profileData, setProfileData] = useState({
    userName: "",
    companyName: "",
    avatarUrl: "",
    accountStatus: "active"
  });

  const toggleTheme = () => {
    const newTheme = theme === "dark" ? "light" : "dark";
    setTheme(newTheme);
    document.documentElement.classList.toggle("light-mode", newTheme === "light");
  };

  useEffect(() => {
    if (user) {
      loadProfile();
    }
  }, [user]);

  const loadProfile = async () => {
    try {
      const { data: profile } = await supabase
        .from('profiles')
        .select(`
          full_name, 
          company, 
          avatar_url,
          account_status
        `)
        .eq('user_id', user?.id)
        .single();

      if (profile) {
        setProfileData({
          userName: profile.full_name || "",
          companyName: profile.company || "",
          avatarUrl: profile.avatar_url || "",
          accountStatus: profile.account_status || "active"
        });
      }
    } catch (error) {
      console.error('Erro ao carregar perfil:', error);
    }
  };

  const isDeactivated = profileData.accountStatus !== 'active' && profileData.accountStatus !== 'pending';

  // Se for Admin ou Gestor, mostrar Checklist
  if (isAdmin || isModerator) {
    return (
      <div className="container mx-auto p-6 pb-24">
        <div className="mb-6">
          <h1 className="text-3xl font-bold mb-2">Checklist de Tarefas</h1>
          <p className="text-muted-foreground">Gerencie todas as tarefas e acompanhamento</p>
        </div>
        <ChecklistManagement />
      </div>
    );
  }

  return (
    <div className="container mx-auto p-6 pb-24">
      <div className="mb-10">
        <h1 className="text-3xl font-bold mb-2">Minha Conta</h1>
        <p className="text-muted-foreground">Acompanhe o desempenho de suas campanhas</p>
      </div>

      {/* Dashboard content wrapper with blur when deactivated */}
      <div className="relative">
        {isDeactivated && (
          <div className="absolute inset-0 z-50 backdrop-blur-md bg-background/80 flex items-center justify-center rounded-lg min-h-[500px]">
            <div className="text-center space-y-2 p-8">
              <h2 className="text-3xl font-bold text-destructive">Dashboard Indisponível</h2>
              <p className="text-muted-foreground text-lg">
                {profileData.accountStatus === 'integration' 
                  ? 'Estamos construindo e ajustando o seu acesso.'
                  : 'Sua conta está desativada. Entre em contato com o suporte.'}
              </p>
            </div>
          </div>
        )}

        <ModernDashboard userId={user?.id || ''} isAdmin={isAdmin} isModerator={isModerator} />
      </div>

      {/* Theme Toggle Button */}
      <Button onClick={toggleTheme} size="icon" variant="outline" className="fixed bottom-6 right-6 z-50 h-12 w-12 rounded-full shadow-lg mx-0 px-0">
        {theme === "dark" ? <Sun className="h-5 w-5" /> : <Moon className="h-5 w-5" />}
      </Button>

      {/* Customer Avatar */}
      <CustomerAvatar 
        userName={profileData.userName} 
        companyName={profileData.companyName}
        avatarUrl={profileData.avatarUrl}
        accountStatus={profileData.accountStatus}
      />
    </div>
  );
}
