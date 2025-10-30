import { useState, useEffect } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Edit, Save, X } from "lucide-react";
import { useAuth } from "@/hooks/useAuth";

interface CampaignMapping {
  id: string;
  original_name: string;
  display_name: string;
}

interface UserProfile {
  user_id: string;
  full_name: string;
  company: string;
}

export default function CampaignNameManager() {
  const { user } = useAuth();
  const { toast } = useToast();
  const [users, setUsers] = useState<UserProfile[]>([]);
  const [selectedUserId, setSelectedUserId] = useState("");
  const [campaigns, setCampaigns] = useState<string[]>([]);
  const [mappings, setMappings] = useState<CampaignMapping[]>([]);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [editValue, setEditValue] = useState("");

  useEffect(() => {
    loadUsers();
  }, []);

  useEffect(() => {
    if (selectedUserId) {
      loadCampaigns();
      loadMappings();
    }
  }, [selectedUserId]);

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

  const loadCampaigns = async () => {
    const { data } = await supabase
      .from('campaign_data')
      .select('campaign_name')
      .eq('user_id', selectedUserId);

    if (data) {
      const uniqueCampaigns = [...new Set(data.map(c => c.campaign_name))];
      setCampaigns(uniqueCampaigns);
    }
  };

  const loadMappings = async () => {
    const { data } = await supabase
      .from('campaign_name_mappings')
      .select('*')
      .eq('user_id', selectedUserId);

    if (data) {
      setMappings(data);
    }
  };

  const handleSaveMapping = async (originalName: string) => {
    if (!editValue.trim()) {
      toast({
        title: "Nome inválido",
        description: "O nome de exibição não pode estar vazio",
        variant: "destructive"
      });
      return;
    }

    try {
      const { error } = await supabase
        .from('campaign_name_mappings')
        .upsert({
          user_id: selectedUserId,
          original_name: originalName,
          display_name: editValue,
          created_by: user?.id
        });

      if (error) throw error;

      toast({
        title: "Nome atualizado",
        description: "O nome da campanha foi alterado com sucesso"
      });

      loadMappings();
      setEditingId(null);
      setEditValue("");
    } catch (error: any) {
      toast({
        title: "Erro ao atualizar",
        description: error.message,
        variant: "destructive"
      });
    }
  };

  const getDisplayName = (originalName: string) => {
    const mapping = mappings.find(m => m.original_name === originalName);
    return mapping?.display_name || originalName;
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Gerenciar Nomes de Campanhas</CardTitle>
        <CardDescription>
          Personalize como os nomes das campanhas são exibidos para os clientes
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

        {selectedUserId && campaigns.length > 0 && (
          <div className="border rounded-lg">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Nome Original</TableHead>
                  <TableHead>Nome de Exibição</TableHead>
                  <TableHead className="text-right">Ações</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {campaigns.map((campaign) => (
                  <TableRow key={campaign}>
                    <TableCell className="font-mono text-xs">
                      {campaign}
                    </TableCell>
                    <TableCell>
                      {editingId === campaign ? (
                        <Input
                          value={editValue}
                          onChange={(e) => setEditValue(e.target.value)}
                          placeholder="Nome de exibição"
                          className="max-w-xs"
                        />
                      ) : (
                        <span className="font-medium">{getDisplayName(campaign)}</span>
                      )}
                    </TableCell>
                    <TableCell className="text-right">
                      {editingId === campaign ? (
                        <div className="flex gap-2 justify-end">
                          <Button
                            size="sm"
                            onClick={() => handleSaveMapping(campaign)}
                          >
                            <Save className="h-4 w-4" />
                          </Button>
                          <Button
                            size="sm"
                            variant="outline"
                            onClick={() => {
                              setEditingId(null);
                              setEditValue("");
                            }}
                          >
                            <X className="h-4 w-4" />
                          </Button>
                        </div>
                      ) : (
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={() => {
                            setEditingId(campaign);
                            setEditValue(getDisplayName(campaign));
                          }}
                        >
                          <Edit className="h-4 w-4" />
                        </Button>
                      )}
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        )}

        {selectedUserId && campaigns.length === 0 && (
          <p className="text-center text-muted-foreground py-8">
            Nenhuma campanha encontrada para este cliente
          </p>
        )}
      </CardContent>
    </Card>
  );
}