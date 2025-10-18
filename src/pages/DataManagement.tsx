import { useState, useEffect } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";
import { Loader2, Link as LinkIcon, User } from "lucide-react";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";

interface Manager {
  id: string;
  name: string;
  photo_url: string | null;
  email?: string;
  role?: string;
}

interface UserProfile {
  user_id: string;
  full_name: string;
  company: string;
}

export default function DataManagement() {
  const { toast } = useToast();
  const [loading, setLoading] = useState(false);
  const [selectedUserId, setSelectedUserId] = useState("");
  const [sheetUrl, setSheetUrl] = useState("");
  const [users, setUsers] = useState<UserProfile[]>([]);
  const [managers, setManagers] = useState<Manager[]>([]);

  useEffect(() => {
    loadUsers();
    loadManagers();
  }, []);

  const loadUsers = async () => {
    // Get all profiles
    const { data: profilesData } = await supabase
      .from('profiles')
      .select('user_id, full_name, company')
      .order('full_name');
    
    if (!profilesData) return;

    // Get user roles to filter out admins and moderators
    const { data: rolesData } = await supabase
      .from('user_roles')
      .select('user_id, role')
      .in('user_id', profilesData.map(p => p.user_id));

    // Filter to only show regular users (not admins or moderators)
    const regularUsers = profilesData.filter(profile => {
      const userRole = rolesData?.find(r => r.user_id === profile.user_id);
      return userRole?.role === 'user';
    });
    
    setUsers(regularUsers);
  };

  const loadManagers = async () => {
    // Buscar usuários com role de admin ou moderator
    const { data: rolesData } = await supabase
      .from('user_roles')
      .select('user_id, role')
      .in('role', ['admin', 'moderator']);

    if (!rolesData) return;

    const userIds = rolesData.map(r => r.user_id);
    
    // Buscar perfis desses usuários
    const { data: profilesData } = await supabase
      .from('profiles')
      .select('user_id, full_name, avatar_url')
      .in('user_id', userIds);

    if (profilesData) {
      const managersData = profilesData.map(profile => {
        const role = rolesData.find(r => r.user_id === profile.user_id)?.role;
        return {
          id: profile.user_id,
          name: profile.full_name || 'Sem nome',
          photo_url: profile.avatar_url,
          role: role === 'admin' ? 'Admin' : 'Gestor'
        };
      });
      setManagers(managersData);
    }
  };

  const handleSyncGoogleSheets = async () => {
    if (!selectedUserId || !sheetUrl) {
      toast({
        title: "Campos obrigatórios",
        description: "Selecione um usuário e cole a URL da planilha",
        variant: "destructive"
      });
      return;
    }

    setLoading(true);
    try {
      // Save sync config
      const { error: configError } = await supabase
        .from('sheets_sync_config')
        .upsert({
          user_id: selectedUserId,
          sheet_url: sheetUrl,
          updated_at: new Date().toISOString()
        });

      if (configError) throw configError;

      // Trigger sync
      const { error: syncError } = await supabase.functions.invoke('sync-google-sheets', {
        body: { userId: selectedUserId, sheetUrl }
      });

      if (syncError) throw syncError;

      toast({
        title: "Sincronização iniciada",
        description: "Os dados serão atualizados em breve"
      });
    } catch (error: any) {
      toast({
        title: "Erro na sincronização",
        description: error.message,
        variant: "destructive"
      });
    } finally {
      setLoading(false);
    }
  };

  const handleAssignManager = async (userId: string, managerId: string) => {
    try {
      const { error } = await supabase
        .from('profiles')
        .update({ manager_id: managerId })
        .eq('user_id', userId);

      if (error) throw error;

      toast({ 
        title: "Gestor atribuído com sucesso",
        description: "O gestor agora é responsável por este cliente" 
      });
    } catch (error: any) {
      toast({
        title: "Erro ao atribuir gestor",
        description: error.message,
        variant: "destructive"
      });
    }
  };

  return (
    <div className="container mx-auto p-6 pb-24">
      <div className="mb-10">
        <h1 className="text-3xl font-bold mb-2">Gerenciamento de Dados</h1>
        <p className="text-muted-foreground">Sincronize planilhas e gerencie gestores</p>
      </div>

      {/* Google Sheets Sync */}
      <Card className="mb-8">
        <CardHeader>
          <CardTitle>Sincronizar Google Sheets</CardTitle>
          <CardDescription>
            Cole a URL da planilha do Google Sheets para atualizar automaticamente os dashboards
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="user">Selecionar Cliente</Label>
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

          <div className="space-y-2">
            <Label htmlFor="sheetUrl">URL da Planilha do Google Sheets</Label>
            <div className="flex gap-2">
              <Input
                id="sheetUrl"
                placeholder="https://docs.google.com/spreadsheets/d/..."
                value={sheetUrl}
                onChange={(e) => setSheetUrl(e.target.value)}
              />
              <Button onClick={handleSyncGoogleSheets} disabled={loading}>
                {loading ? (
                  <Loader2 className="h-4 w-4 animate-spin" />
                ) : (
                  <LinkIcon className="h-4 w-4" />
                )}
              </Button>
            </div>
            <p className="text-xs text-muted-foreground">
              Os dados serão atualizados automaticamente toda segunda-feira às 5h da manhã
            </p>
          </div>
        </CardContent>
      </Card>

      {/* Managers Management */}
      <Card className="mb-8">
        <CardHeader>
          <CardTitle>Gestores Responsáveis</CardTitle>
          <CardDescription>Usuários Admin e Gestores disponíveis para atribuição</CardDescription>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Foto</TableHead>
                <TableHead>Nome</TableHead>
                <TableHead>Função</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {managers.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={3} className="text-center text-muted-foreground">
                    Nenhum gestor disponível
                  </TableCell>
                </TableRow>
              ) : (
                managers.map((manager) => (
                  <TableRow key={manager.id}>
                    <TableCell>
                      <Avatar className="h-10 w-10">
                        <AvatarImage src={manager.photo_url || undefined} />
                        <AvatarFallback>
                          <User className="h-5 w-5" />
                        </AvatarFallback>
                      </Avatar>
                    </TableCell>
                    <TableCell>{manager.name}</TableCell>
                    <TableCell>
                      <span className="text-xs px-2 py-1 rounded-full bg-primary/10 text-primary">
                        {manager.role}
                      </span>
                    </TableCell>
                  </TableRow>
                ))
              )}
            </TableBody>
          </Table>
        </CardContent>
      </Card>

      {/* Assign Managers to Users */}
      <Card>
        <CardHeader>
          <CardTitle>Atribuir Gestores aos Clientes</CardTitle>
          <CardDescription>Defina qual gestor será responsável por cada cliente</CardDescription>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Cliente</TableHead>
                <TableHead>Empresa</TableHead>
                <TableHead>Gestor Responsável</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {users.map((user) => (
                <TableRow key={user.user_id}>
                  <TableCell>{user.full_name || '-'}</TableCell>
                  <TableCell>{user.company || '-'}</TableCell>
                  <TableCell>
                    <Select
                      onValueChange={(value) => handleAssignManager(user.user_id, value)}
                    >
                      <SelectTrigger className="w-[200px]">
                        <SelectValue placeholder="Escolher gestor" />
                      </SelectTrigger>
                      <SelectContent>
                        {managers.map((manager) => (
                          <SelectItem key={manager.id} value={manager.id}>
                            {manager.name}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  );
}