import { useTheme } from "next-themes";
export const LunarisLogo = ({
  className
}: {
  className?: string;
}) => {
  const {
    theme
  } = useTheme();
  return <div className={`flex items-center space-x-3 ${className}`}>
      <div className="relative">
        <svg width="32" height="32" viewBox="0 0 32 32" fill="none" xmlns="http://www.w3.org/2000/svg" className="text-foreground">
          <circle cx="16" cy="16" r="14" stroke="currentColor" strokeWidth="2" fill="none" />
          <path d="M8 16 C8 10, 12 6, 16 8 C20 10, 24 14, 22 18 C20 22, 16 20, 16 16 C16 12, 20 8, 24 16" stroke="currentColor" strokeWidth="2" fill="none" strokeLinecap="round" />
          <circle cx="16" cy="16" r="2" fill="currentColor" />
        </svg>
      </div>
      
    </div>;
};