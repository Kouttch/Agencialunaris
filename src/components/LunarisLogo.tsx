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
          src="/lovable-uploads/5c146d53-63fa-44b9-a87d-a2d676628830.png" 
          alt="Logomarca" 
          className="h-[42px] w-auto object-contain"
        />
      </div>
      
    </div>;
};