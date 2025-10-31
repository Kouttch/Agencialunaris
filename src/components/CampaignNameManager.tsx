import { useState, useEffect } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Check, X, Edit } from "lucide-react";

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
    // Get account_id for selected user
    const { data: mappingData } = await supabase
      .from('meta_account_mappings')
      .select('account_id')
      .eq('user_id', selectedUserId)
      .single();

    if (!mappingData) {
      setCampaigns([]);
      return;
    }

    // Get unique campaign names from meta_reports
    const { data: reportsData } = await supabase
      .from('meta_reports')
      .select('campaign_name')
      .eq('account_id', mappingData.account_id);

    if (reportsData) {
      const uniqueCampaigns = [...new Set(reportsData.map(r => r.campaign_name).filter(Boolean))] as string[];
      setCampaigns(uniqueCampaigns.sort());
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

  const handleSaveMapping = async (originalName: string, displayName: string) => {
    if (!displayName.trim()) {
      toast({
        title: "Nome obrigatório",
        description: "Digite um nome para exibição",
        variant: "destructive"
      });
      return;
    }

    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) throw new Error("Usuário não autenticado");

      const existingMapping = mappings.find(m => m.original_name === originalName);

      if (existingMapping) {
        const { error } = await supabase
          .from('campaign_name_mappings')
          .update({ 
            display_name: displayName,
            created_by: user.id
          })
          .eq('id', existingMapping.id);

        if (error) throw error;
      } else {
        const { error } = await supabase
          .from('campaign_name_mappings')
          .insert({
            user_id: selectedUserId,
            original_name: originalName,
            display_name: displayName,
            created_by: user.id
          });

        if (error) throw error;
      }

      toast({
        title: "Nome atualizado",
        description: "O nome da campanha foi atualizado com sucesso"
      });

      setEditingId(null);
      setEditValue("");
      loadMappings();
    } catch (error: any) {
      toast({
        title: "Erro ao salvar",
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
    <Card className="border-primary/20 bg-gradient-to-br from-background via-background to-primary/5">
      <CardHeader>
        <CardTitle>Gerenciar Nomes de Campanhas</CardTitle>
        <CardDescription>
          Personalize os nomes das campanhas exibidos nos dashboards dos clientes
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="space-y-2">
          <label className="text-sm font-medium">Selecionar Cliente</label>
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
          <div className="border border-primary/20 rounded-lg overflow-hidden">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Nome Original</TableHead>
                  <TableHead>Nome de Exibição</TableHead>
                  <TableHead className="w-[100px]">Ações</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {campaigns.map((campaign) => (
                  <TableRow key={campaign}>
                    <TableCell className="font-mono text-xs">{campaign}</TableCell>
                    <TableCell>
                      {editingId === campaign ? (
                        <Input
                          value={editValue}
                          onChange={(e) => setEditValue(e.target.value)}
                          onKeyDown={(e) => {
                            if (e.key === 'Enter') {
                              handleSaveMapping(campaign, editValue);
                            } else if (e.key === 'Escape') {
                              setEditingId(null);
                              setEditValue("");
                            }
                          }}
                          autoFocus
                        />
                      ) : (
                        <span className="font-medium">{getDisplayName(campaign)}</span>
                      )}
                    </TableCell>
                    <TableCell>
                      {editingId === campaign ? (
                        <div className="flex gap-1">
                          <Button
                            size="sm"
                            variant="ghost"
                            onClick={() => handleSaveMapping(campaign, editValue)}
                          >
                            <Check className="h-4 w-4 text-green-500" />
                          </Button>
                          <Button
                            size="sm"
                            variant="ghost"
                            onClick={() => {
                              setEditingId(null);
                              setEditValue("");
                            }}
                          >
                            <X className="h-4 w-4 text-red-500" />
                          </Button>
                        </div>
                      ) : (
                        <Button
                          size="sm"
                          variant="ghost"
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
          <div className="text-center py-8 text-muted-foreground">
            Nenhuma campanha encontrada para este cliente
          </div>
        )}
      </CardContent>
    </Card>
  );
}
