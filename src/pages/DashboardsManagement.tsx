import { useState, useEffect } from "react";
import { useSearchParams, useNavigate } from "react-router-dom";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { supabase } from "@/integrations/supabase/client";
import { useUserRole } from "@/hooks/useUserRole";
import { useToast } from "@/hooks/use-toast";
import ModernDashboard from "@/components/ModernDashboard";

interface UserProfile {
  user_id: string;
  full_name: string;
  company: string;
}

export default function DashboardsManagement() {
  const { isAdmin, isModerator } = useUserRole();
  const { toast } = useToast();
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
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

  const selectedUser = users.find(u => u.user_id === selectedUserId);

  return (
    <div className="container mx-auto p-6">
      <div className="mb-8">
        <h1 className="text-3xl font-bold mb-2">Dashboard do Cliente</h1>
        <p className="text-muted-foreground">
          Visualize os dados completos das campanhas do cliente
        </p>
      </div>

      {/* Client Selection */}
      <Card className="mb-6">
        <CardHeader>
          <CardTitle>Selecionar Cliente</CardTitle>
          <CardDescription>
            Escolha um cliente para visualizar o dashboard
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex gap-4 items-center">
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
          </div>
        </CardContent>
      </Card>

      {/* Client Dashboard */}
      {selectedUserId && selectedUser && (
        <div>
          <div className="mb-6">
            <h2 className="text-2xl font-bold">
              {selectedUser.full_name}
              {selectedUser.company && ` - ${selectedUser.company}`}
            </h2>
          </div>
          <ModernDashboard userId={selectedUserId} isAdmin={isAdmin} isModerator={isModerator} />
        </div>
      )}

      {!selectedUserId && (
        <Card>
          <CardContent className="py-12">
            <p className="text-center text-muted-foreground">
              Selecione um cliente para visualizar o dashboard
            </p>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
