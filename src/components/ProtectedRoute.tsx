import { useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { useAuth } from "@/hooks/useAuth";
import { useUserRole } from "@/hooks/useUserRole";

interface ProtectedRouteProps {
  children: React.ReactNode;
  adminOnly?: boolean;
}

export const ProtectedRoute = ({ children, adminOnly = false }: ProtectedRouteProps) => {
  const { user, loading: authLoading } = useAuth();
  const { isAdmin, isModerator, loading: roleLoading } = useUserRole();
  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    if (!authLoading && !user) {
      navigate("/auth");
      return;
    }

    // Redirect admins to admin panel from customer pages
    if (!authLoading && !roleLoading && user && isAdmin) {
      if (location.pathname.startsWith('/minha-conta') || location.pathname.startsWith('/moderator')) {
        navigate("/fulladmin");
      }
    }

    // Redirect moderators to moderator panel from customer/admin pages
    if (!authLoading && !roleLoading && user && !isAdmin && isModerator) {
      if (location.pathname.startsWith('/minha-conta') || location.pathname.startsWith('/fulladmin')) {
        navigate("/moderator/dashboards");
      }
    }

    // Redirect users to customer dashboard from admin/moderator pages
    if (!authLoading && !roleLoading && user && !isAdmin && !isModerator) {
      if (location.pathname.startsWith('/fulladmin') || location.pathname.startsWith('/moderator')) {
        navigate("/minha-conta");
      }
    }
  }, [user, authLoading, isAdmin, roleLoading, navigate, location]);

  if (authLoading || roleLoading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="animate-pulse text-foreground">Carregando...</div>
      </div>
    );
  }

  if (!user) {
    return null;
  }

  if (adminOnly && !isAdmin) {
    return null;
  }

  return <>{children}</>;
};