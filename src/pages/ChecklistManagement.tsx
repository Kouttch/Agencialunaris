import { useState, useEffect } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { Checkbox } from "@/components/ui/checkbox";
import { Calendar } from "@/components/ui/calendar";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import { useAuth } from "@/hooks/useAuth";
import { Plus, Trash2, CalendarIcon, Clock, CheckCircle2, Circle, Loader2 } from "lucide-react";
import { format } from "date-fns";
import { ptBR } from "date-fns/locale";

interface ChecklistItem {
  id: string;
  title: string;
  description: string | null;
  is_completed: boolean;
  due_date: string | null;
  due_time: string | null;
  priority: string;
  category: string | null;
  completed_at: string | null;
  created_at: string;
  created_by: string;
  assigned_to: string | null;
  creator_name?: string;
  assigned_name?: string;
}

interface UserProfile {
  user_id: string;
  full_name: string;
}

export default function ChecklistManagement() {
  const { user } = useAuth();
  const { toast } = useToast();
  const [items, setItems] = useState<ChecklistItem[]>([]);
  const [users, setUsers] = useState<UserProfile[]>([]);
  const [loading, setLoading] = useState(true);
  const [creating, setCreating] = useState(false);
  const [showNewItemForm, setShowNewItemForm] = useState(false);
  const [selectedDate, setSelectedDate] = useState<Date>();
  
  const [newItem, setNewItem] = useState({
    title: "",
    description: "",
    priority: "medium",
    category: "",
    due_time: "",
    assigned_to: ""
  });

  useEffect(() => {
    loadItems();
    loadUsers();
    
    // Real-time subscription
    const channel = supabase
      .channel('checklist-changes')
      .on(
        'postgres_changes',
        {
          event: '*',
          schema: 'public',
          table: 'checklist_items'
        },
        () => {
          loadItems();
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, []);

  const loadUsers = async () => {
    try {
      const { data, error } = await supabase
        .from('profiles')
        .select('user_id, full_name')
        .order('full_name');

      if (error) throw error;
      setUsers(data || []);
    } catch (error: any) {
      console.error('Error loading users:', error);
    }
  };

  const loadItems = async () => {
    try {
      setLoading(true);
      const { data, error } = await supabase
        .from('checklist_items')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) throw error;

      // Load creator and assigned user names
      const itemsWithNames = await Promise.all(
        (data || []).map(async (item) => {
          const { data: creatorProfile } = await supabase
            .from('profiles')
            .select('full_name')
            .eq('user_id', item.created_by)
            .single();

          let assignedName = null;
          if (item.assigned_to) {
            const { data: assignedProfile } = await supabase
              .from('profiles')
              .select('full_name')
              .eq('user_id', item.assigned_to)
              .single();
            assignedName = assignedProfile?.full_name;
          }

          return {
            ...item,
            creator_name: creatorProfile?.full_name || 'Usuário',
            assigned_name: assignedName
          };
        })
      );

      setItems(itemsWithNames);
    } catch (error: any) {
      toast({
        title: "Erro ao carregar tarefas",
        description: error.message,
        variant: "destructive"
      });
    } finally {
      setLoading(false);
    }
  };

  const handleCreateItem = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!newItem.title) {
      toast({
        title: "Erro",
        description: "O título é obrigatório",
        variant: "destructive"
      });
      return;
    }

    setCreating(true);

    try {
      const { error } = await supabase
        .from('checklist_items')
        .insert({
          title: newItem.title,
          description: newItem.description || null,
          priority: newItem.priority,
          category: newItem.category || null,
          due_date: selectedDate ? format(selectedDate, 'yyyy-MM-dd') : null,
          due_time: newItem.due_time || null,
          created_by: user?.id,
          assigned_to: newItem.assigned_to || null
        });

      if (error) throw error;

      toast({
        title: "Sucesso",
        description: "Tarefa criada com sucesso"
      });

      setNewItem({
        title: "",
        description: "",
        priority: "medium",
        category: "",
        due_time: "",
        assigned_to: ""
      });
      setSelectedDate(undefined);
      setShowNewItemForm(false);
      loadItems();
    } catch (error: any) {
      toast({
        title: "Erro ao criar tarefa",
        description: error.message,
        variant: "destructive"
      });
    } finally {
      setCreating(false);
    }
  };

  const handleToggleComplete = async (itemId: string, currentStatus: boolean) => {
    const action = !currentStatus ? "concluir" : "reabrir";
    
    if (!confirm(`Tem certeza que deseja ${action} esta tarefa?`)) return;

    try {
      const { error } = await supabase
        .from('checklist_items')
        .update({
          is_completed: !currentStatus,
          completed_at: !currentStatus ? new Date().toISOString() : null
        })
        .eq('id', itemId);

      if (error) throw error;

      toast({
        title: "Sucesso",
        description: !currentStatus ? "Tarefa marcada como concluída" : "Tarefa reaberta"
      });
    } catch (error: any) {
      toast({
        title: "Erro",
        description: error.message,
        variant: "destructive"
      });
    }
  };

  const handleDeleteItem = async (itemId: string) => {
    if (!confirm("Tem certeza que deseja deletar esta tarefa?")) return;

    try {
      const { error } = await supabase
        .from('checklist_items')
        .delete()
        .eq('id', itemId);

      if (error) throw error;

      toast({
        title: "Sucesso",
        description: "Tarefa deletada com sucesso"
      });
    } catch (error: any) {
      toast({
        title: "Erro ao deletar tarefa",
        description: error.message,
        variant: "destructive"
      });
    }
  };

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'urgent': return 'bg-red-500';
      case 'high': return 'bg-orange-500';
      case 'medium': return 'bg-yellow-500';
      case 'low': return 'bg-green-500';
      default: return 'bg-gray-500';
    }
  };

  const getPriorityLabel = (priority: string) => {
    switch (priority) {
      case 'urgent': return 'Urgente';
      case 'high': return 'Alta';
      case 'medium': return 'Média';
      case 'low': return 'Baixa';
      default: return priority;
    }
  };

  return (
    <div className="container mx-auto p-6 pb-24">
      <div className="mb-8">
        <div className="flex justify-between items-center mb-4">
          <div>
            <h1 className="text-3xl font-bold mb-2">Checklist</h1>
            <p className="text-muted-foreground">Gerencie suas tarefas e acompanhe o progresso</p>
          </div>
          <Button onClick={() => setShowNewItemForm(!showNewItemForm)}>
            <Plus className="h-4 w-4 mr-2" />
            Nova Tarefa
          </Button>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground">Total de Tarefas</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{items.length}</div>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground">Concluídas</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-green-500">
                {items.filter(i => i.is_completed).length}
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground">Pendentes</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-orange-500">
                {items.filter(i => !i.is_completed).length}
              </div>
            </CardContent>
          </Card>
        </div>

        {/* New Item Form */}
        {showNewItemForm && (
          <Card className="mb-6">
            <CardHeader>
              <CardTitle>Nova Tarefa</CardTitle>
              <CardDescription>Preencha os detalhes da nova tarefa</CardDescription>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleCreateItem} className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="title">Título *</Label>
                  <Input
                    id="title"
                    value={newItem.title}
                    onChange={(e) => setNewItem({ ...newItem, title: e.target.value })}
                    placeholder="Digite o título da tarefa"
                    required
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="description">Descrição</Label>
                  <Textarea
                    id="description"
                    value={newItem.description}
                    onChange={(e) => setNewItem({ ...newItem, description: e.target.value })}
                    placeholder="Descreva os detalhes da tarefa"
                    rows={3}
                  />
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="priority">Prioridade</Label>
                    <Select value={newItem.priority} onValueChange={(value) => setNewItem({ ...newItem, priority: value })}>
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="low">Baixa</SelectItem>
                        <SelectItem value="medium">Média</SelectItem>
                        <SelectItem value="high">Alta</SelectItem>
                        <SelectItem value="urgent">Urgente</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="category">Categoria</Label>
                    <Input
                      id="category"
                      value={newItem.category}
                      onChange={(e) => setNewItem({ ...newItem, category: e.target.value })}
                      placeholder="Ex: Marketing, Desenvolvimento"
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="assigned">Atribuir para</Label>
                    <Select value={newItem.assigned_to || "unassigned"} onValueChange={(value) => setNewItem({ ...newItem, assigned_to: value === "unassigned" ? "" : value })}>
                      <SelectTrigger>
                        <SelectValue placeholder="Selecione um usuário" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="unassigned">Nenhum</SelectItem>
                        {users.map((u) => (
                          <SelectItem key={u.user_id} value={u.user_id}>
                            {u.full_name || 'Sem nome'}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label>Data de Vencimento</Label>
                    <Popover>
                      <PopoverTrigger asChild>
                        <Button
                          variant="outline"
                          className="w-full justify-start text-left font-normal"
                        >
                          <CalendarIcon className="mr-2 h-4 w-4" />
                          {selectedDate ? format(selectedDate, "dd 'de' MMMM 'de' yyyy", { locale: ptBR }) : "Selecione uma data"}
                        </Button>
                      </PopoverTrigger>
                      <PopoverContent className="w-auto p-0">
                        <Calendar
                          mode="single"
                          selected={selectedDate}
                          onSelect={setSelectedDate}
                          initialFocus
                        />
                      </PopoverContent>
                    </Popover>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="time">Horário</Label>
                    <Input
                      id="time"
                      type="time"
                      value={newItem.due_time}
                      onChange={(e) => setNewItem({ ...newItem, due_time: e.target.value })}
                    />
                  </div>
                </div>

                <div className="flex gap-2">
                  <Button type="submit" disabled={creating}>
                    {creating ? (
                      <>
                        <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                        Criando...
                      </>
                    ) : (
                      <>
                        <Plus className="mr-2 h-4 w-4" />
                        Criar Tarefa
                      </>
                    )}
                  </Button>
                  <Button type="button" variant="outline" onClick={() => setShowNewItemForm(false)}>
                    Cancelar
                  </Button>
                </div>
              </form>
            </CardContent>
          </Card>
        )}
      </div>

      {/* Items List */}
      <div className="space-y-6">
        {loading ? (
          <div className="flex justify-center items-center py-8">
            <Loader2 className="h-8 w-8 animate-spin" />
          </div>
        ) : items.length === 0 ? (
          <Card>
            <CardContent className="py-8 text-center text-muted-foreground">
              Nenhuma tarefa criada ainda. Clique em "Nova Tarefa" para começar.
            </CardContent>
          </Card>
        ) : (
          <>
            {/* Pending Tasks */}
            <div>
              <h2 className="text-xl font-semibold mb-4">Tarefas Pendentes</h2>
              <div className="space-y-4">
                {items.filter(item => !item.is_completed).length === 0 ? (
                  <Card>
                    <CardContent className="py-6 text-center text-muted-foreground">
                      Nenhuma tarefa pendente 🎉
                    </CardContent>
                  </Card>
                ) : (
                  items.filter(item => !item.is_completed).map((item) => (
            <Card key={item.id} className={item.is_completed ? 'opacity-60' : ''}>
              <CardContent className="pt-6">
                <div className="flex items-start gap-4">
                  <Checkbox
                    checked={item.is_completed}
                    onCheckedChange={() => handleToggleComplete(item.id, item.is_completed)}
                    className="mt-1"
                  />
                  
                  <div className="flex-1">
                    <div className="flex items-start justify-between gap-4">
                      <div className="flex-1">
                        <h3 className={`font-semibold mb-1 ${item.is_completed ? 'line-through' : ''}`}>
                          {item.title}
                        </h3>
                        {item.description && (
                          <p className="text-sm text-muted-foreground mb-2">{item.description}</p>
                        )}
                        
                        <div className="flex flex-wrap gap-2 mb-2">
                          <Badge className={getPriorityColor(item.priority)}>
                            {getPriorityLabel(item.priority)}
                          </Badge>
                          {item.category && (
                            <Badge variant="outline">{item.category}</Badge>
                          )}
                          {item.assigned_name && (
                            <Badge variant="secondary">
                              Atribuído: {item.assigned_name}
                            </Badge>
                          )}
                        </div>

                        <div className="flex flex-wrap gap-4 text-sm text-muted-foreground">
                          {item.due_date && (
                            <div className="flex items-center gap-1">
                              <CalendarIcon className="h-4 w-4" />
                              {format(new Date(item.due_date), "dd/MM/yyyy")}
                              {item.due_time && (
                                <>
                                  <Clock className="h-4 w-4 ml-2" />
                                  {item.due_time}
                                </>
                              )}
                            </div>
                          )}
                          <div>
                            Criado por: {item.creator_name}
                          </div>
                          {item.completed_at && (
                            <div className="flex items-center gap-1 text-green-500">
                              <CheckCircle2 className="h-4 w-4" />
                              Concluído em {format(new Date(item.completed_at), "dd/MM/yyyy 'às' HH:mm")}
                            </div>
                          )}
                        </div>
                      </div>

                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => handleDeleteItem(item.id)}
                      >
                        <Trash2 className="h-4 w-4 text-destructive" />
                      </Button>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
                  ))
                )}
              </div>
            </div>

            {/* Completed Tasks */}
            {items.filter(item => item.is_completed).length > 0 && (
              <div>
                <h2 className="text-xl font-semibold mb-4 text-green-600">Tarefas Concluídas</h2>
                <div className="space-y-4">
                  {items.filter(item => item.is_completed).map((item) => (
                    <Card key={item.id} className="opacity-60 border-green-200">
                      <CardContent className="pt-6">
                        <div className="flex items-start gap-4">
                          <Checkbox
                            checked={item.is_completed}
                            onCheckedChange={() => handleToggleComplete(item.id, item.is_completed)}
                            className="mt-1"
                          />
                          
                          <div className="flex-1">
                            <div className="flex items-start justify-between gap-4">
                              <div className="flex-1">
                                <h3 className="font-semibold mb-1 line-through">
                                  {item.title}
                                </h3>
                                {item.description && (
                                  <p className="text-sm text-muted-foreground mb-2">{item.description}</p>
                                )}
                                
                                <div className="flex flex-wrap gap-2 mb-2">
                                  <Badge className={getPriorityColor(item.priority)}>
                                    {getPriorityLabel(item.priority)}
                                  </Badge>
                                  {item.category && (
                                    <Badge variant="outline">{item.category}</Badge>
                                  )}
                                  {item.assigned_name && (
                                    <Badge variant="secondary">
                                      Atribuído: {item.assigned_name}
                                    </Badge>
                                  )}
                                </div>

                                <div className="flex flex-wrap gap-4 text-sm text-muted-foreground">
                                  {item.due_date && (
                                    <div className="flex items-center gap-1">
                                      <CalendarIcon className="h-4 w-4" />
                                      {format(new Date(item.due_date), "dd/MM/yyyy")}
                                      {item.due_time && (
                                        <>
                                          <Clock className="h-4 w-4 ml-2" />
                                          {item.due_time}
                                        </>
                                      )}
                                    </div>
                                  )}
                                  <div>
                                    Criado por: {item.creator_name}
                                  </div>
                                  {item.completed_at && (
                                    <div className="flex items-center gap-1 text-green-500">
                                      <CheckCircle2 className="h-4 w-4" />
                                      Concluído em {format(new Date(item.completed_at), "dd/MM/yyyy 'às' HH:mm")}
                                    </div>
                                  )}
                                </div>
                              </div>

                              <Button
                                variant="ghost"
                                size="sm"
                                onClick={() => handleDeleteItem(item.id)}
                              >
                                <Trash2 className="h-4 w-4 text-destructive" />
                              </Button>
                            </div>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
}
