import { Button } from "@/components/ui/button";
import { LogIn, LogOut, User } from "lucide-react";
import { useAuth } from "@/hooks/useAuth";
import { useNavigate } from "react-router-dom";

export const Header = () => {
  const { user, signOut } = useAuth();
  const navigate = useNavigate();

  const handleAuthAction = () => {
    if (user) {
      signOut();
    } else {
      navigate("/auth");
    }
  };

  return (
    <header className="fixed top-0 left-0 right-0 z-50 glass border-b border-glass-border">
      <div className="container mx-auto px-4 h-16 flex items-center justify-between">
        {/* Logo */}
        <div className="flex items-center space-x-2">
          <div className="w-8 h-8 bg-gradient-to-br from-primary to-primary-glow rounded-lg shadow-glow"></div>
          <span className="text-xl font-bold bg-gradient-to-r from-foreground to-muted bg-clip-text text-transparent">
            Lunaris
          </span>
        </div>

        {/* User Info and Auth Button */}
        <div className="flex items-center gap-4">
          {user && (
            <div className="flex items-center gap-2 text-sm text-muted-foreground">
              <User className="w-4 h-4" />
              <span>{user.email}</span>
            </div>
          )}
          
          <Button 
            variant="glass" 
            size="default" 
            className="gap-2"
            onClick={handleAuthAction}
          >
            {user ? (
              <>
                <LogOut className="w-4 h-4" />
                Logout
              </>
            ) : (
              <>
                <LogIn className="w-4 h-4" />
                Login
              </>
            )}
          </Button>
        </div>
      </div>
    </header>
  );
};