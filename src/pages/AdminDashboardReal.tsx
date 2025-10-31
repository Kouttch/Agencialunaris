import { useState, useEffect } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import { supabase } from "@/integrations/supabase/client";
import { useNavigate, useSearchParams } from "react-router-dom";
import { useUserRole } from "@/hooks/useUserRole";
import ClientStatusGrid from "@/components/ClientStatusGrid";

interface UserProfile {
  user_id: string;
  full_name: string;
  company: string;
}

export default function AdminDashboard() {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const { isModerator } = useUserRole();
  const [users, setUsers] = useState<UserProfile[]>([]);
  const [selectedUserId, setSelectedUserId] = useState<string>(searchParams.get('user') || "");

  useEffect(() => {
    loadUsers();
  }, []);

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

  const handleViewUserDashboard = () => {
    if (selectedUserId) {
      navigate(`/fulladmin/dashboards?user=${selectedUserId}`);
    }
  };

  return (
    <div className="container mx-auto p-6">
      <div className="mb-8">
        <h1 className="text-3xl font-bold mb-2">Painel Administrativo</h1>
        <p className="text-muted-foreground">Visão geral de clientes e acesso aos dashboards</p>
      </div>

      {/* Client Status Overview */}
      <ClientStatusGrid />

      {/* User Dashboard Access */}
      <Card className="mb-8">
        <CardHeader>
          <CardTitle>Selecionar Cliente</CardTitle>
          <CardDescription>
            Selecione um cliente para visualizar o dashboard completo
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
    </div>
  );
}
