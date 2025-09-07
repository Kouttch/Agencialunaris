import { Button } from "@/components/ui/button";
import { LogIn } from "lucide-react";

export const Header = () => {
  return (
    <header className="fixed top-0 left-0 right-0 z-50 glass border-b border-glass-border">
      <div className="container mx-auto px-4 h-16 flex items-center justify-between">
        {/* Logo */}
        <div className="flex items-center space-x-2">
          <div className="w-8 h-8 bg-gradient-to-br from-primary to-primary-glow rounded-lg shadow-glow"></div>
          <span className="text-xl font-bold bg-gradient-to-r from-foreground to-muted bg-clip-text text-transparent">
            TrafficPro
          </span>
        </div>

        {/* Login Button */}
        <Button variant="glass" size="default" className="gap-2">
          <LogIn className="w-4 h-4" />
          Login
        </Button>
      </div>
    </header>
  );
};