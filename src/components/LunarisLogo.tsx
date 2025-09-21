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
        <img 
          src="/lunaris-logo.png" 
          alt="Lunaris Logo" 
          className="h-[45px] w-auto object-contain"
        />
      </div>
      
    </div>;
};