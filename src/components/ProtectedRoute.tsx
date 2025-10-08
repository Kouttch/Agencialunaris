import { ReactNode, useEffect, useState } from "react";
import { Navigate } from "react-router-dom";
import { useAuth } from "@/hooks/useAuth";
import { useUserRole } from "@/hooks/useUserRole";
import { supabase } from "@/integrations/supabase/client";

interface ProtectedRouteProps {
  children: ReactNode;
  requireAdmin?: boolean;
  requireModerator?: boolean;
}

export function ProtectedRoute({ children, requireAdmin, requireModerator }: ProtectedRouteProps) {
  const { user, loading } = useAuth();
  const { isAdmin, isModerator, loading: roleLoading } = useUserRole();
  const [isChecking, setIsChecking] = useState(true);
  const [accountStatus, setAccountStatus] = useState<string>("active");

  useEffect(() => {
    const checkStatus = async () => {
      if (user && !isAdmin && !isModerator) {
        const { data } = await supabase
          .from('profiles')
          .select('account_status')
          .eq('user_id', user.id)
          .single();
        
        if (data) {
          setAccountStatus(data.account_status || 'active');
        }
      }
      
      if (!loading && !roleLoading) {
        setIsChecking(false);
      }
    };
    
    checkStatus();
  }, [loading, roleLoading, user, isAdmin, isModerator]);

  if (isChecking) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="animate-pulse text-foreground">Carregando...</div>
      </div>
    );
  }

  if (!user) {
    return <Navigate to="/auth" replace />;
  }

  // Check if user is not admin/moderator and account is not active
  if (!isAdmin && !isModerator && accountStatus !== 'active') {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center p-6 max-w-md">
          <h2 className="text-2xl font-bold mb-2">Conta Desativada</h2>
          <p className="text-muted-foreground">
            Sua conta está temporariamente desativada. Entre em contato com o suporte para mais informações.
          </p>
        </div>
      </div>
    );
  }

  if (requireAdmin && !isAdmin) {
    return <Navigate to="/minha-conta" replace />;
  }

  if (requireModerator && !isModerator && !isAdmin) {
    return <Navigate to="/minha-conta" replace />;
  }

  return <>{children}</>;
}
