import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { useUserRole } from "@/hooks/useUserRole";

interface ClientStatus {
  user_id: string;
  full_name: string;
  company: string;
  avatar_url: string | null;
  account_status: string;
}

interface StatusCounts {
  active: number;
  disabled: number;
  integration: number;
  pending: number;
}

export default function ClientStatusGrid() {
  const { isAdmin, isModerator } = useUserRole();
  const [clients, setClients] = useState<ClientStatus[]>([]);
  const [statusCounts, setStatusCounts] = useState<StatusCounts>({
    active: 0,
    disabled: 0,
    integration: 0,
    pending: 0
  });

  useEffect(() => {
    loadClients();
  }, []);

  const loadClients = async () => {
    try {
      const { data: authData } = await supabase.auth.getUser();
      const { data: rolesData } = await supabase
        .from('user_roles')
        .select('user_id, role');

      let query = supabase
        .from('profiles')
        .select('user_id, full_name, company, avatar_url, account_status');

      // Se for moderador, filtrar apenas clientes gerenciados
      if (isModerator && authData.user) {
        query = query.eq('manager_id', authData.user.id);
      }

      const { data, error } = await query;

      if (error) throw error;

      if (data && rolesData) {
        const rolesMap = new Map(rolesData.map(r => [r.user_id, r.role]));
        const clientUsers = data.filter(profile => 
          rolesMap.get(profile.user_id) === 'user'
        );
        
        setClients(clientUsers);

        // Calcular contadores
        const counts = clientUsers.reduce((acc, client) => {
          const status = client.account_status || 'active';
          acc[status as keyof StatusCounts] = (acc[status as keyof StatusCounts] || 0) + 1;
          return acc;
        }, { active: 0, disabled: 0, integration: 0, pending: 0 });

        setStatusCounts(counts);
      }
    } catch (error) {
      console.error('Error loading clients:', error);
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'active':
        return 'bg-success';
      case 'disabled':
        return 'bg-destructive';
      case 'integration':
        return 'bg-warning';
      case 'pending':
        return 'bg-primary';
      default:
        return 'bg-muted';
    }
  };

  const getStatusLabel = (status: string) => {
    switch (status) {
      case 'active':
        return 'Ativo';
      case 'disabled':
        return 'Desativado';
      case 'integration':
        return 'Integração';
      case 'pending':
        return 'Pendente';
      default:
        return 'Desconhecido';
    }
  };

  return (
    <div className="space-y-6">
      {/* Status Counts */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <Card>
          <CardContent className="pt-6">
            <div className="text-center">
              <div className="text-3xl font-bold text-success">{statusCounts.active}</div>
              <p className="text-sm text-muted-foreground mt-2">Ativos</p>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-6">
            <div className="text-center">
              <div className="text-3xl font-bold text-destructive">{statusCounts.disabled}</div>
              <p className="text-sm text-muted-foreground mt-2">Desativados</p>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-6">
            <div className="text-center">
              <div className="text-3xl font-bold text-warning">{statusCounts.integration}</div>
              <p className="text-sm text-muted-foreground mt-2">Integração</p>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-6">
            <div className="text-center">
              <div className="text-3xl font-bold text-primary">{statusCounts.pending}</div>
              <p className="text-sm text-muted-foreground mt-2">Pendentes</p>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Clients Grid */}
      <Card>
        <CardHeader>
          <CardTitle>Clientes</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
            {clients.map((client) => (
              <Card key={client.user_id} className="overflow-hidden">
                <CardContent className="p-4">
                  <div className="flex items-center space-x-4">
                    <div className="relative">
                      <Avatar className="h-12 w-12">
                        <AvatarImage src={client.avatar_url || undefined} />
                        <AvatarFallback>
                          {client.full_name?.charAt(0) || 'U'}
                        </AvatarFallback>
                      </Avatar>
                      <div 
                        className={`absolute -bottom-1 -right-1 h-4 w-4 rounded-full border-2 border-background ${getStatusColor(client.account_status || 'active')}`}
                      />
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-medium truncate">
                        {client.full_name}
                      </p>
                      {client.company && (
                        <p className="text-xs text-muted-foreground truncate">
                          {client.company}
                        </p>
                      )}
                      <Badge 
                        variant="outline" 
                        className="mt-1 text-xs"
                      >
                        {getStatusLabel(client.account_status || 'active')}
                      </Badge>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}