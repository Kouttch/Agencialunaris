import { cn } from "@/lib/utils";

type StatusType = "active" | "disabled" | "integration" | "pending";

interface StatusBadgeProps {
  status: StatusType;
  className?: string;
}

const statusConfig = {
  active: {
    label: "Ativo",
    color: "bg-green-500",
    glow: "shadow-[0_0_15px_rgba(34,197,94,0.6)]",
  },
  disabled: {
    label: "Desativado",
    color: "bg-red-500",
    glow: "shadow-[0_0_15px_rgba(239,68,68,0.6)]",
  },
  integration: {
    label: "Integração",
    color: "bg-blue-500",
    glow: "shadow-[0_0_15px_rgba(59,130,246,0.6)]",
  },
  pending: {
    label: "Pendente",
    color: "bg-orange-500",
    glow: "shadow-[0_0_15px_rgba(249,115,22,0.6)]",
  },
};

export const StatusBadge = ({ status, className }: StatusBadgeProps) => {
  const config = statusConfig[status];

  return (
    <div
      className={cn(
        "flex items-center gap-2 bg-card/80 backdrop-blur-md border border-border rounded-full px-4 py-2",
        className
      )}
    >
      <div className={cn("h-3 w-3 rounded-full animate-pulse", config.color, config.glow)} />
      <span className="text-sm font-medium text-foreground">{config.label}</span>
    </div>
  );
};
