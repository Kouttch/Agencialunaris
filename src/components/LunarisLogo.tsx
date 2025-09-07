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
          src="/lovable-uploads/42bdf90b-6a45-48b1-b174-68e28fdc281f.png" 
          alt="Logomarca" 
          className="h-[41px] w-auto object-contain"
        />
      </div>
      
    </div>;
};