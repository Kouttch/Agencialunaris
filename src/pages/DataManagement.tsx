import { useState, useEffect, useRef } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";
import { Loader2, Upload, Link as LinkIcon, Plus, Trash2, User } from "lucide-react";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";

interface Manager {
  id: string;
  name: string;
  photo_url: string | null;
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
  const [newManager, setNewManager] = useState({ name: "" });
  const [uploadingPhoto, setUploadingPhoto] = useState(false);
  const [selectedPhoto, setSelectedPhoto] = useState<File | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    loadUsers();
    loadManagers();
  }, []);

  const loadUsers = async () => {
    const { data } = await supabase
      .from('profiles')
      .select('user_id, full_name, company')
      .order('full_name');
    
    if (data) setUsers(data);
  };

  const loadManagers = async () => {
    const { data } = await supabase
      .from('account_managers')
      .select('*')
      .order('name');
    
    if (data) setManagers(data);
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

  const handlePhotoSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      if (file.size > 5 * 1024 * 1024) {
        toast({
          title: "Arquivo muito grande",
          description: "A foto deve ter no máximo 5MB",
          variant: "destructive"
        });
        return;
      }
      setSelectedPhoto(file);
    }
  };

  const uploadPhoto = async (): Promise<string | null> => {
    if (!selectedPhoto) return null;

    try {
      setUploadingPhoto(true);
      const fileExt = selectedPhoto.name.split('.').pop();
      const fileName = `${Math.random().toString(36).substring(2)}.${fileExt}`;
      const filePath = `${fileName}`;

      const { error: uploadError } = await supabase.storage
        .from('manager-photos')
        .upload(filePath, selectedPhoto);

      if (uploadError) throw uploadError;

      const { data: { publicUrl } } = supabase.storage
        .from('manager-photos')
        .getPublicUrl(filePath);

      return publicUrl;
    } catch (error: any) {
      toast({
        title: "Erro no upload",
        description: error.message,
        variant: "destructive"
      });
      return null;
    } finally {
      setUploadingPhoto(false);
    }
  };

  const handleCreateManager = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newManager.name) return;

    try {
      let photoUrl = null;
      if (selectedPhoto) {
        photoUrl = await uploadPhoto();
        if (!photoUrl) return;
      }

      const { error } = await supabase
        .from('account_managers')
        .insert([{ name: newManager.name, photo_url: photoUrl }]);

      if (error) throw error;

      toast({ title: "Gestor criado com sucesso" });
      setNewManager({ name: "" });
      setSelectedPhoto(null);
      if (fileInputRef.current) fileInputRef.current.value = '';
      loadManagers();
    } catch (error: any) {
      toast({
        title: "Erro ao criar gestor",
        description: error.message,
        variant: "destructive"
      });
    }
  };

  const handleDeleteManager = async (id: string) => {
    if (!confirm("Tem certeza que deseja deletar este gestor?")) return;

    try {
      const { error } = await supabase
        .from('account_managers')
        .delete()
        .eq('id', id);

      if (error) throw error;

      toast({ title: "Gestor deletado com sucesso" });
      loadManagers();
    } catch (error: any) {
      toast({
        title: "Erro ao deletar gestor",
        description: error.message,
        variant: "destructive"
      });
    }
  };

  const handleAssignManager = async (userId: string, managerId: string) => {
    try {
      const { error } = await supabase
        .from('profiles')
        .update({ manager_id: managerId })
        .eq('user_id', userId);

      if (error) throw error;

      toast({ title: "Gestor atribuído com sucesso" });
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
          <CardDescription>Gerencie os gestores de contas dos clientes</CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleCreateManager} className="space-y-4 mb-6">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="space-y-2">
                <Label htmlFor="managerName">Nome do Gestor *</Label>
                <Input
                  id="managerName"
                  value={newManager.name}
                  onChange={(e) => setNewManager({ ...newManager, name: e.target.value })}
                  required
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="managerPhoto">Foto do Gestor</Label>
                <div className="flex gap-2">
                  <Input
                    ref={fileInputRef}
                    id="managerPhoto"
                    type="file"
                    accept="image/*"
                    onChange={handlePhotoSelect}
                  />
                  {selectedPhoto && (
                    <Avatar className="h-10 w-10">
                      <AvatarImage src={URL.createObjectURL(selectedPhoto)} />
                      <AvatarFallback><User className="h-5 w-5" /></AvatarFallback>
                    </Avatar>
                  )}
                </div>
                <p className="text-xs text-muted-foreground">
                  Máximo 5MB - JPG, PNG, WEBP
                </p>
              </div>
              <div className="flex items-end">
                <Button type="submit" className="w-full" disabled={uploadingPhoto}>
                  {uploadingPhoto ? (
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  ) : (
                    <Plus className="mr-2 h-4 w-4" />
                  )}
                  Adicionar Gestor
                </Button>
              </div>
            </div>
          </form>

          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Foto</TableHead>
                <TableHead>Nome</TableHead>
                <TableHead className="text-right">Ações</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {managers.map((manager) => (
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
                  <TableCell className="text-right">
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => handleDeleteManager(manager.id)}
                    >
                      <Trash2 className="h-4 w-4 text-destructive" />
                    </Button>
                  </TableCell>
                </TableRow>
              ))}
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