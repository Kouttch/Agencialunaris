import { useState } from "react";
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

const mockPaymentRequests = [
  {
    id: 1,
    client: "João Silva",
    company: "Empresa XYZ",
    amount: 500,
    status: "Pendente",
    created_at: "2024-01-07",
    pix_code: "PIX123456789",
  },
  {
    id: 2,
    client: "Maria Santos", 
    company: "StartUp ABC",
    amount: 300,
    status: "Pago",
    created_at: "2024-01-05",
    pix_code: "PIX987654321",
  },
];

const mockClients = [
  { id: 1, name: "João Silva", company: "Empresa XYZ" },
  { id: 2, name: "Maria Santos", company: "StartUp ABC" },
  { id: 3, name: "Carlos Oliveira", company: "Comércio 123" },
];

export default function PaymentsManagement() {
  const [selectedClient, setSelectedClient] = useState("");
  const [amount, setAmount] = useState("");
  const [pixCode, setPixCode] = useState("");
  const [message, setMessage] = useState("");
  const [copiedCode, setCopiedCode] = useState("");
  const { toast } = useToast();

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
                  {mockClients.map((client) => (
                    <SelectItem key={client.id} value={client.id.toString()}>
                      {client.name} - {client.company}
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
                  {mockClients.map((client) => (
                    <SelectItem key={client.id} value={client.id.toString()}>
                      {client.name} - {client.company}
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
            Códigos PIX enviados e status dos pagamentos
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Cliente</TableHead>
                <TableHead>Empresa</TableHead>
                <TableHead>Valor</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Data</TableHead>
                <TableHead>Código PIX</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {mockPaymentRequests.map((request) => (
                <TableRow key={request.id}>
                  <TableCell className="font-medium">{request.client}</TableCell>
                  <TableCell>{request.company}</TableCell>
                  <TableCell>R$ {request.amount.toFixed(2)}</TableCell>
                  <TableCell>{getStatusBadge(request.status)}</TableCell>
                  <TableCell>{new Date(request.created_at).toLocaleDateString()}</TableCell>
                  <TableCell>
                    <div className="flex items-center gap-2">
                      <span className="font-mono text-sm bg-muted px-2 py-1 rounded">
                        {request.pix_code}
                      </span>
                      <Button
                        size="sm"
                        variant="ghost"
                        onClick={() => copyPixCode(request.pix_code)}
                        className="h-8 w-8 p-0"
                      >
                        {copiedCode === request.pix_code ? (
                          <Check className="h-4 w-4 text-green-600" />
                        ) : (
                          <Copy className="h-4 w-4" />
                        )}
                      </Button>
                    </div>
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