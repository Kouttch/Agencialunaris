import { ReactNode } from "react";
import { Navigate } from "react-router-dom";
import { useAuth } from "@/hooks/useAuth";
import { useUserRole } from "@/hooks/useUserRole";

interface ProtectedRouteProps {
  children: ReactNode;
  requireAdmin?: boolean;
  requireModerator?: boolean;
}

export function ProtectedRoute({ children, requireAdmin, requireModerator }: ProtectedRouteProps) {
  const { user, loading } = useAuth();
  const { isAdmin, isModerator, loading: roleLoading } = useUserRole();

  if (loading || roleLoading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="animate-pulse text-foreground">Carregando...</div>
      </div>
    );
  }

  if (!user) {
    return <Navigate to="/auth" replace />;
  }

  if (requireAdmin && !isAdmin) {
    return <Navigate to="/minha-conta" replace />;
  }

  if (requireModerator && !isModerator && !isAdmin) {
    return <Navigate to="/minha-conta" replace />;
  }

  return <>{children}</>;
}
