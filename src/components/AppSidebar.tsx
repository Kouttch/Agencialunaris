import { BarChart3, Users, Settings, CreditCard, User, Home, MessageSquare, Shield, TrendingUp, FileText } from "lucide-react";
import { NavLink, useLocation } from "react-router-dom";
import { useAuth } from "@/hooks/useAuth";
import { useUserRole } from "@/hooks/useUserRole";
import { Sidebar, SidebarContent, SidebarGroup, SidebarGroupContent, SidebarGroupLabel, SidebarMenu, SidebarMenuButton, SidebarMenuItem, useSidebar } from "@/components/ui/sidebar";

export function AppSidebar() {
  const { open, setOpen } = useSidebar();
  const location = useLocation();
  const { user } = useAuth();
  const { isAdmin } = useUserRole();
  const currentPath = location.pathname;

  const customerItems = [{
    title: "Dashboard",
    url: "/minha-conta",
    icon: Home
  }, {
    title: "Estratégia",
    url: "/minha-conta/estrategia",
    icon: FileText
  }, {
    title: "Perfil",
    url: "/minha-conta/profile",
    icon: User
  }, {
    title: "Recargas",
    url: "/minha-conta/recargas",
    icon: CreditCard
  }];
  const adminItems = [{
    title: "Visão Geral",
    url: "/fulladmin",
    icon: BarChart3
  }, {
    title: "Clientes",
    url: "/fulladmin/clients",
    icon: Users
  }, {
    title: "Dashboards",
    url: "/fulladmin/dashboards",
    icon: TrendingUp
  }, {
    title: "Dados",
    url: "/fulladmin/data",
    icon: FileText
  }, {
    title: "Usuários",
    url: "/fulladmin/users",
    icon: Shield
  }, {
    title: "Pagamentos",
    url: "/fulladmin/payments",
    icon: MessageSquare
  }];
  const items = isAdmin ? adminItems : customerItems;
  const isActive = (path: string) => currentPath === path;
  const getNavCls = ({ isActive }: { isActive: boolean }) => 
    isActive ? "bg-sidebar-accent text-sidebar-accent-foreground font-medium" : "hover:bg-sidebar-accent/50";

  const handleMouseEnter = () => setOpen(true);
  const handleMouseLeave = () => setOpen(false);
  const handleTouchStart = () => setOpen(!open);

  return (
    <Sidebar 
      collapsible="icon"
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
      onTouchStart={handleTouchStart}
    >
      <SidebarContent className="pt-8">
        <SidebarGroup>
          <SidebarGroupLabel className="mb-2 mx-0 px-[8px] py-0 my-[12px]">
            {isAdmin ? "Administração" : "Menu Principal"}
          </SidebarGroupLabel>

          <SidebarGroupContent className="mx-0 my-0">
            <SidebarMenu className="my-px py-0">
              {items.map(item => (
                <SidebarMenuItem key={item.title}>
                  <SidebarMenuButton asChild>
                    <NavLink to={item.url} end className={getNavCls}>
                      <item.icon />
                      <span>{item.title}</span>
                    </NavLink>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              ))}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>
    </Sidebar>
  );
}