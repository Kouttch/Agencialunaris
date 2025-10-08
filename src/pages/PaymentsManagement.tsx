import { useState, useEffect } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Send, Copy, Check, MessageSquare, CreditCard } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";
import { useUserRole } from "@/hooks/useUserRole";

interface UserProfile {
  user_id: string;
  full_name: string;
  company: string;
}

interface PaymentRequest {
  id: string;
  user_id: string;
  amount: number;
  pix_code: string;
  message: string | null;
  status: string;
  created_at: string;
  profiles: {
    full_name: string;
    company: string;
  };
}

export default function PaymentsManagement() {
  const [selectedClient, setSelectedClient] = useState("");
  const [amount, setAmount] = useState("");
  const [pixCode, setPixCode] = useState("");
  const [message, setMessage] = useState("");
  const [copiedCode, setCopiedCode] = useState("");
  const [users, setUsers] = useState<UserProfile[]>([]);
  const [paymentHistory, setPaymentHistory] = useState<PaymentRequest[]>([]);
  const { toast } = useToast();
  const { isModerator, managedClients } = useUserRole();

  useEffect(() => {
    loadUsers();
    loadPaymentHistory();
  }, []);

  const loadUsers = async () => {
    let query = supabase
      .from('profiles')
      .select('user_id, full_name, company');

    if (isModerator && managedClients.length > 0) {
      query = query.in('user_id', managedClients);
    }

    const { data } = await query.order('full_name');
    if (data) setUsers(data);
  };

  const loadPaymentHistory = async () => {
    const { data } = await supabase
      .from('payment_requests')
      .select(`
        id,
        user_id,
        amount,
        pix_code,
        message,
        status,
        created_at,
        profiles:user_id (
          full_name,
          company
        )
      `)
      .order('created_at', { ascending: false });
    
    if (data) setPaymentHistory(data as any);
  };

  const handleSendPixCode = async () => {
    if (!selectedClient || !amount || !pixCode) {
      toast({
        title: "Campos obrigatórios",
        description: "Preencha todos os campos obrigatórios.",
        variant: "destructive"
      });
      return;
    }

    try {
      const { data: authData } = await supabase.auth.getUser();
      
      const { error } = await supabase
        .from('payment_requests')
        .insert({
          user_id: selectedClient,
          amount: parseFloat(amount),
          pix_code: pixCode,
          message: message || null,
          created_by: authData.user?.id,
          status: 'pending'
        });

      if (error) throw error;

      toast({
        title: "Código PIX enviado",
        description: "O código PIX foi enviado ao cliente com sucesso.",
      });

      // Reset form
      setSelectedClient("");
      setAmount("");
      setPixCode("");
      setMessage("");
      
      loadPaymentHistory();
    } catch (error) {
      console.error('Error sending PIX code:', error);
      toast({
        title: "Erro ao enviar",
        description: "Não foi possível enviar o código PIX.",
        variant: "destructive"
      });
    }
  };

  const handleSendMessage = async () => {
    if (!selectedClient || !message) {
      toast({
        title: "Campos obrigatórios",
        description: "Selecione um cliente e digite uma mensagem.",
        variant: "destructive"
      });
      return;
    }

    try {
      const { data: authData } = await supabase.auth.getUser();
      
      const { error } = await supabase
        .from('notifications')
        .insert({
          user_id: selectedClient,
          title: 'Nova Mensagem',
          message: message,
          type: 'info',
          is_read: false
        });

      if (error) throw error;

      toast({
        title: "Mensagem enviada",
        description: "A mensagem foi enviada ao cliente com sucesso.",
      });

      setMessage("");
    } catch (error) {
      console.error('Error sending message:', error);
      toast({
        title: "Erro ao enviar",
        description: "Não foi possível enviar a mensagem.",
        variant: "destructive"
      });
    }
  };

  const copyPixCode = (code: string) => {
    navigator.clipboard.writeText(code);
    setCopiedCode(code);
    setTimeout(() => setCopiedCode(""), 2000);
    toast({
      title: "Código copiado",
      description: "Código PIX copiado para a área de transferência.",
    });
  };

  const handleUpdateStatus = async (paymentId: string, newStatus: string) => {
    try {
      const { error } = await supabase
        .from('payment_requests')
        .update({ status: newStatus })
        .eq('id', paymentId);

      if (error) throw error;

      toast({
        title: "Status atualizado",
        description: `Pagamento marcado como ${newStatus === 'paid' ? 'pago' : 'pendente'}.`,
      });

      loadPaymentHistory();
    } catch (error) {
      console.error('Error updating status:', error);
      toast({
        title: "Erro",
        description: "Não foi possível atualizar o status.",
        variant: "destructive"
      });
    }
  };

  const getStatusBadge = (status: string) => {
    const variants = {
      "pending": "secondary",
      "paid": "default",
      "cancelled": "destructive"
    } as const;
    
    const labels = {
      "pending": "Aguardando Pagamento",
      "paid": "Pago",
      "cancelled": "Cancelado"
    } as const;
    
    return <Badge variant={variants[status as keyof typeof variants] || "outline"}>
      {labels[status as keyof typeof labels] || status}
    </Badge>;
  };

  return (
    <div className="container mx-auto p-6">
      <div className="mb-8">
        <h1 className="text-3xl font-bold mb-2">Gerenciamento de Pagamentos</h1>
        <p className="text-muted-foreground">
          Envie códigos PIX e notificações para clientes
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
        {/* Send PIX Code */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <CreditCard className="h-5 w-5" />
              Enviar Código PIX
            </CardTitle>
            <CardDescription>
              Gere e envie códigos PIX para recarga de anúncios
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <Label htmlFor="client-select">Cliente</Label>
              <Select value={selectedClient} onValueChange={setSelectedClient}>
                <SelectTrigger>
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
              <Label htmlFor="amount">Valor (R$)</Label>
              <Input
                id="amount"
                type="number"
                placeholder="500.00"
                value={amount}
                onChange={(e) => setAmount(e.target.value)}
              />
            </div>

            <div>
              <Label htmlFor="pix-code">Código PIX</Label>
              <Input
                id="pix-code"
                placeholder="00020126580014BR.GOV.BCB.PIX..."
                value={pixCode}
                onChange={(e) => setPixCode(e.target.value)}
              />
            </div>

            <Button onClick={handleSendPixCode} className="w-full">
              <Send className="h-4 w-4 mr-2" />
              Enviar Código PIX
            </Button>
          </CardContent>
        </Card>

        {/* Send Notification */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <MessageSquare className="h-5 w-5" />
              Enviar Notificação
            </CardTitle>
            <CardDescription>
              Envie mensagens e notificações personalizadas
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <Label htmlFor="client-select-msg">Cliente</Label>
              <Select value={selectedClient} onValueChange={setSelectedClient}>
                <SelectTrigger>
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
              <Label htmlFor="message">Mensagem</Label>
              <Textarea
                id="message"
                placeholder="Digite sua mensagem..."
                rows={6}
                value={message}
                onChange={(e) => setMessage(e.target.value)}
              />
            </div>

            <Button onClick={handleSendMessage} className="w-full">
              <Send className="h-4 w-4 mr-2" />
              Enviar Mensagem
            </Button>
          </CardContent>
        </Card>
      </div>

      {/* Payment Requests History */}
      <Card>
        <CardHeader>
          <CardTitle>Histórico de Solicitações</CardTitle>
          <CardDescription>
            {paymentHistory.length} solicitação(ões) registrada(s)
          </CardDescription>
        </CardHeader>
        <CardContent>
          {paymentHistory.length === 0 ? (
            <p className="text-center text-muted-foreground py-8">
              Nenhum pagamento registrado ainda
            </p>
          ) : (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Cliente</TableHead>
                  <TableHead>Valor</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Data</TableHead>
                  <TableHead>Código PIX</TableHead>
                  <TableHead>Ações</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {paymentHistory.map((payment) => (
                  <TableRow key={payment.id}>
                    <TableCell>
                      {payment.profiles.full_name}
                      {payment.profiles.company && ` - ${payment.profiles.company}`}
                    </TableCell>
                    <TableCell>R$ {payment.amount.toFixed(2)}</TableCell>
                    <TableCell>{getStatusBadge(payment.status)}</TableCell>
                    <TableCell>
                      {new Date(payment.created_at).toLocaleDateString('pt-BR')}
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center gap-2">
                        <code className="text-xs bg-muted px-2 py-1 rounded">
                          {payment.pix_code.substring(0, 15)}...
                        </code>
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => copyPixCode(payment.pix_code)}
                        >
                          {copiedCode === payment.pix_code ? (
                            <Check className="h-4 w-4" />
                          ) : (
                            <Copy className="h-4 w-4" />
                          )}
                        </Button>
                      </div>
                    </TableCell>
                    <TableCell>
                      <div className="flex gap-2">
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => handleUpdateStatus(payment.id, 'paid')}
                          disabled={payment.status === 'paid'}
                        >
                          Marcar como Pago
                        </Button>
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => handleUpdateStatus(payment.id, 'pending')}
                          disabled={payment.status === 'pending'}
                        >
                          Pendente
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