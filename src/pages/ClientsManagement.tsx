import { useState, useEffect } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Search, Plus, MoreHorizontal, Eye, Edit, Trash2, UserCog } from "lucide-react";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger, DropdownMenuSeparator, DropdownMenuSub, DropdownMenuSubContent, DropdownMenuSubTrigger } from "@/components/ui/dropdown-menu";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import { useNavigate } from "react-router-dom";

interface UserProfile {
  user_id: string;
  full_name: string;
  company: string;
  created_at: string;
  account_status: string;
  manager_id: string | null;
}

export default function ClientsManagement() {
  const [searchTerm, setSearchTerm] = useState("");
  const [users, setUsers] = useState<UserProfile[]>([]);
  const [managers, setManagers] = useState<UserProfile[]>([]);
  const { toast } = useToast();
  const navigate = useNavigate();

  useEffect(() => {
    loadUsers();
    loadManagers();
  }, []);

  const loadUsers = async () => {
    // Get all profiles
    const { data: profilesData } = await supabase
      .from('profiles')
      .select('user_id, full_name, company, created_at, account_status, manager_id')
      .order('full_name');
    
    // Get all user roles
    const { data: rolesData } = await supabase
      .from('user_roles')
      .select('user_id, role');
    
    if (profilesData && rolesData) {
      // Create a map of user roles
      const rolesMap = new Map(rolesData.map(r => [r.user_id, r.role]));
      
      // Filter to only include users with 'user' role (not admins or moderators)
      const clientUsers = profilesData.filter(profile => 
        rolesMap.get(profile.user_id) === 'user'
      );
      
      setUsers(clientUsers);
    }
  };

  const regularUsersCount = users.length; // Now users array only contains actual clients

  const loadManagers = async () => {
    const { data } = await supabase
      .from('user_roles')
      .select(`
        user_id,
        profiles:user_id (
          user_id,
          full_name,
          company
        )
      `)
      .eq('role', 'moderator');
    
    if (data) {
      const managerProfiles = data
        .map(item => item.profiles)
        .filter(Boolean) as any[];
      setManagers(managerProfiles);
    }
  };

  const updateStatus = async (userId: string, newStatus: string) => {
    const { error } = await supabase
      .from('profiles')
      .update({ account_status: newStatus })
      .eq('user_id', userId);

    if (error) {
      toast({
        title: "Erro",
        description: "Não foi possível atualizar o status.",
        variant: "destructive"
      });
    } else {
      toast({
        title: "Status atualizado",
        description: "O status da conta foi atualizado com sucesso.",
      });
      loadUsers();
    }
  };

  const updateManager = async (userId: string, managerId: string | null) => {
    const { error } = await supabase
      .from('profiles')
      .update({ manager_id: managerId })
      .eq('user_id', userId);

    if (error) {
      toast({
        title: "Erro",
        description: "Não foi possível atribuir o gestor.",
        variant: "destructive"
      });
    } else {
      toast({
        title: "Gestor atribuído",
        description: "O gestor foi atribuído com sucesso.",
      });
      loadUsers();
    }
  };

  const getStatusBadge = (status: string) => {
    const config = {
      active: { variant: "default" as const, label: "Ativo", className: "bg-green-500" },
      disabled: { variant: "destructive" as const, label: "Desativado", className: "bg-red-500" },
      integration: { variant: "secondary" as const, label: "Integração", className: "bg-orange-500" },
      pending: { variant: "outline" as const, label: "Pendente", className: "bg-blue-500 text-white" }
    };
    
    const statusConfig = config[status as keyof typeof config] || config.active;
    return <Badge variant={statusConfig.variant} className={statusConfig.className}>{statusConfig.label}</Badge>;
  };

  const filteredUsers = users.filter(user => {
    const matchesSearch = 
      user.full_name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      user.company?.toLowerCase().includes(searchTerm.toLowerCase());
    
    return matchesSearch;
  });

  return (
    <div className="container mx-auto p-6">
      <div className="mb-8">
        <div className="flex justify-between items-center mb-4">
          <div>
            <h1 className="text-3xl font-bold mb-2">Gerenciamento de Clientes</h1>
            <p className="text-muted-foreground">Lista completa de usuários e seus status</p>
          </div>
          <Button onClick={() => navigate('/fulladmin/users')}>
            <Plus className="h-4 w-4 mr-2" />
            Novo Cliente
          </Button>
        </div>

        {/* Filters */}
        <div className="flex gap-4 mb-6">
          <div className="relative flex-1 max-w-sm">
            <Search className="absolute left-2 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
            <Input
              placeholder="Buscar por nome ou empresa..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-8"
            />
          </div>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground">Total de Clientes</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{regularUsersCount}</div>
              <p className="text-xs text-muted-foreground mt-1">Somente usuários</p>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground">Total Geral</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-primary">{users.length}</div>
              <p className="text-xs text-muted-foreground mt-1">Todos os perfis</p>
            </CardContent>
          </Card>
        </div>
      </div>

      {/* Clients Table */}
      <Card>
        <CardHeader>
          <CardTitle>Lista de Clientes</CardTitle>
          <CardDescription>
            {filteredUsers.length} cliente(s) encontrado(s)
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Nome</TableHead>
                <TableHead>Empresa</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Gestor</TableHead>
                <TableHead>Data de Cadastro</TableHead>
                <TableHead className="w-[70px]">Ações</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredUsers.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={6} className="text-center text-muted-foreground py-8">
                    Nenhum cliente encontrado
                  </TableCell>
                </TableRow>
              ) : (
                filteredUsers.map((user) => {
                  const manager = managers.find(m => m.user_id === user.manager_id);
                  
                  return (
                    <TableRow key={user.user_id}>
                      <TableCell className="font-medium">{user.full_name || '-'}</TableCell>
                      <TableCell>{user.company || '-'}</TableCell>
                      <TableCell>{getStatusBadge(user.account_status || 'active')}</TableCell>
                      <TableCell>{manager?.full_name || 'Nenhum'}</TableCell>
                      <TableCell>{new Date(user.created_at).toLocaleDateString('pt-BR')}</TableCell>
                      <TableCell>
                        <DropdownMenu>
                          <DropdownMenuTrigger asChild>
                            <Button variant="ghost" className="h-8 w-8 p-0">
                              <MoreHorizontal className="h-4 w-4" />
                            </Button>
                          </DropdownMenuTrigger>
                          <DropdownMenuContent align="end">
                            <DropdownMenuItem>
                              <Eye className="mr-2 h-4 w-4" />
                              Ver Detalhes
                            </DropdownMenuItem>
                            <DropdownMenuItem>
                              <Edit className="mr-2 h-4 w-4" />
                              Editar
                            </DropdownMenuItem>
                            <DropdownMenuSeparator />
                            <DropdownMenuSub>
                              <DropdownMenuSubTrigger>
                                Alterar Status
                              </DropdownMenuSubTrigger>
                              <DropdownMenuSubContent>
                                <DropdownMenuItem onClick={() => updateStatus(user.user_id, 'active')}>
                                  Ativo
                                </DropdownMenuItem>
                                <DropdownMenuItem onClick={() => updateStatus(user.user_id, 'disabled')}>
                                  Desativado
                                </DropdownMenuItem>
                                <DropdownMenuItem onClick={() => updateStatus(user.user_id, 'integration')}>
                                  Integração
                                </DropdownMenuItem>
                                <DropdownMenuItem onClick={() => updateStatus(user.user_id, 'pending')}>
                                  Pendente
                                </DropdownMenuItem>
                              </DropdownMenuSubContent>
                            </DropdownMenuSub>
                            <DropdownMenuSub>
                              <DropdownMenuSubTrigger>
                                <UserCog className="mr-2 h-4 w-4" />
                                Atribuir Gestor
                              </DropdownMenuSubTrigger>
                              <DropdownMenuSubContent>
                                <DropdownMenuItem onClick={() => updateManager(user.user_id, null)}>
                                  Nenhum
                                </DropdownMenuItem>
                                {managers.map((manager) => (
                                  <DropdownMenuItem 
                                    key={manager.user_id}
                                    onClick={() => updateManager(user.user_id, manager.user_id)}
                                  >
                                    {manager.full_name}
                                  </DropdownMenuItem>
                                ))}
                              </DropdownMenuSubContent>
                            </DropdownMenuSub>
                          </DropdownMenuContent>
                        </DropdownMenu>
                      </TableCell>
                    </TableRow>
                  );
                })
              )}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  );
}