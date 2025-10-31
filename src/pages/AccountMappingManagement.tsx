import { useState, useEffect } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Plus, Trash2 } from "lucide-react";

interface AccountMapping {
  id: string;
  account_id: string;
  user_id: string;
  account_name: string | null;
  user_name: string;
  company: string;
}

interface UserProfile {
  user_id: string;
  full_name: string;
  company: string;
}

interface UnmappedAccount {
  account_id: string;
  campaign_count: number;
  report_type: string;
}

export default function AccountMappingManagement() {
  const { toast } = useToast();
  const [mappings, setMappings] = useState<AccountMapping[]>([]);
  const [unmappedAccounts, setUnmappedAccounts] = useState<UnmappedAccount[]>([]);
  const [users, setUsers] = useState<UserProfile[]>([]);
  const [selectedAccountId, setSelectedAccountId] = useState("");
  const [selectedUserId, setSelectedUserId] = useState("");
  const [accountName, setAccountName] = useState("");
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    await Promise.all([loadMappings(), loadUnmappedAccounts(), loadUsers()]);
  };

  const loadMappings = async () => {
    const { data: mappingsData } = await supabase
      .from('meta_account_mappings')
      .select(`
        id,
        account_id,
        user_id,
        account_name
      `);

    if (!mappingsData) return;

    // Get user profiles for each mapping
    const userIds = mappingsData.map(m => m.user_id);
    const { data: profilesData } = await supabase
      .from('profiles')
      .select('user_id, full_name, company')
      .in('user_id', userIds);

    const mappingsWithUsers = mappingsData.map(mapping => {
      const profile = profilesData?.find(p => p.user_id === mapping.user_id);
      return {
        ...mapping,
        user_name: profile?.full_name || 'Sem nome',
        company: profile?.company || '-'
      };
    });

    setMappings(mappingsWithUsers);
  };

  const loadUnmappedAccounts = async () => {
    // Get all account_ids from meta_reports
    const { data: reportsData } = await supabase
      .from('meta_reports')
      .select('account_id, report_type');

    if (!reportsData) return;

    // Get mapped account_ids
    const { data: mappedData } = await supabase
      .from('meta_account_mappings')
      .select('account_id');

    const mappedAccountIds = new Set(mappedData?.map(m => m.account_id) || []);

    // Find unmapped accounts
    const accountCounts = new Map<string, { count: number; reportType: string }>();
    reportsData.forEach(report => {
      if (!mappedAccountIds.has(report.account_id)) {
        const current = accountCounts.get(report.account_id) || { count: 0, reportType: report.report_type || '-' };
        accountCounts.set(report.account_id, { 
          count: current.count + 1, 
          reportType: current.reportType 
        });
      }
    });

    const unmapped = Array.from(accountCounts.entries()).map(([account_id, data]) => ({
      account_id,
      campaign_count: data.count,
      report_type: data.reportType
    }));

    setUnmappedAccounts(unmapped);
  };

  const loadUsers = async () => {
    const { data: profilesData } = await supabase
      .from('profiles')
      .select('user_id, full_name, company')
      .order('full_name');

    if (!profilesData) return;

    const { data: rolesData } = await supabase
      .from('user_roles')
      .select('user_id, role')
      .in('user_id', profilesData.map(p => p.user_id));

    const regularUsers = profilesData.filter(profile => {
      const userRole = rolesData?.find(r => r.user_id === profile.user_id);
      return userRole?.role === 'user';
    });

    setUsers(regularUsers);
  };

  const handleCreateMapping = async () => {
    if (!selectedAccountId || !selectedUserId) {
      toast({
        title: "Campos obrigatórios",
        description: "Selecione uma conta e um cliente",
        variant: "destructive"
      });
      return;
    }

    setLoading(true);
    try {
      const { error } = await supabase
        .from('meta_account_mappings')
        .insert({
          account_id: selectedAccountId,
          user_id: selectedUserId,
          account_name: accountName || null
        });

      if (error) throw error;

      toast({
        title: "Conta vinculada com sucesso",
        description: "O cliente agora tem acesso aos dados desta conta"
      });

      setSelectedAccountId("");
      setSelectedUserId("");
      setAccountName("");
      loadData();
    } catch (error: any) {
      toast({
        title: "Erro ao vincular conta",
        description: error.message,
        variant: "destructive"
      });
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteMapping = async (id: string) => {
    try {
      const { error } = await supabase
        .from('meta_account_mappings')
        .delete()
        .eq('id', id);

      if (error) throw error;

      toast({
        title: "Vínculo removido",
        description: "A conta foi desvinculada do cliente"
      });

      loadData();
    } catch (error: any) {
      toast({
        title: "Erro ao remover vínculo",
        description: error.message,
        variant: "destructive"
      });
    }
  };

  return (
    <div className="container mx-auto p-6 pb-24">
      <div className="mb-10">
        <h1 className="text-3xl font-bold mb-2">Gerenciar Contas Meta</h1>
        <p className="text-muted-foreground">
          Vincule contas do Meta Ads aos clientes para exibir seus dashboards
        </p>
      </div>

      {/* Create new mapping */}
      <Card className="mb-8 border-primary/20 bg-gradient-to-br from-background via-background to-primary/5">
        <CardHeader>
          <CardTitle>Vincular Nova Conta</CardTitle>
          <CardDescription>
            Associe uma conta Meta a um cliente específico
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <Label>Conta não vinculada</Label>
            <Select value={selectedAccountId} onValueChange={setSelectedAccountId}>
              <SelectTrigger>
                <SelectValue placeholder="Escolha uma conta" />
              </SelectTrigger>
              <SelectContent>
                {unmappedAccounts.map((account) => (
                  <SelectItem key={account.account_id} value={account.account_id}>
                    {account.account_id} ({account.campaign_count} campanhas - {account.report_type})
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            {unmappedAccounts.length === 0 && (
              <p className="text-xs text-muted-foreground">
                Todas as contas já estão vinculadas
              </p>
            )}
          </div>

          <div className="space-y-2">
            <Label>Nome da conta (opcional)</Label>
            <Input
              placeholder="Ex: Meta Ads - Empresa X"
              value={accountName}
              onChange={(e) => setAccountName(e.target.value)}
            />
          </div>

          <div className="space-y-2">
            <Label>Cliente</Label>
            <Select value={selectedUserId} onValueChange={setSelectedUserId}>
              <SelectTrigger>
                <SelectValue placeholder="Escolha um cliente" />
              </SelectTrigger>
              <SelectContent>
                {users.map((user) => (
                  <SelectItem key={user.user_id} value={user.user_id}>
                    {user.full_name || user.company || 'Sem nome'}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <Button 
            onClick={handleCreateMapping} 
            disabled={loading || !selectedAccountId || !selectedUserId}
            className="w-full"
          >
            <Plus className="h-4 w-4 mr-2" />
            Criar Vínculo
          </Button>
        </CardContent>
      </Card>

      {/* Current mappings */}
      <Card className="border-primary/20 bg-gradient-to-br from-background via-background to-primary/5">
        <CardHeader>
          <CardTitle>Contas Vinculadas</CardTitle>
          <CardDescription>Gerenciar vínculos existentes entre contas e clientes</CardDescription>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Account ID</TableHead>
                <TableHead>Nome da Conta</TableHead>
                <TableHead>Cliente</TableHead>
                <TableHead>Empresa</TableHead>
                <TableHead className="w-[100px]">Ações</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {mappings.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={5} className="text-center text-muted-foreground">
                    Nenhuma conta vinculada
                  </TableCell>
                </TableRow>
              ) : (
                mappings.map((mapping) => (
                  <TableRow key={mapping.id}>
                    <TableCell className="font-mono text-xs">{mapping.account_id}</TableCell>
                    <TableCell>{mapping.account_name || '-'}</TableCell>
                    <TableCell>{mapping.user_name}</TableCell>
                    <TableCell>{mapping.company}</TableCell>
                    <TableCell>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => handleDeleteMapping(mapping.id)}
                      >
                        <Trash2 className="h-4 w-4 text-destructive" />
                      </Button>
                    </TableCell>
                  </TableRow>
                ))
              )}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  );
}
