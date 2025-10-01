import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Building2, Settings } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router-dom";

interface CustomerAvatarProps {
  avatarUrl?: string;
  companyName?: string;
  userName?: string;
}

export const CustomerAvatar = ({ avatarUrl, companyName, userName }: CustomerAvatarProps) => {
  const navigate = useNavigate();
  const initials = (userName || companyName || "U")
    .split(" ")
    .map((n) => n[0])
    .join("")
    .toUpperCase()
    .slice(0, 2);

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
            <span className="text-xs text-muted-foreground flex items-center gap-1">
              <Building2 className="h-3 w-3" />
              {companyName}
            </span>
          )}
        </div>
      </div>
      <Button 
        size="sm" 
        variant="outline"
        className="w-full gap-2"
        onClick={() => navigate("/minha-conta/profile")}
      >
        <Settings className="h-4 w-4" />
        Configurações
      </Button>
    </div>
  );
};
