import { LunarisLogo } from "@/components/LunarisLogo";
import { cn } from "@/lib/utils";
import React from "react";

export const Header = () => {
  const [isScrolled, setIsScrolled] = React.useState(false);

  React.useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 50);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <header className="fixed top-0 left-0 right-0 z-50 px-2">
      <div className={cn(
        'mx-auto mt-2 px-6 transition-all duration-500 ease-out',
        'max-w-6xl',
        isScrolled && 'bg-background/80 max-w-4xl rounded-2xl border backdrop-blur-lg shadow-lg'
      )}>
        <div className="relative flex items-center justify-center gap-6 py-3 lg:py-4">
          {/* Logo */}
          <LunarisLogo />
        </div>
      </div>
    </header>
  );
};
