import { useState, useEffect } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Upload, FileText, Trash2, Download, Calendar } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import { useUserRole } from "@/hooks/useUserRole";

interface UserProfile {
  user_id: string;
  full_name: string;
  company: string;
}

interface StrategyDocument {
  id: string;
  user_id: string;
  title: string;
  description: string | null;
  file_url: string;
  file_name: string;
  file_size: number;
  created_at: string;
  profiles?: {
    full_name: string;
    company: string;
  };
}

export default function StrategyManagement() {
  const [users, setUsers] = useState<UserProfile[]>([]);
  const [documents, setDocuments] = useState<StrategyDocument[]>([]);
  const [selectedUserId, setSelectedUserId] = useState("");
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [file, setFile] = useState<File | null>(null);
  const [uploading, setUploading] = useState(false);
  const [loading, setLoading] = useState(true);
  const { toast } = useToast();
  const { isAdmin, isModerator, managedClients } = useUserRole();

  useEffect(() => {
    loadUsers();
    loadDocuments();
  }, []);

  const loadUsers = async () => {
    try {
      const { data: rolesData } = await supabase
        .from('user_roles')
        .select('user_id, role');

      let query = supabase
        .from('profiles')
        .select('user_id, full_name, company');

      // If moderator, only show managed clients
      if (isModerator) {
        query = query.in('user_id', managedClients);
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

  const loadDocuments = async () => {
    try {
      setLoading(true);
      let query = supabase
        .from('strategy_documents')
        .select('*')
        .order('created_at', { ascending: false });

      // If moderator, only show documents for managed clients
      if (isModerator) {
        query = query.in('user_id', managedClients);
      }

      const { data, error } = await query;

      if (error) throw error;
      
      // Fetch profiles separately
      const docsWithProfiles: StrategyDocument[] = [];
      for (const doc of data || []) {
        const { data: profile } = await supabase
          .from('profiles')
          .select('full_name, company')
          .eq('user_id', doc.user_id)
          .single();
        
        docsWithProfiles.push({
          ...doc,
          profiles: profile || undefined
        });
      }
      
      setDocuments(docsWithProfiles);
    } catch (error) {
      console.error('Error loading documents:', error);
      toast({
        title: "Erro",
        description: "Não foi possível carregar os documentos.",
        variant: "destructive"
      });
    } finally {
      setLoading(false);
    }
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const selectedFile = e.target.files[0];
      
      // Validate file type (PDFs only)
      if (selectedFile.type !== 'application/pdf') {
        toast({
          title: "Erro",
          description: "Apenas arquivos PDF são permitidos.",
          variant: "destructive"
        });
        return;
      }

      // Validate file size (max 10MB)
      if (selectedFile.size > 10 * 1024 * 1024) {
        toast({
          title: "Erro",
          description: "O arquivo deve ter no máximo 10MB.",
          variant: "destructive"
        });
        return;
      }

      setFile(selectedFile);
    }
  };

  const handleUpload = async () => {
    if (!selectedUserId || !title || !file) {
      toast({
        title: "Erro",
        description: "Preencha todos os campos obrigatórios.",
        variant: "destructive"
      });
      return;
    }

    try {
      setUploading(true);
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) throw new Error('Not authenticated');

      // Upload file to storage
      const fileExt = file.name.split('.').pop();
      const fileName = `${selectedUserId}/${Date.now()}.${fileExt}`;
      
      const { error: uploadError } = await supabase.storage
        .from('strategy-documents')
        .upload(fileName, file);

      if (uploadError) throw uploadError;

      // Create database record
      const { error: dbError } = await supabase
        .from('strategy_documents')
        .insert({
          user_id: selectedUserId,
          title,
          description: description || null,
          file_url: fileName,
          file_name: file.name,
          file_size: file.size,
          uploaded_by: user.id
        });

      if (dbError) throw dbError;

      toast({
        title: "Sucesso",
        description: "Documento enviado com sucesso!"
      });

      // Reset form
      setSelectedUserId("");
      setTitle("");
      setDescription("");
      setFile(null);
      
      // Reload documents
      loadDocuments();
    } catch (error) {
      console.error('Error uploading document:', error);
      toast({
        title: "Erro",
        description: "Não foi possível enviar o documento.",
        variant: "destructive"
      });
    } finally {
      setUploading(false);
    }
  };

  const handleDelete = async (docId: string, fileUrl: string) => {
    if (!confirm('Tem certeza que deseja excluir este documento?')) return;

    try {
      // Delete from storage
      const { error: storageError } = await supabase.storage
        .from('strategy-documents')
        .remove([fileUrl]);

      if (storageError) throw storageError;

      // Delete from database
      const { error: dbError } = await supabase
        .from('strategy_documents')
        .delete()
        .eq('id', docId);

      if (dbError) throw dbError;

      toast({
        title: "Sucesso",
        description: "Documento excluído com sucesso!"
      });

      loadDocuments();
    } catch (error) {
      console.error('Error deleting document:', error);
      toast({
        title: "Erro",
        description: "Não foi possível excluir o documento.",
        variant: "destructive"
      });
    }
  };

  const handleDownload = async (doc: StrategyDocument) => {
    try {
      const { data, error } = await supabase.storage
        .from('strategy-documents')
        .download(doc.file_url);

      if (error) throw error;

      const url = URL.createObjectURL(data);
      const a = document.createElement('a');
      a.href = url;
      a.download = doc.file_name;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      URL.revokeObjectURL(url);
    } catch (error) {
      console.error('Error downloading document:', error);
      toast({
        title: "Erro",
        description: "Não foi possível baixar o documento.",
        variant: "destructive"
      });
    }
  };

  const formatFileSize = (bytes: number) => {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return Math.round(bytes / Math.pow(k, i) * 100) / 100 + ' ' + sizes[i];
  };

  return (
    <div className="container mx-auto p-6">
      <div className="mb-8">
        <h1 className="text-3xl font-bold mb-2">Gerenciar Estratégias</h1>
        <p className="text-muted-foreground">
          Envie documentos estratégicos para seus clientes
        </p>
      </div>

      {/* Upload Form */}
      <Card className="mb-8">
        <CardHeader>
          <CardTitle>Enviar Novo Documento</CardTitle>
          <CardDescription>
            Selecione um cliente e envie um documento PDF de estratégia
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div>
            <Label htmlFor="user-select">Cliente *</Label>
            <Select value={selectedUserId} onValueChange={setSelectedUserId}>
              <SelectTrigger id="user-select">
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

          <div>
            <Label htmlFor="title">Título do Documento *</Label>
            <Input
              id="title"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="Ex: Estratégia de Marketing Q1 2025"
            />
          </div>

          <div>
            <Label htmlFor="description">Descrição</Label>
            <Textarea
              id="description"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Descreva brevemente o conteúdo do documento..."
              rows={3}
            />
          </div>

          <div>
            <Label htmlFor="file">Arquivo PDF *</Label>
            <div className="flex items-center gap-4">
              <Input
                id="file"
                type="file"
                accept=".pdf"
                onChange={handleFileChange}
                className="flex-1"
              />
              {file && (
                <span className="text-sm text-muted-foreground">
                  {formatFileSize(file.size)}
                </span>
              )}
            </div>
            <p className="text-xs text-muted-foreground mt-1">
              Apenas arquivos PDF. Tamanho máximo: 10MB
            </p>
          </div>

          <Button 
            onClick={handleUpload} 
            disabled={uploading || !selectedUserId || !title || !file}
            className="w-full"
          >
            <Upload className="h-4 w-4 mr-2" />
            {uploading ? 'Enviando...' : 'Enviar Documento'}
          </Button>
        </CardContent>
      </Card>

      {/* Documents List */}
      <Card>
        <CardHeader>
          <CardTitle>Documentos Enviados</CardTitle>
          <CardDescription>
            {documents.length} documento(s) encontrado(s)
          </CardDescription>
        </CardHeader>
        <CardContent>
          {loading ? (
            <p className="text-center text-muted-foreground py-8">Carregando...</p>
          ) : documents.length === 0 ? (
            <p className="text-center text-muted-foreground py-8">
              Nenhum documento enviado ainda
            </p>
          ) : (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Título</TableHead>
                  <TableHead>Cliente</TableHead>
                  <TableHead>Data</TableHead>
                  <TableHead>Tamanho</TableHead>
                  <TableHead className="w-[100px]">Ações</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {documents.map((doc) => (
                  <TableRow key={doc.id}>
                    <TableCell>
                      <div className="flex items-center gap-2">
                        <FileText className="h-4 w-4 text-primary" />
                        <div>
                          <p className="font-medium">{doc.title}</p>
                          {doc.description && (
                            <p className="text-xs text-muted-foreground">
                              {doc.description}
                            </p>
                          )}
                        </div>
                      </div>
                    </TableCell>
                    <TableCell>
                      <div>
                        <p className="font-medium">{doc.profiles?.full_name}</p>
                        {doc.profiles?.company && (
                          <p className="text-xs text-muted-foreground">
                            {doc.profiles.company}
                          </p>
                        )}
                      </div>
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center gap-1 text-sm">
                        <Calendar className="h-3 w-3" />
                        {new Date(doc.created_at).toLocaleDateString('pt-BR')}
                      </div>
                    </TableCell>
                    <TableCell className="text-sm">
                      {formatFileSize(doc.file_size)}
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center gap-2">
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => handleDownload(doc)}
                        >
                          <Download className="h-4 w-4" />
                        </Button>
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => handleDelete(doc.id, doc.file_url)}
                        >
                          <Trash2 className="h-4 w-4 text-destructive" />
                        </Button>
                      </div>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          )}
        </CardContent>
      </Card>
    </div>
  );
}