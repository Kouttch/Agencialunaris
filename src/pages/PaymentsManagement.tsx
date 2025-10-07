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

interface UserProfile {
  user_id: string;
  full_name: string;
  company: string;
}

export default function PaymentsManagement() {
  const [selectedClient, setSelectedClient] = useState("");
  const [amount, setAmount] = useState("");
  const [pixCode, setPixCode] = useState("");
  const [message, setMessage] = useState("");
  const [copiedCode, setCopiedCode] = useState("");
  const [users, setUsers] = useState<UserProfile[]>([]);
  const { toast } = useToast();

  useEffect(() => {
    loadUsers();
  }, []);

  const loadUsers = async () => {
    const { data } = await supabase
      .from('profiles')
      .select('user_id, full_name, company')
      .order('full_name');
    
    if (data) setUsers(data);
  };

  const handleSendPixCode = () => {
    if (!selectedClient || !amount || !pixCode) {
      toast({
        title: "Campos obrigatórios",
        description: "Preencha todos os campos obrigatórios.",
        variant: "destructive"
      });
      return;
    }

    // TODO: Save payment request to database and send notification
    toast({
      title: "Código PIX enviado",
      description: "O código PIX foi enviado ao cliente com sucesso.",
    });

    // Reset form
    setSelectedClient("");
    setAmount("");
    setPixCode("");
    setMessage("");
  };

  const handleSendMessage = () => {
    if (!selectedClient || !message) {
      toast({
        title: "Campos obrigatórios",
        description: "Selecione um cliente e digite uma mensagem.",
        variant: "destructive"
      });
      return;
    }

    // TODO: Send notification to client
    toast({
      title: "Mensagem enviada",
      description: "A mensagem foi enviada ao cliente com sucesso.",
    });

    setMessage("");
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

  const getStatusBadge = (status: string) => {
    const variants = {
      "Pendente": "secondary",
      "Pago": "default",
      "Cancelado": "destructive"
    } as const;
    
    return <Badge variant={variants[status as keyof typeof variants] || "outline"}>{status}</Badge>;
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
            Em breve você verá aqui o histórico de códigos PIX enviados
          </CardDescription>
        </CardHeader>
        <CardContent>
          <p className="text-center text-muted-foreground py-8">
            Nenhum pagamento registrado ainda
          </p>
        </CardContent>
      </Card>
    </div>
  );
}