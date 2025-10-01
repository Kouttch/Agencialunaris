import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Building2 } from "lucide-react";

interface CustomerAvatarProps {
  avatarUrl?: string;
  companyName?: string;
  userName?: string;
}

export const CustomerAvatar = ({ avatarUrl, companyName, userName }: CustomerAvatarProps) => {
  const initials = (userName || companyName || "U")
    .split(" ")
    .map((n) => n[0])
    .join("")
    .toUpperCase()
    .slice(0, 2);

  return (
    <div className="fixed bottom-6 left-6 z-50 flex items-center gap-3 bg-card/80 backdrop-blur-md border border-border rounded-full px-4 py-2 shadow-lg">
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
  );
};
