import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { useUserRole } from "@/hooks/useUserRole";

interface CustomerAvatarProps {
  avatarUrl?: string;
  companyName?: string;
  userName?: string;
  accountStatus?: string;
}

export const CustomerAvatar = ({
  avatarUrl,
  companyName,
  userName,
  accountStatus = 'active'
}: CustomerAvatarProps) => {
  const { isAdmin, isModerator } = useUserRole();
  
  const initials = (userName || companyName || "U")
    .split(" ")
    .map(n => n[0])
    .join("")
    .toUpperCase()
    .slice(0, 2);

  const isActive = accountStatus === 'active';
  
  // Determine badge configuration based on role
  const getBadgeConfig = () => {
    if (isAdmin) {
      return {
        label: "Admin",
        className: "bg-gradient-to-r from-yellow-400 via-yellow-500 to-yellow-600 text-black font-bold shadow-[0_0_20px_rgba(250,204,21,0.6)] border-yellow-300 [animation:gold-shimmer_2s_ease-in-out_infinite]"
      };
    }
    if (isModerator) {
      return {
        label: "Gestor",
        className: "bg-gradient-to-r from-[#f59b46] to-[#e83950] text-white font-bold shadow-[0_0_20px_rgba(245,155,70,0.6)] border-transparent [animation:gradient-pulse_2s_ease-in-out_infinite]"
      };
    }
    return {
      label: isActive ? "Ativo" : "Desativado",
      className: isActive ? "bg-green-500 hover:bg-green-600" : ""
    };
  };
  
  const badgeConfig = getBadgeConfig();

  return (
    <div className="fixed bottom-6 left-6 z-50 flex flex-col gap-2">
      <div className="flex items-center gap-3 bg-card/80 backdrop-blur-md border border-border rounded-full px-4 py-2 shadow-lg">
        <Avatar className="h-10 w-10 border-2 border-primary">
          <AvatarImage src={avatarUrl} alt={userName || companyName} />
          <AvatarFallback className="bg-primary text-primary-foreground">
            {initials}
          </AvatarFallback>
        </Avatar>
        <div className="flex flex-col">
          <span className="text-sm font-semibold text-foreground leading-tight">
            {userName || "Usuário"}
          </span>
          {companyName && (
            <span className="text-xs text-muted-foreground">
              {companyName}
            </span>
          )}
        </div>
        <Badge 
          variant={isAdmin || isModerator ? "default" : (isActive ? "default" : "destructive")}
          className={badgeConfig.className}
        >
          {badgeConfig.label}
        </Badge>
      </div>
    </div>
  );
};