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
          src="/lovable-uploads/4ba262f3-415c-4a4b-8118-476ed941caae.png" 
          alt="Logo Icon" 
          className="w-8 h-8 object-contain"
        />
      </div>
      
    </div>;
};