import { Button } from "@/components/ui/button";
import { LogIn, LogOut, User } from "lucide-react";
import { useAuth } from "@/hooks/useAuth";
import { useNavigate } from "react-router-dom";
import { LunarisLogo } from "@/components/LunarisLogo";
import { cn } from "@/lib/utils";
import React from "react";

export const Header = () => {
  const { user, signOut } = useAuth();
  const navigate = useNavigate();
  const [isScrolled, setIsScrolled] = React.useState(false);

  React.useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 50);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const handleAuthAction = () => {
    if (user) {
      signOut();
    } else {
      navigate("/auth");
    }
  };

  return (
    <header className="fixed top-0 left-0 right-0 z-50 px-2">
      <div className={cn(
        'mx-auto mt-2 px-6 transition-all duration-500 ease-out',
        'max-w-6xl',
        isScrolled && 'bg-background/80 max-w-4xl rounded-2xl border backdrop-blur-lg shadow-lg'
      )}>
        <div className="relative flex items-center justify-between gap-6 py-3 lg:py-4">
          {/* Logo */}
          <div className="flex w-full justify-between lg:w-auto">
            <LunarisLogo />
          </div>

          {/* User Info and Auth Button */}
          <div className={cn(
            "flex items-center gap-4 transition-all duration-500 ease-out",
            isScrolled && "transform translate-x-0"
          )}>
            {user && (
              <div className={cn(
                "flex items-center gap-2 text-sm text-muted-foreground transition-all duration-500",
                isScrolled && "lg:hidden"
              )}>
                <User className="w-4 h-4" />
                <span>{user.email}</span>
              </div>
            )}
            
            <Button 
              variant="glass" 
              size="sm"
              className={cn(
                "gap-2 transition-all duration-500 ease-out",
                isScrolled ? "lg:inline-flex" : ""
              )}
              onClick={handleAuthAction}
            >
              {user ? (
                <>
                  <LogOut className="w-4 h-4" />
                  {isScrolled ? "Sair" : "Logout"}
                </>
              ) : (
                <>
                  <LogIn className="w-4 h-4" />
                  {isScrolled ? "Entrar" : "Login"}
                </>
              )}
            </Button>
          </div>
        </div>
      </div>
    </header>
  );
};