import { SidebarProvider, SidebarTrigger } from "@/components/ui/sidebar";
import { AppSidebar } from "@/components/AppSidebar";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { LogOut } from "lucide-react";
import { useAuth } from "@/hooks/useAuth";
import { StatusBadge } from "@/components/StatusBadge";
import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import { NotificationPopup } from "@/components/NotificationPopup";

interface DashboardLayoutProps {
  children: React.ReactNode;
}

export function DashboardLayout({ children }: DashboardLayoutProps) {
  const navigate = useNavigate();
  const { signOut, user } = useAuth();
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
            <StatusBadge status={accountStatus as "active" | "disabled" | "integration" | "pending"} />
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