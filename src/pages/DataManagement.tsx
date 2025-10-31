import { useState, useEffect } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";
import { User } from "lucide-react";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";

interface Manager {
  id: string;
  name: string;
  photo_url: string | null;
  role?: string;
}

interface UserProfile {
  user_id: string;
  full_name: string;
  company: string;
}

export default function DataManagement() {
  const { toast } = useToast();
  const [users, setUsers] = useState<UserProfile[]>([]);
  const [managers, setManagers] = useState<Manager[]>([]);

  useEffect(() => {
    loadUsers();
    loadManagers();
  }, []);

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

  const loadManagers = async () => {
    const { data: rolesData } = await supabase
      .from('user_roles')
      .select('user_id, role')
      .in('role', ['admin', 'moderator']);

    if (!rolesData) return;

    const userIds = rolesData.map(r => r.user_id);
    
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
        <h1 className="text-3xl font-bold mb-2">Gestão de Clientes e Gestores</h1>
        <p className="text-muted-foreground">
          Gerencie a atribuição de gestores responsáveis pelos clientes
        </p>
      </div>

      {/* Managers Management */}
      <Card className="mb-8 border-primary/20 bg-gradient-to-br from-background via-background to-primary/5">
        <CardHeader>
          <CardTitle>Gestores Disponíveis</CardTitle>
          <CardDescription>Usuários Admin e Gestores disponíveis para atribuição aos clientes</CardDescription>
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
      <Card className="mb-8 border-primary/20 bg-gradient-to-br from-background via-background to-primary/5">
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
