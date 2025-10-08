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
import { useUserRole } from "@/hooks/useUserRole";
import ChecklistManagement from "./ChecklistManagement";
interface ChartData {
  name: string;
  conversas: number;
  custo: number;
  alcance: number;
}
export default function CustomerDashboard() {
  const { user } = useAuth();
  const { toast } = useToast();
  const { isAdmin, isModerator } = useUserRole();
  const [theme, setTheme] = useState<"light" | "dark">("dark");
  const [profileData, setProfileData] = useState({
    userName: "",
    companyName: "",
    avatarUrl: "",
    accountStatus: "active"
  });
  
  const [weeklyData, setWeeklyData] = useState<ChartData[]>([]);
  const [monthlyData, setMonthlyData] = useState<ChartData[]>([]);
  const [annualData, setAnnualData] = useState<ChartData[]>([]);
  const [metrics, setMetrics] = useState({
    conversasIniciadas: 0,
    custoPorConversa: 0,
    alcanceTotal: 0,
    impressoesTotais: 0,
    frequenciaMedia: 0
  });
  const [managerData, setManagerData] = useState({
    name: "",
    photoUrl: ""
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
        .select(`
          full_name, 
          company, 
          avatar_url,
          account_status,
          manager_id,
          account_managers (
            name,
            photo_url
          )
        `)
        .eq('user_id', user?.id)
        .single();

      if (profile) {
        setProfileData({
          userName: profile.full_name || "",
          companyName: profile.company || "",
          avatarUrl: profile.avatar_url || "",
          accountStatus: profile.account_status || "active"
        });

        // Load manager data
        if (profile.account_managers) {
          const manager = profile.account_managers as any;
          setManagerData({
            name: manager.name || "",
            photoUrl: manager.photo_url || ""
          });
        }
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
          impressoesTotais: 0,
          frequenciaMedia: 0
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

      // Processar dados anuais (agrupar por mês)
      const monthlyGroups: { [key: number]: any[] } = {};
      campaignData.forEach(item => {
        if (item.week_start) {
          const month = new Date(item.week_start).getMonth();
          if (!monthlyGroups[month]) {
            monthlyGroups[month] = [];
          }
          monthlyGroups[month].push(item);
        }
      });

      const monthNames = ['Jan', 'Fev', 'Mar', 'Abr', 'Mai', 'Jun', 'Jul', 'Ago', 'Set', 'Out', 'Nov', 'Dez'];
      const annualChartData: ChartData[] = Object.entries(monthlyGroups)
        .map(([month, items]) => ({
          name: monthNames[parseInt(month)],
          conversas: items.reduce((sum, item) => sum + (item.conversations_started || 0), 0),
          custo: items.reduce((sum, item) => sum + parseFloat(item.amount_spent?.toString() || '0'), 0),
          alcance: items.reduce((sum, item) => sum + (item.reach || 0), 0)
        }))
        .sort((a, b) => monthNames.indexOf(a.name) - monthNames.indexOf(b.name));

      // Calcular métricas totais
      const totalConversas = campaignData.reduce((sum, item) => sum + (item.conversations_started || 0), 0);
      const totalGasto = campaignData.reduce((sum, item) => sum + parseFloat(item.amount_spent?.toString() || '0'), 0);
      const totalAlcance = campaignData.reduce((sum, item) => sum + (item.reach || 0), 0);
      const totalImpressoes = campaignData.reduce((sum, item) => sum + (item.impressions || 0), 0);
      const custoPorConversa = totalConversas > 0 ? totalGasto / totalConversas : 0;
      const frequenciaMedia = campaignData.length > 0 
        ? campaignData.reduce((sum, item) => sum + (parseFloat(item.frequency?.toString() || '0')), 0) / campaignData.length 
        : 0;

      setWeeklyData(weeklyChartData);
      setMonthlyData(monthlyChartData);
      setAnnualData(annualChartData);
      setMetrics({
        conversasIniciadas: totalConversas,
        custoPorConversa: custoPorConversa,
        alcanceTotal: totalAlcance,
        impressoesTotais: totalImpressoes,
        frequenciaMedia: frequenciaMedia
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

  const isDeactivated = profileData.accountStatus !== 'active' && profileData.accountStatus !== 'pending';

  // Se for Admin ou Gestor, mostrar Checklist
  if (isAdmin || isModerator) {
    return (
      <div className="container mx-auto p-6 pb-24">
        <div className="mb-6">
          <h1 className="text-3xl font-bold mb-2">Checklist de Tarefas</h1>
          <p className="text-muted-foreground">Gerencie todas as tarefas e acompanhamento</p>
        </div>
        <ChecklistManagement />
      </div>
    );
  }

  return <div className="container mx-auto p-6 pb-24">
      <div className="mb-10">
        <h1 className="text-3xl font-bold mb-2">Minha Conta</h1>
        <p className="text-muted-foreground">Acompanhe o desempenho de suas campanhas</p>
      </div>

      {/* Dashboard content wrapper with blur when deactivated */}
      <div className="relative">
        {isDeactivated && (
          <div className="absolute inset-0 z-50 backdrop-blur-md bg-background/80 flex items-center justify-center rounded-lg min-h-[500px]">
            <div className="text-center space-y-2 p-8">
              <h2 className="text-3xl font-bold text-destructive">Dashboard Indisponível</h2>
              <p className="text-muted-foreground text-lg">
                {profileData.accountStatus === 'integration' 
                  ? 'Estamos construindo e ajustando o seu acesso.'
                  : 'Sua conta está desativada. Entre em contato com o suporte.'}
              </p>
            </div>
          </div>
        )}

        {/* Key Metrics Cards */}
        <div className={`grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8 ${isDeactivated ? 'pointer-events-none select-none' : ''}`}>
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
              Impressões Totais
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {metrics.impressoesTotais >= 1000 
                ? `${(metrics.impressoesTotais / 1000).toFixed(1)}K` 
                : metrics.impressoesTotais}
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">
              Frequência Média
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{metrics.frequenciaMedia.toFixed(2)}</div>
          </CardContent>
        </Card>
      </div>

      {/* Dashboard Charts */}
      <Tabs defaultValue="weekly" className="space-y-4">
        <div className="flex items-center gap-3 mb-4">
          <TabsList>
            <TabsTrigger value="weekly">Semanal</TabsTrigger>
            <TabsTrigger value="monthly">Mensal</TabsTrigger>
            <TabsTrigger value="annual">Anual</TabsTrigger>
          </TabsList>
          
          {managerData.name && (
            <div className="flex items-center gap-3 px-4 py-2 border rounded-lg bg-card">
              <div className="flex items-center gap-2">
                <Info className="h-4 w-4 text-muted-foreground" />
                <span className="text-sm font-medium">Gestor Responsável:</span>
              </div>
              <div className="flex items-center gap-2">
                {managerData.photoUrl && (
                  <img 
                    src={managerData.photoUrl} 
                    alt={managerData.name}
                    className="h-8 w-8 rounded-full object-cover"
                  />
                )}
                <span className="text-sm font-semibold">{managerData.name}</span>
              </div>
            </div>
          )}
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

        <TabsContent value="annual" className="space-y-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <Card>
              <CardHeader>
                <CardTitle>Conversas por Mês</CardTitle>
                <CardDescription>Últimos 12 meses</CardDescription>
              </CardHeader>
              <CardContent>
                <ResponsiveContainer width="100%" height={300}>
                  <BarChart data={annualData}>
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
                <CardTitle>Alcance por Mês</CardTitle>
                <CardDescription>Últimos 12 meses</CardDescription>
              </CardHeader>
              <CardContent>
                <ResponsiveContainer width="100%" height={300}>
                  <LineChart data={annualData}>
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
      </div>

      {/* Theme Toggle Button */}
      <Button onClick={toggleTheme} size="icon" variant="outline" className="fixed bottom-6 right-6 z-50 h-12 w-12 rounded-full shadow-lg mx-0 px-0">
        {theme === "dark" ? <Sun className="h-5 w-5" /> : <Moon className="h-5 w-5" />}
      </Button>

      {/* Customer Avatar */}
      <CustomerAvatar 
        userName={profileData.userName} 
        companyName={profileData.companyName}
        avatarUrl={profileData.avatarUrl}
        accountStatus={profileData.accountStatus}
      />
    </div>;
}