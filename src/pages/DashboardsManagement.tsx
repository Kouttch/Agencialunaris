import { useState, useEffect } from "react";
import { useSearchParams } from "react-router-dom";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { supabase } from "@/integrations/supabase/client";
import { useUserRole } from "@/hooks/useUserRole";
import { useToast } from "@/hooks/use-toast";
import { format, startOfWeek, endOfWeek, startOfMonth, endOfMonth } from "date-fns";

interface UserProfile {
  user_id: string;
  full_name: string;
  company: string;
}

interface CampaignData {
  conversations_started: number;
  cost_per_conversation: number;
  reach: number;
  impressions: number;
  frequency: number;
  amount_spent: number;
}

export default function DashboardsManagement() {
  const { isAdmin, isModerator } = useUserRole();
  const { toast } = useToast();
  const [searchParams, setSearchParams] = useSearchParams();
  const [users, setUsers] = useState<UserProfile[]>([]);
  const [selectedUserId, setSelectedUserId] = useState<string>(searchParams.get('user') || "");
  const [weeklyData, setWeeklyData] = useState<CampaignData | null>(null);
  const [monthlyData, setMonthlyData] = useState<CampaignData | null>(null);
  const [dailyData, setDailyData] = useState<CampaignData | null>(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    loadUsers();
  }, []);

  useEffect(() => {
    if (selectedUserId) {
      setSearchParams({ user: selectedUserId });
      loadUserData(selectedUserId);
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

      const { data, error } = await query.order('full_name');

      if (error) throw error;

      if (data && rolesData) {
        const rolesMap = new Map(rolesData.map(r => [r.user_id, r.role]));
        const clientUsers = data.filter(profile => 
          rolesMap.get(profile.user_id) === 'user'
        );
        setUsers(clientUsers);
      }
    } catch (error) {
      console.error('Error loading users:', error);
      toast({
        title: "Erro",
        description: "Não foi possível carregar os usuários",
        variant: "destructive",
      });
    }
  };

  const loadUserData = async (userId: string) => {
    setLoading(true);
    try {
      const now = new Date();
      
      // Weekly data
      const weekStart = startOfWeek(now, { weekStartsOn: 1 });
      const weekEnd = endOfWeek(now, { weekStartsOn: 1 });
      
      const { data: weekData } = await supabase
        .from('campaign_data')
        .select('*')
        .eq('user_id', userId)
        .gte('week_start', format(weekStart, 'yyyy-MM-dd'))
        .lte('week_end', format(weekEnd, 'yyyy-MM-dd'));

      // Monthly data
      const monthStart = startOfMonth(now);
      const monthEnd = endOfMonth(now);
      
      const { data: monthData } = await supabase
        .from('campaign_data')
        .select('*')
        .eq('user_id', userId)
        .gte('week_start', format(monthStart, 'yyyy-MM-dd'))
        .lte('week_end', format(monthEnd, 'yyyy-MM-dd'));

      // Daily data (only for admins)
      if (isAdmin) {
        const today = format(now, 'yyyy-MM-dd');
        const { data: dayData } = await supabase
          .from('campaign_data')
          .select('*')
          .eq('user_id', userId)
          .eq('week_start', today);

        if (dayData && dayData.length > 0) {
          setDailyData(aggregateData(dayData));
        } else {
          setDailyData(null);
        }
      }

      if (weekData) setWeeklyData(aggregateData(weekData));
      if (monthData) setMonthlyData(aggregateData(monthData));
      
    } catch (error) {
      console.error('Error loading user data:', error);
      toast({
        title: "Erro",
        description: "Não foi possível carregar os dados do usuário",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const aggregateData = (data: any[]): CampaignData => {
    return data.reduce((acc, curr) => ({
      conversations_started: acc.conversations_started + (curr.conversations_started || 0),
      cost_per_conversation: acc.cost_per_conversation + (curr.cost_per_conversation || 0),
      reach: acc.reach + (curr.reach || 0),
      impressions: acc.impressions + (curr.impressions || 0),
      frequency: acc.frequency + (curr.frequency || 0),
      amount_spent: acc.amount_spent + (curr.amount_spent || 0),
    }), {
      conversations_started: 0,
      cost_per_conversation: 0,
      reach: 0,
      impressions: 0,
      frequency: 0,
      amount_spent: 0,
    });
  };

  const renderDataRow = (label: string, value: string | number) => (
    <TableRow>
      <TableCell className="font-medium">{label}</TableCell>
      <TableCell className="text-right">{value}</TableCell>
    </TableRow>
  );

  return (
    <div className="container mx-auto p-6">
      <div className="mb-8">
        <h1 className="text-3xl font-bold mb-2">Gerenciamento de Dashboards</h1>
        <p className="text-muted-foreground">
          Gerencie os dados dos dashboards que serão exibidos aos clientes
        </p>
      </div>

      {/* Client Selection */}
      <Card className="mb-6">
        <CardHeader>
          <CardTitle>Selecionar Cliente</CardTitle>
          <CardDescription>
            Escolha um cliente para visualizar os dados do dashboard
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Select value={selectedUserId} onValueChange={setSelectedUserId}>
            <SelectTrigger className="max-w-sm">
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
        </CardContent>
      </Card>

      {/* Client Dashboard Data */}
      {selectedUserId && (
        <Card>
          <CardHeader>
            <CardTitle>
              Dashboard do Cliente
            </CardTitle>
            <CardDescription>
              Visualize os dados do dashboard do cliente
            </CardDescription>
          </CardHeader>
          <CardContent>
            {loading ? (
              <div className="text-center py-8">Carregando dados...</div>
            ) : (
              <Tabs defaultValue="weekly" className="space-y-4">
                <TabsList>
                  <TabsTrigger value="weekly">Dados Semanais</TabsTrigger>
                  <TabsTrigger value="monthly">Dados Mensais</TabsTrigger>
                  {isAdmin && <TabsTrigger value="daily">Dados Diários</TabsTrigger>}
                </TabsList>

                <TabsContent value="weekly">
                  {weeklyData ? (
                    <Table>
                      <TableHeader>
                        <TableRow>
                          <TableHead>Métrica</TableHead>
                          <TableHead className="text-right">Valor</TableHead>
                        </TableRow>
                      </TableHeader>
                      <TableBody>
                        {renderDataRow("Conversas Iniciadas", weeklyData.conversations_started)}
                        {renderDataRow("Custo por Conversa", `R$ ${weeklyData.cost_per_conversation.toFixed(2)}`)}
                        {renderDataRow("Alcance", weeklyData.reach.toLocaleString())}
                        {renderDataRow("Impressões", weeklyData.impressions.toLocaleString())}
                        {renderDataRow("Frequência", weeklyData.frequency.toFixed(2))}
                        {renderDataRow("Valor Investido", `R$ ${weeklyData.amount_spent.toFixed(2)}`)}
                      </TableBody>
                    </Table>
                  ) : (
                    <p className="text-center text-muted-foreground py-8">Nenhum dado semanal disponível</p>
                  )}
                </TabsContent>

                <TabsContent value="monthly">
                  {monthlyData ? (
                    <Table>
                      <TableHeader>
                        <TableRow>
                          <TableHead>Métrica</TableHead>
                          <TableHead className="text-right">Valor</TableHead>
                        </TableRow>
                      </TableHeader>
                      <TableBody>
                        {renderDataRow("Conversas Iniciadas", monthlyData.conversations_started)}
                        {renderDataRow("Custo por Conversa", `R$ ${monthlyData.cost_per_conversation.toFixed(2)}`)}
                        {renderDataRow("Alcance", monthlyData.reach.toLocaleString())}
                        {renderDataRow("Impressões", monthlyData.impressions.toLocaleString())}
                        {renderDataRow("Frequência", monthlyData.frequency.toFixed(2))}
                        {renderDataRow("Valor Investido", `R$ ${monthlyData.amount_spent.toFixed(2)}`)}
                      </TableBody>
                    </Table>
                  ) : (
                    <p className="text-center text-muted-foreground py-8">Nenhum dado mensal disponível</p>
                  )}
                </TabsContent>

                {isAdmin && (
                  <TabsContent value="daily">
                    {dailyData ? (
                      <Table>
                        <TableHeader>
                          <TableRow>
                            <TableHead>Métrica</TableHead>
                            <TableHead className="text-right">Valor</TableHead>
                          </TableRow>
                        </TableHeader>
                        <TableBody>
                          {renderDataRow("Conversas Iniciadas", dailyData.conversations_started)}
                          {renderDataRow("Custo por Conversa", `R$ ${dailyData.cost_per_conversation.toFixed(2)}`)}
                          {renderDataRow("Alcance", dailyData.reach.toLocaleString())}
                          {renderDataRow("Impressões", dailyData.impressions.toLocaleString())}
                          {renderDataRow("Frequência", dailyData.frequency.toFixed(2))}
                          {renderDataRow("Valor Investido", `R$ ${dailyData.amount_spent.toFixed(2)}`)}
                        </TableBody>
                      </Table>
                    ) : (
                      <p className="text-center text-muted-foreground py-8">Nenhum dado diário disponível para hoje</p>
                    )}
                  </TabsContent>
                )}
              </Tabs>
            )}
          </CardContent>
        </Card>
      )}
    </div>
  );
}