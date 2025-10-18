import { useState, useEffect } from "react";
import { useSearchParams } from "react-router-dom";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, LineChart, Line } from 'recharts';
import { supabase } from "@/integrations/supabase/client";
import { ArrowLeft } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router-dom";

interface CampaignData {
  id: string;
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
  cost_per_conversation: number | null;
  conversations_started: number | null;
  week_start: string;
  week_end: string;
}

interface UserProfile {
  full_name: string;
  company: string;
}

export default function ClientDashboardView() {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const userId = searchParams.get('user');
  
  const [campaignData, setCampaignData] = useState<CampaignData[]>([]);
  const [userProfile, setUserProfile] = useState<UserProfile | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (userId) {
      loadData();
    }
  }, [userId]);

  const loadData = async () => {
    setLoading(true);
    try {
      // Load user profile
      const { data: profileData } = await supabase
        .from('profiles')
        .select('full_name, company')
        .eq('user_id', userId)
        .single();

      setUserProfile(profileData);

      // Load campaign data
      const { data: campaigns } = await supabase
        .from('campaign_data')
        .select('*')
        .eq('user_id', userId)
        .order('week_start', { ascending: true });

      setCampaignData(campaigns || []);
    } catch (error) {
      console.error('Error loading data:', error);
    } finally {
      setLoading(false);
    }
  };

  // Calculate metrics
  const totalConversations = campaignData.reduce((sum, d) => sum + (d.conversations_started || 0), 0);
  const totalReach = campaignData.reduce((sum, d) => sum + (d.reach || 0), 0);
  const totalImpressions = campaignData.reduce((sum, d) => sum + (d.impressions || 0), 0);
  const totalSpent = campaignData.reduce((sum, d) => sum + (d.amount_spent || 0), 0);
  const totalClicks = campaignData.reduce((sum, d) => sum + (d.link_clicks || 0), 0);
  const avgCostPerConversation = totalConversations > 0 ? totalSpent / totalConversations : 0;
  const avgCostPerClick = totalClicks > 0 ? totalSpent / totalClicks : 0;

  // Group campaigns by name and aggregate data
  const groupedCampaigns = campaignData.reduce((acc, campaign) => {
    const existing = acc.find(c => c.campaign_name === campaign.campaign_name);
    if (existing) {
      existing.reach += campaign.reach;
      existing.impressions += campaign.impressions;
      existing.amount_spent += campaign.amount_spent;
      existing.link_clicks += campaign.link_clicks;
      existing.conversations_started = (existing.conversations_started || 0) + (campaign.conversations_started || 0);
    } else {
      acc.push({ ...campaign });
    }
    return acc;
  }, [] as CampaignData[]);

  if (!userId) {
    return (
      <div className="container mx-auto p-6">
        <Card>
          <CardContent className="py-12">
            <p className="text-center text-muted-foreground">
              Nenhum usuário selecionado
            </p>
          </CardContent>
        </Card>
      </div>
    );
  }

  if (loading) {
    return (
      <div className="container mx-auto p-6">
        <div className="text-center py-12">
          <p className="text-muted-foreground">Carregando dados...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto p-6 pb-24">
      <div className="mb-8">
        <Button
          variant="ghost"
          onClick={() => navigate('/fulladmin')}
          className="mb-4"
        >
          <ArrowLeft className="mr-2 h-4 w-4" />
          Voltar
        </Button>
        
        <h1 className="text-3xl font-bold mb-2">
          Dashboard de {userProfile?.full_name}
        </h1>
        {userProfile?.company && (
          <p className="text-muted-foreground">{userProfile.company}</p>
        )}
      </div>

      {campaignData.length === 0 ? (
        <Card>
          <CardContent className="py-12">
            <p className="text-center text-muted-foreground">
              Nenhum dado de campanha encontrado para este cliente. 
              {' '}Certifique-se de que a planilha do Google Sheets está pública e foi sincronizada corretamente.
            </p>
          </CardContent>
        </Card>
      ) : (
        <>
          {/* Key Metrics */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-sm font-medium text-muted-foreground">
                  Total de Conversas
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{totalConversations.toLocaleString('pt-BR')}</div>
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
                  Valor Total Investido
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">
                  R$ {totalSpent.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Additional Metrics */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
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

            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-sm font-medium text-muted-foreground">
                  Cliques Totais
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">
                  {totalClicks.toLocaleString('pt-BR')}
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-sm font-medium text-muted-foreground">
                  Custo por Clique
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">
                  R$ {avgCostPerClick.toFixed(2)}
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Charts */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
            <Card>
              <CardHeader>
                <CardTitle>Conversas por Período</CardTitle>
                <CardDescription>Evolução semanal</CardDescription>
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
                <CardDescription>Comparativo semanal</CardDescription>
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

            <Card>
              <CardHeader>
                <CardTitle>Investimento por Período</CardTitle>
                <CardDescription>Valor gasto semanalmente</CardDescription>
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
                    <Tooltip 
                      formatter={(value: number) => `R$ ${value.toFixed(2)}`}
                    />
                    <Bar dataKey="amount_spent" fill="hsl(var(--chart-3))" name="Investimento" />
                  </BarChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Cliques por Período</CardTitle>
                <CardDescription>Evolução de cliques</CardDescription>
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
                    <Line type="monotone" dataKey="link_clicks" stroke="hsl(var(--chart-4))" strokeWidth={2} name="Cliques" />
                  </LineChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>
          </div>

          {/* Campaigns Summary */}
          <Card>
            <CardHeader>
              <CardTitle>Resumo por Campanha</CardTitle>
              <CardDescription>
                Dados agregados das campanhas com mesmo nome
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {groupedCampaigns.map((campaign, idx) => (
                  <div key={idx} className="border rounded-lg p-4">
                    <h3 className="font-semibold mb-3">{campaign.campaign_name}</h3>
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
                      <div>
                        <p className="text-muted-foreground">Conversas</p>
                        <p className="font-medium">{campaign.conversations_started || 0}</p>
                      </div>
                      <div>
                        <p className="text-muted-foreground">Alcance</p>
                        <p className="font-medium">{campaign.reach.toLocaleString('pt-BR')}</p>
                      </div>
                      <div>
                        <p className="text-muted-foreground">Cliques</p>
                        <p className="font-medium">{campaign.link_clicks}</p>
                      </div>
                      <div>
                        <p className="text-muted-foreground">Investimento</p>
                        <p className="font-medium">R$ {campaign.amount_spent.toFixed(2)}</p>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </>
      )}
    </div>
  );
}
