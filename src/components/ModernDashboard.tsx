import { Card } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, LineChart, Line, Area, AreaChart } from 'recharts';
import { Calendar } from "@/components/ui/calendar";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Button } from "@/components/ui/button";
import { CalendarIcon, TrendingUp, TrendingDown, Activity, DollarSign, Users, MousePointer } from "lucide-react";
import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import { format } from "date-fns";
import { ptBR } from "date-fns/locale";
import { cn } from "@/lib/utils";

interface CampaignData {
  campaign_name: string;
  reach: number;
  impressions: number;
  frequency: number;
  results: number;
  cost_per_result: number;
  amount_spent: number;
  cpm: number;
  link_clicks: number;
  cpc: number;
  ctr: number;
  conversations_started: number;
  cost_per_conversation: number;
  report_date: string;
  report_type: string;
}

interface ModernDashboardProps {
  userId: string;
  isAdmin?: boolean;
}

export default function ModernDashboard({ userId, isAdmin = false }: ModernDashboardProps) {
  const { toast } = useToast();
  const [loading, setLoading] = useState(true);
  const [selectedDate, setSelectedDate] = useState<Date>();
  const [reportType, setReportType] = useState<'weekly' | 'monthly' | 'daily'>('weekly');
  const [campaignData, setCampaignData] = useState<CampaignData[]>([]);
  const [nameMappings, setNameMappings] = useState<Record<string, string>>({});

  useEffect(() => {
    loadData();
    loadNameMappings();
  }, [userId, reportType, selectedDate]);

  const loadNameMappings = async () => {
    const { data } = await supabase
      .from('campaign_name_mappings')
      .select('original_name, display_name')
      .eq('user_id', userId);
    
    if (data) {
      const mappings: Record<string, string> = {};
      data.forEach(m => {
        mappings[m.original_name] = m.display_name;
      });
      setNameMappings(mappings);
    }
  };

  const loadData = async () => {
    try {
      setLoading(true);
      
      let query = supabase
        .from('campaign_data')
        .select('*')
        .eq('user_id', userId)
        .eq('report_type', reportType);

      if (selectedDate) {
        const dateStr = format(selectedDate, 'yyyy-MM-dd');
        query = query.eq('report_date', dateStr);
      }

      const { data, error } = await query.order('report_date', { ascending: false });

      if (error) throw error;
      
      setCampaignData(data || []);
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

  const getDisplayName = (originalName: string) => {
    return nameMappings[originalName] || originalName;
  };

  // Calcular métricas agregadas
  const metrics = {
    totalConversations: campaignData.reduce((sum, c) => sum + (c.conversations_started || 0), 0),
    totalSpent: campaignData.reduce((sum, c) => sum + (c.amount_spent || 0), 0),
    totalReach: campaignData.reduce((sum, c) => sum + (c.reach || 0), 0),
    totalImpressions: campaignData.reduce((sum, c) => sum + (c.impressions || 0), 0),
    totalClicks: campaignData.reduce((sum, c) => sum + (c.link_clicks || 0), 0),
    avgCostPerConversation: 0,
    avgCPC: 0,
    avgCTR: 0
  };

  metrics.avgCostPerConversation = metrics.totalConversations > 0 
    ? metrics.totalSpent / metrics.totalConversations 
    : 0;
  
  metrics.avgCPC = metrics.totalClicks > 0 
    ? metrics.totalSpent / metrics.totalClicks 
    : 0;

  metrics.avgCTR = metrics.totalImpressions > 0
    ? (metrics.totalClicks / metrics.totalImpressions) * 100
    : 0;

  // Preparar dados para gráficos
  const chartData = campaignData.map(c => ({
    name: getDisplayName(c.campaign_name),
    conversas: c.conversations_started || 0,
    investimento: c.amount_spent || 0,
    alcance: c.reach || 0,
    impressoes: c.impressions || 0,
    cliques: c.link_clicks || 0
  }));

  const MetricCard = ({ 
    title, 
    value, 
    icon: Icon, 
    trend, 
    trendValue 
  }: { 
    title: string; 
    value: string | number; 
    icon: any; 
    trend?: 'up' | 'down'; 
    trendValue?: string 
  }) => (
    <Card className="relative overflow-hidden border border-primary/20 bg-gradient-to-br from-background via-background to-primary/5">
      <div className="absolute inset-0 bg-grid-white/[0.02] bg-[size:20px_20px]" />
      <div className="absolute -top-24 -right-24 w-48 h-48 bg-primary/10 rounded-full blur-3xl" />
      <div className="relative p-6">
        <div className="flex items-center justify-between mb-4">
          <div className="p-3 rounded-xl bg-gradient-to-br from-primary/20 to-primary/5 backdrop-blur-sm border border-primary/20">
            <Icon className="h-5 w-5 text-primary" />
          </div>
          {trend && (
            <div className={cn(
              "flex items-center gap-1 px-2 py-1 rounded-full text-xs font-semibold backdrop-blur-sm",
              trend === 'up' 
                ? 'bg-green-500/10 text-green-400 border border-green-500/20' 
                : 'bg-red-500/10 text-red-400 border border-red-500/20'
            )}>
              {trend === 'up' ? <TrendingUp className="h-3 w-3" /> : <TrendingDown className="h-3 w-3" />}
              {trendValue}
            </div>
          )}
        </div>
        <div>
          <p className="text-sm text-muted-foreground mb-1 font-medium">{title}</p>
          <p className="text-3xl font-bold bg-gradient-to-r from-foreground to-foreground/70 bg-clip-text text-transparent">{value}</p>
        </div>
      </div>
    </Card>
  );

  return (
    <div className="space-y-6">
      {/* Header com seleção de período */}
      <div className="flex flex-col sm:flex-row gap-4 items-start sm:items-center justify-between">
        <div>
          <h2 className="text-3xl font-bold bg-gradient-to-r from-primary via-purple-500 to-pink-500 bg-clip-text text-transparent">
            Dashboard de Performance
          </h2>
          <p className="text-sm text-muted-foreground mt-1 font-medium">
            Análise em tempo real das suas campanhas de tráfego pago
          </p>
        </div>
        
        <div className="flex gap-2">
          <Tabs value={reportType} onValueChange={(v: any) => setReportType(v)} className="w-auto">
            <TabsList className="bg-background/50 backdrop-blur-sm border border-primary/20">
              <TabsTrigger value="weekly" className="data-[state=active]:bg-primary/20">Semanal</TabsTrigger>
              <TabsTrigger value="monthly" className="data-[state=active]:bg-primary/20">Mensal</TabsTrigger>
              {isAdmin && <TabsTrigger value="daily" className="data-[state=active]:bg-primary/20">Diário</TabsTrigger>}
            </TabsList>
          </Tabs>

          <Popover>
            <PopoverTrigger asChild>
              <Button variant="outline" className="bg-background/50 backdrop-blur-sm border-primary/20 hover:border-primary/40">
                <CalendarIcon className="mr-2 h-4 w-4" />
                {selectedDate ? format(selectedDate, "PPP", { locale: ptBR }) : "Selecionar período"}
              </Button>
            </PopoverTrigger>
            <PopoverContent className="w-auto p-0 border-primary/20">
              <Calendar
                mode="single"
                selected={selectedDate}
                onSelect={setSelectedDate}
                initialFocus
                className="pointer-events-auto"
              />
            </PopoverContent>
          </Popover>
        </div>
      </div>

      {/* Métricas principais */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <MetricCard
          title="Total de Conversas"
          value={metrics.totalConversations}
          icon={Activity}
        />
        <MetricCard
          title="Custo por Conversa"
          value={`R$ ${metrics.avgCostPerConversation.toFixed(2)}`}
          icon={DollarSign}
        />
        <MetricCard
          title="Alcance Total"
          value={metrics.totalReach >= 1000 ? `${(metrics.totalReach / 1000).toFixed(1)}K` : metrics.totalReach}
          icon={Users}
        />
        <MetricCard
          title="Taxa de Cliques"
          value={`${metrics.avgCTR.toFixed(2)}%`}
          icon={MousePointer}
        />
      </div>

      {/* Gráficos */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card className="border border-primary/20 bg-gradient-to-br from-background via-background to-primary/5 backdrop-blur-sm">
          <div className="p-6">
            <h3 className="text-lg font-semibold mb-4 bg-gradient-to-r from-primary to-purple-500 bg-clip-text text-transparent">Conversas por Campanha</h3>
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={chartData}>
                <defs>
                  <linearGradient id="conversasGradient" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="0%" stopColor="hsl(var(--primary))" stopOpacity={0.8}/>
                    <stop offset="100%" stopColor="hsl(var(--primary))" stopOpacity={0.2}/>
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke="#334155" />
                <XAxis dataKey="name" stroke="#94a3b8" />
                <YAxis stroke="#94a3b8" />
                <Tooltip 
                  contentStyle={{ 
                    backgroundColor: '#1e293b', 
                    border: '1px solid #334155',
                    borderRadius: '8px'
                  }}
                />
                <Bar dataKey="conversas" fill="url(#conversasGradient)" radius={[8, 8, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </Card>

        <Card className="border border-primary/20 bg-gradient-to-br from-background via-background to-primary/5 backdrop-blur-sm">
          <div className="p-6">
            <h3 className="text-lg font-semibold mb-4 bg-gradient-to-r from-primary to-purple-500 bg-clip-text text-transparent">Investimento vs Alcance</h3>
            <ResponsiveContainer width="100%" height={300}>
              <AreaChart data={chartData}>
                <defs>
                  <linearGradient id="investimentoGradient" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="0%" stopColor="#10b981" stopOpacity={0.8}/>
                    <stop offset="100%" stopColor="#10b981" stopOpacity={0.1}/>
                  </linearGradient>
                  <linearGradient id="alcanceGradient" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="0%" stopColor="#8b5cf6" stopOpacity={0.8}/>
                    <stop offset="100%" stopColor="#8b5cf6" stopOpacity={0.1}/>
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke="#334155" />
                <XAxis dataKey="name" stroke="#94a3b8" />
                <YAxis stroke="#94a3b8" />
                <Tooltip 
                  contentStyle={{ 
                    backgroundColor: '#1e293b', 
                    border: '1px solid #334155',
                    borderRadius: '8px'
                  }}
                />
                <Area 
                  type="monotone" 
                  dataKey="investimento" 
                  stroke="#10b981" 
                  fill="url(#investimentoGradient)" 
                />
                <Area 
                  type="monotone" 
                  dataKey="alcance" 
                  stroke="#8b5cf6" 
                  fill="url(#alcanceGradient)" 
                />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </Card>

        <Card className="border border-primary/20 bg-gradient-to-br from-background via-background to-primary/5 backdrop-blur-sm lg:col-span-2">
          <div className="p-6">
            <h3 className="text-lg font-semibold mb-4 bg-gradient-to-r from-primary to-purple-500 bg-clip-text text-transparent">Performance Geral</h3>
            <ResponsiveContainer width="100%" height={300}>
              <LineChart data={chartData}>
                <CartesianGrid strokeDasharray="3 3" stroke="#334155" />
                <XAxis dataKey="name" stroke="#94a3b8" />
                <YAxis stroke="#94a3b8" />
                <Tooltip 
                  contentStyle={{ 
                    backgroundColor: '#1e293b', 
                    border: '1px solid #334155',
                    borderRadius: '8px'
                  }}
                />
                <Line 
                  type="monotone" 
                  dataKey="impressoes" 
                  stroke="#3b82f6" 
                  strokeWidth={2}
                  dot={{ fill: '#3b82f6', r: 4 }}
                />
                <Line 
                  type="monotone" 
                  dataKey="cliques" 
                  stroke="#f59e0b" 
                  strokeWidth={2}
                  dot={{ fill: '#f59e0b', r: 4 }}
                />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </Card>
      </div>

      {/* Tabela de campanhas */}
      <Card className="border border-primary/20 bg-gradient-to-br from-background via-background to-primary/5 backdrop-blur-sm">
        <div className="p-6">
          <h3 className="text-lg font-semibold mb-4 bg-gradient-to-r from-primary to-purple-500 bg-clip-text text-transparent">Detalhes das Campanhas</h3>
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-primary/20">
                  <th className="text-left p-3 text-sm font-semibold text-muted-foreground">Campanha</th>
                  <th className="text-right p-3 text-sm font-semibold text-muted-foreground">Conversas</th>
                  <th className="text-right p-3 text-sm font-semibold text-muted-foreground">Custo/Conversa</th>
                  <th className="text-right p-3 text-sm font-semibold text-muted-foreground">Investimento</th>
                  <th className="text-right p-3 text-sm font-semibold text-muted-foreground">Alcance</th>
                </tr>
              </thead>
              <tbody>
                {campaignData.map((campaign, idx) => (
                  <tr key={idx} className="border-b border-primary/10 hover:bg-primary/5 transition-colors">
                    <td className="p-3 text-sm font-medium">{getDisplayName(campaign.campaign_name)}</td>
                    <td className="p-3 text-sm text-right font-semibold text-primary">{campaign.conversations_started || 0}</td>
                    <td className="p-3 text-sm text-right font-medium">
                      R$ {(campaign.cost_per_conversation || 0).toFixed(2)}
                    </td>
                    <td className="p-3 text-sm text-right font-medium">
                      R$ {(campaign.amount_spent || 0).toFixed(2)}
                    </td>
                    <td className="p-3 text-sm text-right">
                      {campaign.reach >= 1000 ? `${(campaign.reach / 1000).toFixed(1)}K` : campaign.reach}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </Card>
    </div>
  );
}