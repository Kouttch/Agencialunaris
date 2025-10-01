import { useState } from "react";
import { BarChart3, Users, Settings, CreditCard, User, Home, MessageSquare, Shield, TrendingUp } from "lucide-react";
import { NavLink, useLocation } from "react-router-dom";
import { useAuth } from "@/hooks/useAuth";
import { Sidebar, SidebarContent, SidebarGroup, SidebarGroupContent, SidebarGroupLabel, SidebarMenu, SidebarMenuButton, SidebarMenuItem, SidebarTrigger, useSidebar } from "@/components/ui/sidebar";
export function AppSidebar() {
  const {
    open,
    setOpen
  } = useSidebar();
  const location = useLocation();
  const {
    user
  } = useAuth();
  const currentPath = location.pathname;

  // TODO: Check user role from database
  const isAdmin = false; // This should be fetched from user_roles table

  const customerItems = [{
    title: "Dashboard",
    url: "/minha-conta",
    icon: Home
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
    title: "Pagamentos",
    url: "/fulladmin/payments",
    icon: MessageSquare
  }];
  const items = isAdmin ? adminItems : customerItems;
  const isActive = (path: string) => currentPath === path;
  const getNavCls = ({
    isActive
  }: {
    isActive: boolean;
  }) => isActive ? "bg-sidebar-accent text-sidebar-accent-foreground font-medium" : "hover:bg-sidebar-accent/50";
  return <Sidebar collapsible="icon">
      <SidebarContent className="pt-8">
        <SidebarGroup>
          <SidebarGroupLabel className="mb-2 mx-0 px-[8px] py-0 my-[12px]">
            {isAdmin ? "Administração" : "Menu Principal"}
          </SidebarGroupLabel>

          <SidebarGroupContent className="mx-0 my-0">
            <SidebarMenu className="my-px py-0">
              {items.map(item => <SidebarMenuItem key={item.title}>
                  <SidebarMenuButton asChild>
                    <NavLink to={item.url} end className={getNavCls}>
                      <item.icon />
                      <span>{item.title}</span>
                    </NavLink>
                  </SidebarMenuButton>
                </SidebarMenuItem>)}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>
    </Sidebar>;
}