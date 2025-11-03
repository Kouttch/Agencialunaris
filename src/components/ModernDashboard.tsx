import { Card } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, LineChart, Line, Area, AreaChart } from 'recharts';
import { Calendar } from "@/components/ui/calendar";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Button } from "@/components/ui/button";
import { CalendarIcon, TrendingUp, TrendingDown, MessageSquare, CircleDollarSign, UserCheck, Wallet, Radio, Sparkles, BarChart3, Banknote } from "lucide-react";
import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import { format, startOfWeek, endOfWeek, startOfMonth, endOfMonth, isWithinInterval, isSameMonth, isSameWeek } from "date-fns";
import { ptBR } from "date-fns/locale";
import { cn } from "@/lib/utils";

interface CampaignData {
  campaign_name: string;
  reach: number;
  impressions: number;
  frequency: number;
  conversas_iniciadas: number;
  cpc_conv: number;
  profile_visits: number;
  cpc_visit: number;
  spend: number;
  date_start: string;
  date_stop: string;
  report_type: string;
}

interface ModernDashboardProps {
  userId: string;
  isAdmin?: boolean;
  isModerator?: boolean;
}

export default function ModernDashboard({ userId, isAdmin = false, isModerator = false }: ModernDashboardProps) {
  const { toast } = useToast();
  const [loading, setLoading] = useState(true);
  const [selectedDate, setSelectedDate] = useState<Date>();
  const [reportType, setReportType] = useState<'weekly' | 'monthly'>('weekly');
  const [campaignData, setCampaignData] = useState<CampaignData[]>([]);
  const [nameMappings, setNameMappings] = useState<Record<string, string>>({});
  const [availableDates, setAvailableDates] = useState<Date[]>([]);

  useEffect(() => {
    loadAvailableDates();
    loadNameMappings();
  }, [userId, reportType]);

  useEffect(() => {
    loadData();
  }, [userId, reportType, selectedDate, availableDates]);

  const loadAvailableDates = async () => {
    try {
      // Get account_id for this user
      const { data: mappingData } = await supabase
        .from('meta_account_mappings')
        .select('account_id')
        .eq('user_id', userId)
        .single();

      if (!mappingData) {
        setAvailableDates([]);
        return;
      }

      // Get all unique dates from reports
      const { data, error } = await supabase
        .from('meta_reports')
        .select('date_start, date_stop')
        .eq('account_id', mappingData.account_id)
        .eq('report_type', reportType)
        .order('date_start', { ascending: false });

      if (error) throw error;

      if (data && data.length > 0) {
        const dates = data
          .map(d => new Date(d.date_start))
          .filter(d => !isNaN(d.getTime()));
        setAvailableDates(dates);
        
        // Se não há data selecionada, selecionar a mais recente
        if (!selectedDate && dates.length > 0) {
          setSelectedDate(dates[0]);
        }
      } else {
        setAvailableDates([]);
      }
    } catch (error: any) {
      console.error('Erro ao carregar datas disponíveis:', error);
    }
  };

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
      
      // Get account_id for this user
      const { data: mappingData } = await supabase
        .from('meta_account_mappings')
        .select('account_id')
        .eq('user_id', userId)
        .single();

      if (!mappingData) {
        setCampaignData([]);
        return;
      }

      let query = supabase
        .from('meta_reports')
        .select('*')
        .eq('account_id', mappingData.account_id)
        .eq('report_type', reportType);

      if (selectedDate) {
        // Filter by week or month depending on reportType
        if (reportType === 'weekly') {
          const weekStart = startOfWeek(selectedDate, { locale: ptBR });
          const weekEnd = endOfWeek(selectedDate, { locale: ptBR });
          query = query
            .gte('date_start', format(weekStart, 'yyyy-MM-dd'))
            .lte('date_start', format(weekEnd, 'yyyy-MM-dd'));
        } else if (reportType === 'monthly') {
          const monthStart = startOfMonth(selectedDate);
          const monthEnd = endOfMonth(selectedDate);
          query = query
            .gte('date_start', format(monthStart, 'yyyy-MM-dd'))
            .lte('date_start', format(monthEnd, 'yyyy-MM-dd'));
        }
      }

      const { data, error } = await query.order('date_start', { ascending: false });

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

  // Separar campanhas por tipo
  const performanceCampaigns = campaignData.filter(c => 
    c.profile_visits && c.profile_visits > 0
  );
  
  const conversationCampaigns = campaignData.filter(c => 
    c.conversas_iniciadas && c.conversas_iniciadas > 0
  );

  // Métricas gerais
  const metrics = {
    totalConversations: campaignData.reduce((sum, c) => sum + (c.conversas_iniciadas || 0), 0),
    totalProfileVisits: campaignData.reduce((sum, c) => sum + (c.profile_visits || 0), 0),
    totalReach: campaignData.reduce((sum, c) => sum + (c.reach || 0), 0),
    totalImpressions: campaignData.reduce((sum, c) => sum + (c.impressions || 0), 0),
    totalSpent: campaignData.reduce((sum, c) => sum + (c.spend || 0), 0),
    avgFrequency: 0,
    avgCostPerConversation: 0,
    avgCostPerVisit: 0
  };

  metrics.avgFrequency = campaignData.length > 0
    ? campaignData.reduce((sum, c) => sum + (c.frequency || 0), 0) / campaignData.length
    : 0;
    
  metrics.avgCostPerConversation = metrics.totalConversations > 0
    ? metrics.totalSpent / metrics.totalConversations
    : 0;
    
  metrics.avgCostPerVisit = metrics.totalProfileVisits > 0
    ? metrics.totalSpent / metrics.totalProfileVisits
    : 0;

  // Preparar dados para gráficos
  const chartData = campaignData.map(c => ({
    name: getDisplayName(c.campaign_name || 'Sem nome'),
    conversas: c.conversas_iniciadas || 0,
    visitas: c.profile_visits || 0,
    investimento: c.spend || 0,
    alcance: c.reach || 0,
    impressoes: c.impressions || 0
  }));

  const MetricCard = ({ 
    title, 
    value, 
    icon: Icon, 
    trend, 
    trendValue,
    gradientFrom,
    gradientTo,
    iconColor
  }: { 
    title: string; 
    value: string | number; 
    icon: any; 
    trend?: 'up' | 'down'; 
    trendValue?: string;
    gradientFrom: string;
    gradientTo: string;
    iconColor: string;
  }) => (
    <Card className="relative overflow-hidden border border-white/10 bg-gradient-to-br from-white/5 via-white/5 to-white/10 backdrop-blur-xl">
      <div className="absolute inset-0 bg-grid-white/[0.02] bg-[size:20px_20px]" />
      <div className={`absolute -top-24 -right-24 w-48 h-48 rounded-full blur-3xl ${gradientFrom}`} />
      <div className="relative p-6">
        <div className="flex items-center justify-between mb-4">
          <div className={`p-3 rounded-xl backdrop-blur-sm border border-white/20 ${gradientTo}`}>
            <Icon className={`h-5 w-5 ${iconColor}`} />
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
          <p className="text-3xl font-bold bg-gradient-to-r from-foreground to-foreground/70 bg-clip-text">{value}</p>
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
            <TabsList className="bg-white/5 backdrop-blur-xl border border-white/10">
              {(isAdmin || isModerator) && (
                <TabsTrigger value="daily" className="data-[state=active]:bg-white/10">Diário</TabsTrigger>
              )}
              <TabsTrigger value="weekly" className="data-[state=active]:bg-white/10">Semanal</TabsTrigger>
              <TabsTrigger value="monthly" className="data-[state=active]:bg-white/10">Mensal</TabsTrigger>
            </TabsList>
          </Tabs>

          <Popover>
            <PopoverTrigger asChild>
              <Button variant="outline" className="bg-white/5 backdrop-blur-xl border-white/10 hover:border-white/20">
                <CalendarIcon className="mr-2 h-4 w-4" />
                {selectedDate 
                  ? reportType === 'weekly'
                    ? `Semana de ${format(startOfWeek(selectedDate, { locale: ptBR }), "dd MMM", { locale: ptBR })}`
                    : format(selectedDate, "MMMM yyyy", { locale: ptBR })
                  : "Selecionar período"
                }
              </Button>
            </PopoverTrigger>
            <PopoverContent className="w-auto p-0 border-white/10 bg-background/95 backdrop-blur-xl">
              <div className="space-y-3 p-3">
                <Calendar
                  mode="single"
                  selected={selectedDate}
                  onSelect={setSelectedDate}
                  initialFocus
                  className="pointer-events-auto"
                  disabled={(date) => {
                    // Disable dates that don't have data
                    if (availableDates.length === 0) return true;
                    
                    if (reportType === 'weekly') {
                      // Check if any date in this week has data
                      return !availableDates.some(availableDate => 
                        isSameWeek(date, availableDate, { locale: ptBR })
                      );
                    } else if (reportType === 'monthly') {
                      // Check if any date in this month has data
                      return !availableDates.some(availableDate => 
                        isSameMonth(date, availableDate)
                      );
                    }
                    
                    return true;
                  }}
                />
                {reportType === 'monthly' && availableDates.length > 0 && (
                  <div className="border-t border-white/10 pt-3">
                    <p className="text-xs text-muted-foreground mb-2">Selecionar mês completo:</p>
                    <div className="flex flex-wrap gap-2">
                      {Array.from(new Set(availableDates.map(d => format(d, 'yyyy-MM')))).map(month => {
                        const monthDate = new Date(month + '-01');
                        const isSelected = selectedDate && isSameMonth(selectedDate, monthDate);
                        return (
                          <Button
                            key={month}
                            size="sm"
                            variant={isSelected ? "default" : "outline"}
                            onClick={() => setSelectedDate(monthDate)}
                            className="text-xs"
                          >
                            {format(monthDate, 'MMM yyyy', { locale: ptBR })}
                          </Button>
                        );
                      })}
                    </div>
                  </div>
                )}
              </div>
            </PopoverContent>
          </Popover>
        </div>
      </div>

      {/* Métricas principais */}
      <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-4 gap-4">
        <MetricCard
          title="Conversas Iniciadas"
          value={metrics.totalConversations}
          icon={MessageSquare}
          gradientFrom="bg-blue-500/20"
          gradientTo="bg-gradient-to-br from-blue-500/20 to-blue-600/10"
          iconColor="text-blue-400"
        />
        <MetricCard
          title="Custo por Conversa"
          value={`R$ ${metrics.avgCostPerConversation.toFixed(2)}`}
          icon={CircleDollarSign}
          gradientFrom="bg-emerald-500/20"
          gradientTo="bg-gradient-to-br from-emerald-500/20 to-emerald-600/10"
          iconColor="text-emerald-400"
        />
        <MetricCard
          title="Visitas ao Perfil"
          value={metrics.totalProfileVisits >= 1000 ? `${(metrics.totalProfileVisits / 1000).toFixed(1)}K` : metrics.totalProfileVisits}
          icon={UserCheck}
          gradientFrom="bg-purple-500/20"
          gradientTo="bg-gradient-to-br from-purple-500/20 to-purple-600/10"
          iconColor="text-purple-400"
        />
        <MetricCard
          title="Custo por Visita"
          value={`R$ ${metrics.avgCostPerVisit.toFixed(2)}`}
          icon={Wallet}
          gradientFrom="bg-amber-500/20"
          gradientTo="bg-gradient-to-br from-amber-500/20 to-amber-600/10"
          iconColor="text-amber-400"
        />
        <MetricCard
          title="Alcance"
          value={metrics.totalReach >= 1000 ? `${(metrics.totalReach / 1000).toFixed(1)}K` : metrics.totalReach}
          icon={Radio}
          gradientFrom="bg-cyan-500/20"
          gradientTo="bg-gradient-to-br from-cyan-500/20 to-cyan-600/10"
          iconColor="text-cyan-400"
        />
        <MetricCard
          title="Impressões"
          value={metrics.totalImpressions >= 1000 ? `${(metrics.totalImpressions / 1000).toFixed(1)}K` : metrics.totalImpressions}
          icon={Sparkles}
          gradientFrom="bg-pink-500/20"
          gradientTo="bg-gradient-to-br from-pink-500/20 to-pink-600/10"
          iconColor="text-pink-400"
        />
        <MetricCard
          title="Frequência"
          value={metrics.avgFrequency.toFixed(2)}
          icon={BarChart3}
          gradientFrom="bg-violet-500/20"
          gradientTo="bg-gradient-to-br from-violet-500/20 to-violet-600/10"
          iconColor="text-violet-400"
        />
        <MetricCard
          title="Valor Investido"
          value={`R$ ${metrics.totalSpent.toFixed(2)}`}
          icon={Banknote}
          gradientFrom="bg-green-500/20"
          gradientTo="bg-gradient-to-br from-green-500/20 to-green-600/10"
          iconColor="text-green-400"
        />
      </div>

      {/* Gráficos */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card className="border border-white/10 bg-gradient-to-br from-white/5 via-white/5 to-white/10 backdrop-blur-xl">
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
                <CartesianGrid strokeDasharray="3 3" stroke="#334155" opacity={0.1} />
                <XAxis dataKey="name" stroke="#94a3b8" fontSize={12} />
                <YAxis stroke="#94a3b8" fontSize={12} />
                <Tooltip 
                  contentStyle={{ 
                    backgroundColor: 'hsl(var(--background))', 
                    border: '1px solid rgba(255,255,255,0.1)',
                    borderRadius: '12px',
                    backdropFilter: 'blur(12px)'
                  }}
                />
                <Bar dataKey="conversas" fill="url(#conversasGradient)" radius={[8, 8, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </Card>

        <Card className="border border-white/10 bg-gradient-to-br from-white/5 via-white/5 to-white/10 backdrop-blur-xl">
          <div className="p-6">
            <h3 className="text-lg font-semibold mb-4 bg-gradient-to-r from-primary to-purple-500 bg-clip-text text-transparent">Investimento vs Alcance</h3>
            <ResponsiveContainer width="100%" height={300}>
              <AreaChart data={chartData}>
                <defs>
                  <linearGradient id="investimentoGradient" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="0%" stopColor="#10b981" stopOpacity={0.6}/>
                    <stop offset="100%" stopColor="#10b981" stopOpacity={0.1}/>
                  </linearGradient>
                  <linearGradient id="alcanceGradient" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="0%" stopColor="#8b5cf6" stopOpacity={0.6}/>
                    <stop offset="100%" stopColor="#8b5cf6" stopOpacity={0.1}/>
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke="#334155" opacity={0.1} />
                <XAxis dataKey="name" stroke="#94a3b8" fontSize={12} />
                <YAxis stroke="#94a3b8" fontSize={12} />
                <Tooltip 
                  contentStyle={{ 
                    backgroundColor: 'hsl(var(--background))', 
                    border: '1px solid rgba(255,255,255,0.1)',
                    borderRadius: '12px',
                    backdropFilter: 'blur(12px)'
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

        <Card className="border border-white/10 bg-gradient-to-br from-white/5 via-white/5 to-white/10 backdrop-blur-xl lg:col-span-2">
          <div className="p-6">
            <h3 className="text-lg font-semibold mb-4 bg-gradient-to-r from-primary to-purple-500 bg-clip-text text-transparent">Performance Geral</h3>
            <ResponsiveContainer width="100%" height={300}>
              <LineChart data={chartData}>
                <CartesianGrid strokeDasharray="3 3" stroke="#334155" opacity={0.1} />
                <XAxis dataKey="name" stroke="#94a3b8" fontSize={12} />
                <YAxis 
                  yAxisId="left" 
                  stroke="#94a3b8" 
                  fontSize={12}
                  label={{ 
                    value: 'Impressões/Alcance', 
                    angle: -90, 
                    position: 'insideLeft',
                    offset: 10,
                    style: { fill: '#94a3b8', textAnchor: 'middle' } 
                  }}
                />
                <YAxis 
                  yAxisId="right" 
                  orientation="right" 
                  stroke="#ec4899" 
                  fontSize={12}
                  domain={[0, 500]}
                  label={{ value: 'Conversas', angle: 90, position: 'insideRight', style: { fill: '#ec4899' } }}
                />
                <Tooltip 
                  contentStyle={{ 
                    backgroundColor: 'hsl(var(--background))', 
                    border: '1px solid rgba(255,255,255,0.1)',
                    borderRadius: '12px',
                    backdropFilter: 'blur(12px)'
                  }}
                />
                <Line 
                  yAxisId="right"
                  type="monotone" 
                  dataKey="conversas" 
                  stroke="#ec4899" 
                  strokeWidth={3}
                  dot={{ fill: '#ec4899', r: 5 }}
                  name="Conversas"
                />
                <Line 
                  yAxisId="left"
                  type="monotone" 
                  dataKey="impressoes" 
                  stroke="#3b82f6" 
                  strokeWidth={3}
                  dot={{ fill: '#3b82f6', r: 5 }}
                  name="Impressões"
                />
                <Line 
                  yAxisId="left"
                  type="monotone" 
                  dataKey="alcance" 
                  stroke="#10b981" 
                  strokeWidth={3}
                  dot={{ fill: '#10b981', r: 5 }}
                  name="Alcance"
                />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </Card>
      </div>

      {/* Tabelas de campanhas */}
      {conversationCampaigns.length > 0 && (
        <Card className="border border-white/10 bg-gradient-to-br from-white/5 via-white/5 to-white/10 backdrop-blur-xl">
          <div className="p-6">
            <div className="flex items-center gap-2 mb-4">
              <h3 className="text-lg font-semibold bg-gradient-to-r from-primary to-purple-500 bg-clip-text text-transparent">Campanhas de Conversas</h3>
              <span className="px-2 py-1 text-xs font-semibold bg-primary/10 text-primary rounded-full border border-primary/20">
                {conversationCampaigns.length} campanhas
              </span>
            </div>
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b border-white/10">
                    <th className="text-left p-3 text-sm font-semibold text-muted-foreground">Campanha</th>
                    <th className="text-right p-3 text-sm font-semibold text-muted-foreground">Conversas</th>
                    <th className="text-right p-3 text-sm font-semibold text-muted-foreground">Custo/Conversa</th>
                    <th className="text-right p-3 text-sm font-semibold text-muted-foreground">Alcance</th>
                    <th className="text-right p-3 text-sm font-semibold text-muted-foreground">Impressões</th>
                    <th className="text-right p-3 text-sm font-semibold text-muted-foreground">Investimento</th>
                  </tr>
                </thead>
                <tbody>
                  {conversationCampaigns.map((campaign, idx) => (
                    <tr key={idx} className="border-b border-white/5 hover:bg-white/5 transition-colors">
                      <td className="p-3 text-sm font-medium">{getDisplayName(campaign.campaign_name || 'Sem nome')}</td>
                      <td className="p-3 text-right text-sm">{campaign.conversas_iniciadas}</td>
                      <td className="p-3 text-right text-sm">R$ {campaign.cpc_conv?.toFixed(2) || '0.00'}</td>
                      <td className="p-3 text-right text-sm">{campaign.reach?.toLocaleString('pt-BR') || 0}</td>
                      <td className="p-3 text-right text-sm">{campaign.impressions?.toLocaleString('pt-BR') || 0}</td>
                      <td className="p-3 text-right text-sm font-semibold text-primary">R$ {campaign.spend?.toFixed(2) || '0.00'}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </Card>
      )}

      {performanceCampaigns.length > 0 && (
        <Card className="border border-white/10 bg-gradient-to-br from-white/5 via-white/5 to-white/10 backdrop-blur-xl">
          <div className="p-6">
            <div className="flex items-center gap-2 mb-4">
              <h3 className="text-lg font-semibold bg-gradient-to-r from-primary to-purple-500 bg-clip-text text-transparent">Campanhas de Desempenho</h3>
              <span className="px-2 py-1 text-xs font-semibold bg-primary/10 text-primary rounded-full border border-primary/20">
                {performanceCampaigns.length} campanhas
              </span>
            </div>
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b border-white/10">
                    <th className="text-left p-3 text-sm font-semibold text-muted-foreground">Campanha</th>
                    <th className="text-right p-3 text-sm font-semibold text-muted-foreground">Visitas Perfil</th>
                    <th className="text-right p-3 text-sm font-semibold text-muted-foreground">Custo/Visita</th>
                    <th className="text-right p-3 text-sm font-semibold text-muted-foreground">Alcance</th>
                    <th className="text-right p-3 text-sm font-semibold text-muted-foreground">Impressões</th>
                    <th className="text-right p-3 text-sm font-semibold text-muted-foreground">Investimento</th>
                  </tr>
                </thead>
                <tbody>
                  {performanceCampaigns.map((campaign, idx) => (
                    <tr key={idx} className="border-b border-white/5 hover:bg-white/5 transition-colors">
                      <td className="p-3 text-sm font-medium">{getDisplayName(campaign.campaign_name || 'Sem nome')}</td>
                      <td className="p-3 text-right text-sm">{campaign.profile_visits}</td>
                      <td className="p-3 text-right text-sm">R$ {campaign.cpc_visit?.toFixed(2) || '0.00'}</td>
                      <td className="p-3 text-right text-sm">{campaign.reach?.toLocaleString('pt-BR') || 0}</td>
                      <td className="p-3 text-right text-sm">{campaign.impressions?.toLocaleString('pt-BR') || 0}</td>
                      <td className="p-3 text-right text-sm font-semibold text-primary">R$ {campaign.spend?.toFixed(2) || '0.00'}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </Card>
      )}

      {campaignData.length === 0 && !loading && (
        <Card className="border border-white/10 bg-gradient-to-br from-white/5 via-white/5 to-white/10 backdrop-blur-xl">
          <div className="p-12 text-center">
            <p className="text-muted-foreground">Nenhum dado encontrado para o período selecionado</p>
          </div>
        </Card>
      )}
    </div>
  );
}
