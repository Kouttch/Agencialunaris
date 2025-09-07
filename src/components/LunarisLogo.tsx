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
          src="/lovable-uploads/841bb7ed-4546-4b56-bb41-6b89e3102796.png" 
          alt="Logomarca" 
          className="h-[42px] w-auto object-contain"
        />
      </div>
      
    </div>;
};