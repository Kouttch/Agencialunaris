import { useState, useEffect } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { supabase } from "@/integrations/supabase/client";
import { useUserRole } from "@/hooks/useUserRole";
import { useToast } from "@/hooks/use-toast";
import { Trash2, Plus } from "lucide-react";
import { Alert, AlertDescription } from "@/components/ui/alert";

interface UserProfile {
  user_id: string;
  full_name: string;
  company: string;
}

interface Dashboard {
  id: string;
  dashboard_name: string;
  sheet_url: string;
  created_at: string;
}

export default function UserDashboardsManagement() {
  const { isAdmin, isModerator } = useUserRole();
  const { toast } = useToast();
  const [users, setUsers] = useState<UserProfile[]>([]);
  const [selectedUserId, setSelectedUserId] = useState<string>("");
  const [dashboards, setDashboards] = useState<Dashboard[]>([]);
  const [newDashboard, setNewDashboard] = useState({ name: "", url: "" });
  const [loading, setLoading] = useState(false);
  const [syncing, setSyncing] = useState<string | null>(null);

  useEffect(() => {
    loadUsers();
  }, []);

  useEffect(() => {
    if (selectedUserId) {
      loadDashboards(selectedUserId);
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

  const loadDashboards = async (userId: string) => {
    setLoading(true);
    try {
      const { data, error } = await supabase
        .from('user_dashboards')
        .select('*')
        .eq('user_id', userId)
        .order('created_at', { ascending: false });

      if (error) throw error;
      setDashboards(data || []);
    } catch (error) {
      console.error('Error loading dashboards:', error);
      toast({
        title: "Erro",
        description: "Não foi possível carregar os dashboards",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const handleAddDashboard = async () => {
    if (!selectedUserId || !newDashboard.name || !newDashboard.url) {
      toast({
        title: "Erro",
        description: "Preencha todos os campos",
        variant: "destructive",
      });
      return;
    }

    try {
      const { data: authData } = await supabase.auth.getUser();
      
      const { error } = await supabase
        .from('user_dashboards')
        .insert({
          user_id: selectedUserId,
          dashboard_name: newDashboard.name,
          sheet_url: newDashboard.url,
          created_by: authData.user?.id
        });

      if (error) throw error;

      toast({
        title: "Sucesso",
        description: "Dashboard adicionado com sucesso",
      });

      setNewDashboard({ name: "", url: "" });
      loadDashboards(selectedUserId);
    } catch (error) {
      console.error('Error adding dashboard:', error);
      toast({
        title: "Erro",
        description: "Não foi possível adicionar o dashboard",
        variant: "destructive",
      });
    }
  };

  const handleDeleteDashboard = async (dashboardId: string) => {
    if (!confirm('Tem certeza que deseja excluir este dashboard?')) return;

    try {
      const { error } = await supabase
        .from('user_dashboards')
        .delete()
        .eq('id', dashboardId);

      if (error) throw error;

      toast({
        title: "Sucesso",
        description: "Dashboard excluído com sucesso",
      });

      loadDashboards(selectedUserId);
    } catch (error) {
      console.error('Error deleting dashboard:', error);
      toast({
        title: "Erro",
        description: "Não foi possível excluir o dashboard",
        variant: "destructive",
      });
    }
  };

  const handleSyncDashboard = async (dashboard: Dashboard) => {
    setSyncing(dashboard.id);
    try {
      const { error } = await supabase.functions.invoke('sync-google-sheets', {
        body: {
          userId: selectedUserId,
          sheetUrl: dashboard.sheet_url,
          dashboardId: dashboard.id
        }
      });

      if (error) throw error;

      toast({
        title: "Sucesso",
        description: "Sincronização iniciada com sucesso",
      });
    } catch (error) {
      console.error('Error syncing dashboard:', error);
      toast({
        title: "Erro",
        description: "Não foi possível sincronizar o dashboard",
        variant: "destructive",
      });
    } finally {
      setSyncing(null);
    }
  };

  return (
    <div className="container mx-auto p-6 space-y-6">
      <div className="mb-8">
        <h1 className="text-3xl font-bold mb-2">Gerenciar Dashboards dos Clientes</h1>
        <p className="text-muted-foreground">
          Configure múltiplos dashboards para cada cliente
        </p>
      </div>

      <Alert>
        <AlertDescription>
          Para validar corretamente, é necessário que o link no Google Sheets esteja público
        </AlertDescription>
      </Alert>

      {/* Client Selection */}
      <Card>
        <CardHeader>
          <CardTitle>Selecionar Cliente</CardTitle>
          <CardDescription>
            Escolha um cliente para gerenciar seus dashboards
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

      {selectedUserId && (
        <>
          {/* Add New Dashboard */}
          <Card>
            <CardHeader>
              <CardTitle>Adicionar Novo Dashboard</CardTitle>
              <CardDescription>
                Configure um novo dashboard para o cliente
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="dashboard-name">Nome do Dashboard</Label>
                  <Input
                    id="dashboard-name"
                    placeholder="Ex: Meta Ads, Google Ads..."
                    value={newDashboard.name}
                    onChange={(e) => setNewDashboard({ ...newDashboard, name: e.target.value })}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="sheet-url">URL do Google Sheets</Label>
                  <Input
                    id="sheet-url"
                    placeholder="https://docs.google.com/spreadsheets/d/..."
                    value={newDashboard.url}
                    onChange={(e) => setNewDashboard({ ...newDashboard, url: e.target.value })}
                  />
                </div>
              </div>
              <Button onClick={handleAddDashboard}>
                <Plus className="mr-2 h-4 w-4" />
                Adicionar Dashboard
              </Button>
            </CardContent>
          </Card>

          {/* Dashboards List */}
          <Card>
            <CardHeader>
              <CardTitle>Dashboards Configurados</CardTitle>
              <CardDescription>
                Lista de dashboards do cliente
              </CardDescription>
            </CardHeader>
            <CardContent>
              {loading ? (
                <div className="text-center py-8">Carregando...</div>
              ) : dashboards.length === 0 ? (
                <div className="text-center py-8 text-muted-foreground">
                  Nenhum dashboard configurado para este cliente
                </div>
              ) : (
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Nome</TableHead>
                      <TableHead>URL</TableHead>
                      <TableHead>Data de Criação</TableHead>
                      <TableHead className="text-right">Ações</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {dashboards.map((dashboard) => (
                      <TableRow key={dashboard.id}>
                        <TableCell className="font-medium">
                          {dashboard.dashboard_name}
                        </TableCell>
                        <TableCell>
                          <a 
                            href={dashboard.sheet_url}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="text-primary hover:underline truncate block max-w-md"
                          >
                            {dashboard.sheet_url}
                          </a>
                        </TableCell>
                        <TableCell>
                          {new Date(dashboard.created_at).toLocaleDateString('pt-BR')}
                        </TableCell>
                        <TableCell className="text-right space-x-2">
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => handleSyncDashboard(dashboard)}
                            disabled={syncing === dashboard.id}
                          >
                            {syncing === dashboard.id ? 'Sincronizando...' : 'Sincronizar'}
                          </Button>
                          <Button
                            variant="destructive"
                            size="sm"
                            onClick={() => handleDeleteDashboard(dashboard.id)}
                          >
                            <Trash2 className="h-4 w-4" />
                          </Button>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              )}
            </CardContent>
          </Card>
        </>
      )}
    </div>
  );
}