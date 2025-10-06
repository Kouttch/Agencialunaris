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
import { useToast } from "@/hooks/use-toast";
interface ChartData {
  name: string;
  conversas: number;
  custo: number;
  alcance: number;
}
export default function CustomerDashboard() {
  const { user } = useAuth();
  const { toast } = useToast();
  const [theme, setTheme] = useState<"light" | "dark">("dark");
  const [profileData, setProfileData] = useState({
    userName: "",
    companyName: "",
    avatarUrl: ""
  });
  
  const [weeklyData, setWeeklyData] = useState<ChartData[]>([]);
  const [monthlyData, setMonthlyData] = useState<ChartData[]>([]);
  const [metrics, setMetrics] = useState({
    conversasIniciadas: 0,
    custoPorConversa: 0,
    alcanceTotal: 0,
    orcamentoRestante: 0
  });
  const [loading, setLoading] = useState(true);

  const toggleTheme = () => {
    const newTheme = theme === "dark" ? "light" : "dark";
    setTheme(newTheme);
    document.documentElement.classList.toggle("light-mode", newTheme === "light");
  };

  // Carregar dados do perfil e campanha
  useEffect(() => {
    if (user) {
      loadProfile();
      loadCampaignData();
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

  const loadCampaignData = async () => {
    try {
      setLoading(true);
      
      const { data: campaignData, error } = await supabase
        .from('campaign_data')
        .select('*')
        .eq('user_id', user?.id)
        .order('week_start', { ascending: false });

      if (error) throw error;

      if (!campaignData || campaignData.length === 0) {
        // Se não houver dados, mostrar tudo zerado
        setWeeklyData([]);
        setMonthlyData([]);
        setMetrics({
          conversasIniciadas: 0,
          custoPorConversa: 0,
          alcanceTotal: 0,
          orcamentoRestante: 0
        });
        setLoading(false);
        return;
      }

      // Processar dados para gráficos diários (últimos 7 registros)
      const last7Days = campaignData.slice(0, 7);
      const weeklyChartData: ChartData[] = last7Days.map((item, index) => ({
        name: ['Dom', 'Seg', 'Ter', 'Qua', 'Qui', 'Sex', 'Sab'][index % 7],
        conversas: item.conversations_started || 0,
        custo: parseFloat(item.amount_spent?.toString() || '0'),
        alcance: item.reach || 0
      })).reverse();

      // Processar dados mensais (agrupar por semana)
      const weeklyGroups: { [key: string]: any[] } = {};
      campaignData.forEach(item => {
        const weekKey = item.week_start?.toString() || 'unknown';
        if (!weeklyGroups[weekKey]) {
          weeklyGroups[weekKey] = [];
        }
        weeklyGroups[weekKey].push(item);
      });

      const monthlyChartData: ChartData[] = Object.entries(weeklyGroups)
        .slice(0, 4)
        .map(([week, items], index) => ({
          name: `Sem ${index + 1}`,
          conversas: items.reduce((sum, item) => sum + (item.conversations_started || 0), 0),
          custo: items.reduce((sum, item) => sum + parseFloat(item.amount_spent?.toString() || '0'), 0),
          alcance: items.reduce((sum, item) => sum + (item.reach || 0), 0)
        }));

      // Calcular métricas totais
      const totalConversas = campaignData.reduce((sum, item) => sum + (item.conversations_started || 0), 0);
      const totalGasto = campaignData.reduce((sum, item) => sum + parseFloat(item.amount_spent?.toString() || '0'), 0);
      const totalAlcance = campaignData.reduce((sum, item) => sum + (item.reach || 0), 0);
      const custoPorConversa = totalConversas > 0 ? totalGasto / totalConversas : 0;

      setWeeklyData(weeklyChartData);
      setMonthlyData(monthlyChartData);
      setMetrics({
        conversasIniciadas: totalConversas,
        custoPorConversa: custoPorConversa,
        alcanceTotal: totalAlcance,
        orcamentoRestante: 0 // Este valor pode ser configurado depois
      });
    } catch (error: any) {
      toast({
        title: "Erro ao carregar dados",
        description: error.message,
        variant: "destructive"
      });
    } finally {
      setLoading(false);
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
            <div className="text-2xl font-bold">{metrics.conversasIniciadas}</div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">
              Custo por Conversa
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              R$ {metrics.custoPorConversa.toFixed(2)}
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">
              Alcance Total
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {metrics.alcanceTotal >= 1000 
                ? `${(metrics.alcanceTotal / 1000).toFixed(1)}K` 
                : metrics.alcanceTotal}
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">
              Orçamento Restante
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">R$ {metrics.orcamentoRestante.toFixed(2)}</div>
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