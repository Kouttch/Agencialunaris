import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";

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
  const initials = (userName || companyName || "U")
    .split(" ")
    .map(n => n[0])
    .join("")
    .toUpperCase()
    .slice(0, 2);

  const isActive = accountStatus === 'active';

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
          variant={isActive ? "default" : "destructive"}
          className={isActive ? "bg-green-500 hover:bg-green-600" : ""}
        >
          {isActive ? "Ativo" : "Desativado"}
        </Badge>
      </div>
    </div>
  );
};