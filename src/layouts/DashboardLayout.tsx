import { SidebarProvider, SidebarTrigger } from "@/components/ui/sidebar";
import { AppSidebar } from "@/components/AppSidebar";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { LogOut } from "lucide-react";
import { useAuth } from "@/hooks/useAuth";
import { StatusBadge } from "@/components/StatusBadge";
import { Badge } from "@/components/ui/badge";
import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import { NotificationPopup } from "@/components/NotificationPopup";
import { useUserRole } from "@/hooks/useUserRole";

interface DashboardLayoutProps {
  children: React.ReactNode;
}

export function DashboardLayout({ children }: DashboardLayoutProps) {
  const navigate = useNavigate();
  const { signOut, user } = useAuth();
  const { isAdmin, isModerator } = useUserRole();
  const [accountStatus, setAccountStatus] = useState<string>("active");

  useEffect(() => {
    if (user) {
      loadAccountStatus();
    }
  }, [user]);

  const loadAccountStatus = async () => {
    if (!user) return;
    
    const { data } = await supabase
      .from('profiles')
      .select('account_status')
      .eq('user_id', user.id)
      .single();
    
    if (data) {
      setAccountStatus(data.account_status || 'active');
    }
  };

  const handleSignOut = async () => {
    await signOut();
    navigate("/auth");
  };

  return (
    <SidebarProvider defaultOpen={false}>
      <div className="min-h-screen flex w-full">
        <NotificationPopup />
        
        {/* Header */}
        <header className="fixed top-0 left-0 right-0 z-50 h-12 flex items-center justify-between border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60 px-4">
          <div className="flex items-center gap-2">
            <img 
              src="/lunaris-logo.png" 
              alt="Lunaris Logo" 
              className="h-8 w-auto"
            />
          </div>
          
          <div className="flex items-center gap-4">
            {isAdmin ? (
              <Badge className="bg-gradient-to-r from-yellow-400 via-yellow-500 to-yellow-600 text-black font-bold shadow-[0_0_20px_rgba(250,204,21,0.6)] border-yellow-300 [animation:gold-shimmer_2s_ease-in-out_infinite]">
                Admin
              </Badge>
            ) : isModerator ? (
              <Badge className="bg-gradient-to-r from-[#f59b46] to-[#e83950] text-white font-bold shadow-[0_0_20px_rgba(245,155,70,0.6)] border-transparent [animation:gradient-pulse_2s_ease-in-out_infinite]">
                Gestor
              </Badge>
            ) : (
              <StatusBadge status={accountStatus as "active" | "disabled" | "integration" | "pending"} />
            )}
            <Button
              variant="ghost" 
              size="sm" 
              onClick={handleSignOut}
              className="gap-2"
            >
              <LogOut className="h-4 w-4" />
              Sair
            </Button>
          </div>
        </header>

        <AppSidebar />

        {/* Main Content */}
        <main className="flex-1 pt-12">
          {children}
        </main>
      </div>
    </SidebarProvider>
  );
}