import { useState, useEffect } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, LineChart, Line } from 'recharts';
import { supabase } from "@/integrations/supabase/client";
import { useNavigate, useSearchParams } from "react-router-dom";

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
  const [users, setUsers] = useState<UserProfile[]>([]);
  const [selectedUserId, setSelectedUserId] = useState<string>(searchParams.get('user') || "");
  const [campaignData, setCampaignData] = useState<CampaignData[]>([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    loadUsers();
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
      const { data } = await supabase
        .from('profiles')
        .select('user_id, full_name, company')
        .order('full_name');

      setUsers(data || []);
    } catch (error) {
      console.error('Error loading users:', error);
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

  return (
    <div className="container mx-auto p-6">
      <div className="mb-8">
        <h1 className="text-3xl font-bold mb-2">Painel Administrativo</h1>
        <p className="text-muted-foreground">Visão geral de dados reais dos clientes</p>
      </div>

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