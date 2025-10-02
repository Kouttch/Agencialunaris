import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, LineChart, Line } from 'recharts';
import { Button } from "@/components/ui/button";
import { Moon, Sun, Info } from "lucide-react";
import { useState, useEffect } from "react";
import { CustomerAvatar } from "@/components/CustomerAvatar";
import { Tooltip as TooltipUI, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/hooks/useAuth";
const weeklyData = [{
  name: 'Seg',
  conversas: 12,
  custo: 45.50,
  alcance: 1200
}, {
  name: 'Ter',
  conversas: 19,
  custo: 72.30,
  alcance: 1800
}, {
  name: 'Qua',
  conversas: 15,
  custo: 58.20,
  alcance: 1500
}, {
  name: 'Qui',
  conversas: 22,
  custo: 85.40,
  alcance: 2100
}, {
  name: 'Sex',
  conversas: 18,
  custo: 68.90,
  alcance: 1700
}, {
  name: 'Sab',
  conversas: 8,
  custo: 32.10,
  alcance: 900
}, {
  name: 'Dom',
  conversas: 5,
  custo: 21.80,
  alcance: 600
}];
const monthlyData = [{
  name: 'Sem 1',
  conversas: 89,
  custo: 342.50,
  alcance: 8900
}, {
  name: 'Sem 2',
  conversas: 112,
  custo: 428.30,
  alcance: 11200
}, {
  name: 'Sem 3',
  conversas: 95,
  custo: 365.80,
  alcance: 9500
}, {
  name: 'Sem 4',
  conversas: 128,
  custo: 492.60,
  alcance: 12800
}];
export default function CustomerDashboard() {
  const { user } = useAuth();
  const [theme, setTheme] = useState<"light" | "dark">("dark");
  const [profileData, setProfileData] = useState({
    userName: "",
    companyName: "",
    avatarUrl: ""
  });

  const toggleTheme = () => {
    const newTheme = theme === "dark" ? "light" : "dark";
    setTheme(newTheme);
    document.documentElement.classList.toggle("light-mode", newTheme === "light");
  };

  // Carregar dados do perfil
  useEffect(() => {
    if (user) {
      loadProfile();
    }
  }, [user]);

  const loadProfile = async () => {
    try {
      const { data: profile } = await supabase
        .from('profiles')
        .select('full_name, company, avatar_url')
        .eq('user_id', user?.id)
        .single();

      if (profile) {
        setProfileData({
          userName: profile.full_name || "",
          companyName: profile.company || "",
          avatarUrl: profile.avatar_url || ""
        });
      }
    } catch (error) {
      console.error('Erro ao carregar perfil:', error);
    }
  };

  const managerName = "Carlos Silva";
  return <div className="container mx-auto p-6 pb-24">
      <div className="mb-10">
        <h1 className="text-3xl font-bold mb-2">Minha Conta</h1>
        <p className="text-muted-foreground">Acompanhe o desempenho de suas campanhas</p>
      </div>

      {/* Key Metrics Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">
              Conversas Iniciadas
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">324</div>
            <p className="text-xs text-green-600 mt-1">+12% vs mês anterior</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">
              Custo por Conversa
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">R$ 4,32</div>
            <p className="text-xs text-red-600 mt-1">+5% vs mês anterior</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">
              Alcance Total
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">45.2K</div>
            <p className="text-xs text-green-600 mt-1">+18% vs mês anterior</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">
              Orçamento Restante
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">R$ 1.248</div>
            <p className="text-xs text-muted-foreground mt-1">de R$ 2.000</p>
          </CardContent>
        </Card>
      </div>

      {/* Dashboard Charts */}
      <Tabs defaultValue="weekly" className="space-y-4">
        <div className="flex items-center gap-3 mb-4">
          <TabsList>
            <TabsTrigger value="weekly">Semanal</TabsTrigger>
            <TabsTrigger value="monthly">Mensal</TabsTrigger>
          </TabsList>
          
          <TooltipProvider>
            <TooltipUI>
              <TooltipTrigger asChild>
                <Button variant="outline" size="sm" className="gap-2">
                  <Info className="h-4 w-4" />
                  Gestor Responsável
                </Button>
              </TooltipTrigger>
              <TooltipContent>
                <p className="font-semibold">{managerName}</p>
                <p className="text-xs text-muted-foreground">Seu gestor dedicado</p>
              </TooltipContent>
            </TooltipUI>
          </TooltipProvider>
        </div>

        <TabsContent value="weekly" className="space-y-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <Card>
              <CardHeader>
                <CardTitle>Conversas por Dia</CardTitle>
                <CardDescription>Últimos 7 dias</CardDescription>
              </CardHeader>
              <CardContent>
                <ResponsiveContainer width="100%" height={300}>
                  <BarChart data={weeklyData}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="name" />
                    <YAxis />
                    <Tooltip />
                    <Bar dataKey="conversas" fill="hsl(var(--primary))" />
                  </BarChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Alcance por Dia</CardTitle>
                <CardDescription>Últimos 7 dias</CardDescription>
              </CardHeader>
              <CardContent>
                <ResponsiveContainer width="100%" height={300}>
                  <LineChart data={weeklyData}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="name" />
                    <YAxis />
                    <Tooltip />
                    <Line type="monotone" dataKey="alcance" stroke="hsl(var(--primary))" strokeWidth={2} />
                  </LineChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="monthly" className="space-y-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <Card>
              <CardHeader>
                <CardTitle>Conversas por Semana</CardTitle>
                <CardDescription>Último mês</CardDescription>
              </CardHeader>
              <CardContent>
                <ResponsiveContainer width="100%" height={300}>
                  <BarChart data={monthlyData}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="name" />
                    <YAxis />
                    <Tooltip />
                    <Bar dataKey="conversas" fill="hsl(var(--primary))" />
                  </BarChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Alcance por Semana</CardTitle>
                <CardDescription>Último mês</CardDescription>
              </CardHeader>
              <CardContent>
                <ResponsiveContainer width="100%" height={300}>
                  <LineChart data={monthlyData}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="name" />
                    <YAxis />
                    <Tooltip />
                    <Line type="monotone" dataKey="alcance" stroke="hsl(var(--primary))" strokeWidth={2} />
                  </LineChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>
          </div>
        </TabsContent>
      </Tabs>

      {/* Theme Toggle Button */}
      <Button onClick={toggleTheme} size="icon" variant="outline" className="fixed bottom-6 right-6 z-50 h-12 w-12 rounded-full shadow-lg mx-0 px-0">
        {theme === "dark" ? <Sun className="h-5 w-5" /> : <Moon className="h-5 w-5" />}
      </Button>

      {/* Customer Avatar */}
      <CustomerAvatar 
        userName={profileData.userName} 
        companyName={profileData.companyName}
        avatarUrl={profileData.avatarUrl}
      />
    </div>;
}