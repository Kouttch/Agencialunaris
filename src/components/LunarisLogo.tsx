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
          src="/lovable-uploads/12b8627d-c913-48b9-a3a2-df60ab1dee2d.png" 
          alt="Logomarca" 
          className="h-[41px] w-auto object-contain"
        />
      </div>
      
    </div>;
};