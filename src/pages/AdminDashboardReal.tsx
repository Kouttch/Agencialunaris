import { useState, useEffect } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, LineChart, Line, PieChart, Pie, Cell, Legend } from 'recharts';
import { supabase } from "@/integrations/supabase/client";
import { useNavigate, useSearchParams } from "react-router-dom";
import { useUserRole } from "@/hooks/useUserRole";

interface UserProfile {
  user_id: string;
  full_name: string;
  company: string;
}

interface CampaignData {
  campaign_name: string;
  conversations_started: number;
  cost_per_conversation: number;
  reach: number;
  impressions: number;
  frequency: number;
  amount_spent: number;
  week_start: string;
}

export default function AdminDashboard() {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const { isModerator } = useUserRole();
  const [users, setUsers] = useState<UserProfile[]>([]);
  const [selectedUserId, setSelectedUserId] = useState<string>(searchParams.get('user') || "");
  const [campaignData, setCampaignData] = useState<CampaignData[]>([]);
  const [loading, setLoading] = useState(false);
  const [clientStatusData, setClientStatusData] = useState<any[]>([]);

  useEffect(() => {
    loadUsers();
    loadClientStatusStats();
  }, []);

  useEffect(() => {
    if (selectedUserId) {
      loadCampaignData(selectedUserId);
    } else {
      setCampaignData([]);
    }
  }, [selectedUserId]);

  const loadUsers = async () => {
    try {
      const { data: authData } = await supabase.auth.getUser();
      const { data: rolesData } = await supabase
        .from('user_roles')
        .select('user_id, role');

      let query = supabase
        .from('profiles')
        .select('user_id, full_name, company');

      // Se for moderador, filtrar apenas clientes gerenciados
      if (isModerator && authData.user) {
        query = query.eq('manager_id', authData.user.id);
      }

      const { data } = await query.order('full_name');

      if (data && rolesData) {
        const rolesMap = new Map(rolesData.map(r => [r.user_id, r.role]));
        const clientUsers = data.filter(profile => 
          rolesMap.get(profile.user_id) === 'user'
        );
        setUsers(clientUsers);
      }
    } catch (error) {
      console.error('Error loading users:', error);
    }
  };

  const loadClientStatusStats = async () => {
    try {
      const { data } = await supabase
        .from('profiles')
        .select('account_status');

      if (data) {
        const statusCounts = data.reduce((acc: any, profile) => {
          const status = profile.account_status || 'active';
          acc[status] = (acc[status] || 0) + 1;
          return acc;
        }, {});

        const COLORS = {
          active: '#22c55e',
          disabled: '#ef4444',
          integration: '#f97316',
          pending: '#3b82f6'
        };

        const pieData = Object.entries(statusCounts).map(([status, count]) => ({
          name: status === 'active' ? 'Ativo' : 
                status === 'disabled' ? 'Desativado' : 
                status === 'integration' ? 'Integração' : 'Pendente',
          value: count,
          color: COLORS[status as keyof typeof COLORS]
        }));

        setClientStatusData(pieData);
      }
    } catch (error) {
      console.error('Error loading client status stats:', error);
    }
  };

  const loadCampaignData = async (userId: string) => {
    setLoading(true);
    try {
      const { data } = await supabase
        .from('campaign_data')
        .select('*')
        .eq('user_id', userId)
        .order('week_start', { ascending: true });

      setCampaignData(data || []);
    } catch (error) {
      console.error('Error loading campaign data:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleViewUserDashboard = () => {
    if (selectedUserId) {
      navigate(`/fulladmin/dashboards?user=${selectedUserId}`);
    }
  };

  // Calculate aggregated metrics
  const totalConversations = campaignData.reduce((sum, d) => sum + (d.conversations_started || 0), 0);
  const totalReach = campaignData.reduce((sum, d) => sum + (d.reach || 0), 0);
  const totalImpressions = campaignData.reduce((sum, d) => sum + (d.impressions || 0), 0);
  const totalSpent = campaignData.reduce((sum, d) => sum + (d.amount_spent || 0), 0);
  const avgCostPerConversation = totalConversations > 0 ? totalSpent / totalConversations : 0;
  const avgFrequency = campaignData.length > 0 
    ? campaignData.reduce((sum, d) => sum + (d.frequency || 0), 0) / campaignData.length 
    : 0;

  const selectedUser = users.find(u => u.user_id === selectedUserId);

  // Performance calculations
  const calculatePerformance = () => {
    if (campaignData.length === 0) return null;
    
    // Calculate weekly average metrics
    const weeklyAvgConversations = totalConversations / campaignData.length;
    const weeklyAvgReach = totalReach / campaignData.length;
    const weeklyAvgCost = avgCostPerConversation;
    
    // Define performance thresholds
    const performanceScore = 
      (weeklyAvgConversations > 50 ? 1 : 0) +
      (weeklyAvgReach > 5000 ? 1 : 0) +
      (weeklyAvgCost < 5 ? 1 : 0) +
      (avgFrequency > 2 ? 1 : 0);
    
    const performance = performanceScore >= 3 ? 'high' : performanceScore >= 2 ? 'medium' : 'low';
    
    return {
      level: performance,
      score: performanceScore,
      label: performance === 'high' ? 'Alto Desempenho' : 
             performance === 'medium' ? 'Médio Desempenho' : 'Baixo Desempenho',
      color: performance === 'high' ? 'text-green-500' : 
             performance === 'medium' ? 'text-yellow-500' : 'text-red-500',
      bgColor: performance === 'high' ? 'bg-green-500/10 border-green-500/20' : 
               performance === 'medium' ? 'bg-yellow-500/10 border-yellow-500/20' : 'bg-red-500/10 border-red-500/20'
    };
  };

  const performanceData = calculatePerformance();

  return (
    <div className="container mx-auto p-6">
      <div className="mb-8">
        <h1 className="text-3xl font-bold mb-2">Painel Administrativo</h1>
        <p className="text-muted-foreground">Visão geral de dados reais dos clientes</p>
      </div>

      {/* Client Status Overview */}
      <Card className="mb-8">
        <CardHeader>
          <CardTitle>Distribuição de Status dos Clientes</CardTitle>
          <CardDescription>
            Visão geral dos status de todas as contas
          </CardDescription>
        </CardHeader>
        <CardContent>
          <ResponsiveContainer width="100%" height={300}>
            <PieChart>
              <Pie
                data={clientStatusData}
                cx="50%"
                cy="50%"
                labelLine={false}
                label={({ name, percent }) => `${name}: ${(percent * 100).toFixed(0)}%`}
                outerRadius={100}
                fill="#8884d8"
                dataKey="value"
              >
                {clientStatusData.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={entry.color} />
                ))}
              </Pie>
              <Tooltip />
              <Legend />
            </PieChart>
          </ResponsiveContainer>
        </CardContent>
      </Card>

      {/* User Dashboard Access */}
      <Card className="mb-8">
        <CardHeader>
          <CardTitle>Selecionar Cliente</CardTitle>
          <CardDescription>
            Selecione um cliente para visualizar seus dados em tempo real
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex gap-4">
            <Select value={selectedUserId} onValueChange={setSelectedUserId}>
              <SelectTrigger className="flex-1 max-w-sm">
                <SelectValue placeholder="Selecione um cliente..." />
              </SelectTrigger>
              <SelectContent>
                {users.map((user) => (
                  <SelectItem key={user.user_id} value={user.user_id}>
                    {user.full_name} {user.company ? `- ${user.company}` : ''}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            <Button 
              onClick={handleViewUserDashboard} 
              disabled={!selectedUserId}
            >
              Visualizar Dashboard Completo
            </Button>
          </div>
        </CardContent>
      </Card>

      {selectedUserId ? (
        <>
          {selectedUser && (
            <div className="mb-6">
              <div className="flex items-center justify-between">
                <div>
                  <h2 className="text-2xl font-bold">
                    {selectedUser.full_name}
                    {selectedUser.company && ` - ${selectedUser.company}`}
                  </h2>
                  <p className="text-muted-foreground">
                    {campaignData.length > 0 
                      ? `${campaignData.length} campanhas encontradas`
                      : 'Nenhuma campanha encontrada'
                    }
                  </p>
                </div>
                {performanceData && (
                  <Card className={`${performanceData.bgColor} border-2`}>
                    <CardContent className="pt-6">
                      <div className="text-center">
                        <p className="text-sm text-muted-foreground mb-1">Status de Desempenho</p>
                        <p className={`text-2xl font-bold ${performanceData.color}`}>
                          {performanceData.label}
                        </p>
                        <p className="text-xs text-muted-foreground mt-2">
                          Pontuação: {performanceData.score}/4
                        </p>
                      </div>
                    </CardContent>
                  </Card>
                )}
              </div>
            </div>
          )}

          {loading ? (
            <div className="text-center py-12">
              <p className="text-muted-foreground">Carregando dados...</p>
            </div>
          ) : campaignData.length === 0 ? (
            <Card>
              <CardContent className="py-12">
                <p className="text-center text-muted-foreground">
                  Nenhum dado de campanha encontrado para este cliente
                </p>
              </CardContent>
            </Card>
          ) : (
            <>
              {/* Key Metrics Cards */}
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
                <Card>
                  <CardHeader className="pb-2">
                    <CardTitle className="text-sm font-medium text-muted-foreground">
                      Conversas Iniciadas
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="text-2xl font-bold">{totalConversations.toLocaleString('pt-BR')}</div>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader className="pb-2">
                    <CardTitle className="text-sm font-medium text-muted-foreground">
                      Custo Médio por Conversa
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="text-2xl font-bold">
                      R$ {avgCostPerConversation.toFixed(2)}
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
                      {(totalReach / 1000).toFixed(1)}K
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
                      {(totalImpressions / 1000).toFixed(1)}K
                    </div>
                  </CardContent>
                </Card>
              </div>

              {/* Additional Metrics */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
                <Card>
                  <CardHeader className="pb-2">
                    <CardTitle className="text-sm font-medium text-muted-foreground">
                      Frequência Média
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="text-2xl font-bold">{avgFrequency.toFixed(2)}</div>
                    <p className="text-xs text-muted-foreground mt-1">vezes por usuário</p>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader className="pb-2">
                    <CardTitle className="text-sm font-medium text-muted-foreground">
                      Orçamento Diário Médio
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="text-2xl font-bold">
                      R$ {(totalSpent / (campaignData.length || 1)).toFixed(2)}
                    </div>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader className="pb-2">
                    <CardTitle className="text-sm font-medium text-muted-foreground">
                      Valor Total Investido
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="text-2xl font-bold">
                      R$ {(totalSpent / 1000).toFixed(1)}K
                    </div>
                  </CardContent>
                </Card>
              </div>

              {/* Charts Section */}
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
                <Card>
                  <CardHeader>
                    <CardTitle>Conversas por Período</CardTitle>
                    <CardDescription>Evolução ao longo do tempo</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <ResponsiveContainer width="100%" height={300}>
                      <BarChart data={campaignData}>
                        <CartesianGrid strokeDasharray="3 3" />
                        <XAxis 
                          dataKey="week_start" 
                          tickFormatter={(value) => new Date(value).toLocaleDateString('pt-BR', { month: 'short', day: 'numeric' })}
                        />
                        <YAxis />
                        <Tooltip />
                        <Bar dataKey="conversations_started" fill="hsl(var(--primary))" name="Conversas" />
                      </BarChart>
                    </ResponsiveContainer>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader>
                    <CardTitle>Alcance e Impressões</CardTitle>
                    <CardDescription>Comparativo ao longo do tempo</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <ResponsiveContainer width="100%" height={300}>
                      <LineChart data={campaignData}>
                        <CartesianGrid strokeDasharray="3 3" />
                        <XAxis 
                          dataKey="week_start"
                          tickFormatter={(value) => new Date(value).toLocaleDateString('pt-BR', { month: 'short', day: 'numeric' })}
                        />
                        <YAxis />
                        <Tooltip />
                        <Line type="monotone" dataKey="reach" stroke="hsl(var(--primary))" strokeWidth={2} name="Alcance" />
                        <Line type="monotone" dataKey="impressions" stroke="hsl(var(--chart-2))" strokeWidth={2} name="Impressões" />
                      </LineChart>
                    </ResponsiveContainer>
                  </CardContent>
                </Card>
              </div>

              {/* Campaign List */}
              <Card>
                <CardHeader>
                  <CardTitle>Campanhas</CardTitle>
                  <CardDescription>
                    Lista de todas as campanhas do cliente
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {campaignData.map((campaign, idx) => (
                      <div key={idx} className="border rounded-lg p-4">
                        <h3 className="font-semibold mb-2">{campaign.campaign_name}</h3>
                        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
                          <div>
                            <p className="text-muted-foreground">Conversas</p>
                            <p className="font-medium">{campaign.conversations_started}</p>
                          </div>
                          <div>
                            <p className="text-muted-foreground">Custo/Conv</p>
                            <p className="font-medium">R$ {campaign.cost_per_conversation?.toFixed(2) || '0.00'}</p>
                          </div>
                          <div>
                            <p className="text-muted-foreground">Alcance</p>
                            <p className="font-medium">{campaign.reach?.toLocaleString('pt-BR') || 0}</p>
                          </div>
                          <div>
                            <p className="text-muted-foreground">Investido</p>
                            <p className="font-medium">R$ {campaign.amount_spent?.toFixed(2) || '0.00'}</p>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </>
          )}
        </>
      ) : (
        <Card>
          <CardContent className="py-12">
            <p className="text-center text-muted-foreground">
              Selecione um cliente para visualizar os dados
            </p>
          </CardContent>
        </Card>
      )}
    </div>
  );
}