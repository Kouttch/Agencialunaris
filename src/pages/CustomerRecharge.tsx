import { useState, useEffect } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Copy, Check, Clock, CheckCircle, XCircle, CreditCard, QrCode } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/hooks/useAuth";

interface PaymentRequest {
  id: string;
  amount: number;
  pix_code: string;
  message: string | null;
  status: string;
  created_at: string;
}

export default function CustomerRecharge() {
  const [paymentRequests, setPaymentRequests] = useState<PaymentRequest[]>([]);
  const [copiedCode, setCopiedCode] = useState("");
  const [unreadCount, setUnreadCount] = useState(0);
  const { toast } = useToast();
  const { user } = useAuth();

  useEffect(() => {
    if (user) {
      loadPaymentRequests();
    }
  }, [user]);

  const loadPaymentRequests = async () => {
    if (!user) return;

    const { data } = await supabase
      .from('payment_requests')
      .select('*')
      .eq('user_id', user.id)
      .order('created_at', { ascending: false });
    
    if (data) {
      setPaymentRequests(data);
      const pending = data.filter(p => p.status === 'pending').length;
      setUnreadCount(pending);
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

  const getStatusBadge = (status: string) => {
    const config = {
      pending: { variant: "secondary" as const, label: "Pendente", icon: <Clock className="h-3 w-3 mr-1" /> },
      paid: { variant: "default" as const, label: "Pago", icon: <CheckCircle className="h-3 w-3 mr-1" /> },
      cancelled: { variant: "destructive" as const, label: "Cancelado", icon: <XCircle className="h-3 w-3 mr-1" /> }
    };
    
    const statusConfig = config[status as keyof typeof config] || config.pending;
    return (
      <Badge variant={statusConfig.variant} className="flex items-center">
        {statusConfig.icon}
        {statusConfig.label}
      </Badge>
    );
  };

  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat('pt-BR', {
      style: 'currency',
      currency: 'BRL'
    }).format(value);
  };

  const pendingRecharges = paymentRequests.filter(r => r.status === 'pending');

  return (
    <div className="container mx-auto p-6">
      <div className="mb-8">
        <div className="flex items-center gap-3 mb-2">
          <CreditCard className="h-8 w-8 text-primary" />
          <h1 className="text-3xl font-bold">Recargas de Anúncios</h1>
          {unreadCount > 0 && (
            <Badge variant="destructive" className="rounded-full">
              {unreadCount}
            </Badge>
          )}
        </div>
        <p className="text-muted-foreground">
          Visualize e pague suas solicitações de recarga
        </p>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">
              Pagamentos Pendentes
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-yellow-600">
              {formatCurrency(pendingRecharges.reduce((sum, r) => sum + r.amount, 0))}
            </div>
            <p className="text-xs text-muted-foreground mt-1">
              {pendingRecharges.length} pagamento(s) pendente(s)
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">
              Total de Solicitações
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{paymentRequests.length}</div>
            <p className="text-xs text-muted-foreground mt-1">Todas as recargas</p>
          </CardContent>
        </Card>
      </div>

      <Tabs defaultValue="pending" className="space-y-6">
        <TabsList className="grid w-full grid-cols-2">
          <TabsTrigger value="pending">Pagamentos Pendentes</TabsTrigger>
          <TabsTrigger value="history">Histórico</TabsTrigger>
        </TabsList>

        {/* Pending Payments */}
        <TabsContent value="pending" className="space-y-6">
          {pendingRecharges.length > 0 ? (
            <div className="grid grid-cols-1 gap-4">
              {pendingRecharges.map((recharge) => (
                <Card key={recharge.id} className="border-yellow-200 dark:border-yellow-800">
                  <CardHeader className="pb-4">
                    <div className="flex justify-between items-start">
                      <div>
                        <CardTitle className="flex items-center gap-2">
                          <CreditCard className="h-5 w-5" />
                          Recarga de {formatCurrency(recharge.amount)}
                        </CardTitle>
                        <CardDescription>
                          Criado em {new Date(recharge.created_at).toLocaleDateString('pt-BR')}
                        </CardDescription>
                      </div>
                      {getStatusBadge(recharge.status)}
                    </div>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      {recharge.message && (
                        <div className="p-3 bg-muted rounded-lg">
                          <p className="text-sm font-medium mb-1">Mensagem:</p>
                          <p className="text-sm text-muted-foreground">{recharge.message}</p>
                        </div>
                      )}
                      
                      <div>
                        <h4 className="font-semibold mb-2 flex items-center gap-2">
                          <QrCode className="h-4 w-4" />
                          Código PIX para Pagamento
                        </h4>
                        <div className="flex items-center gap-2 p-3 bg-muted rounded-lg">
                          <code className="flex-1 text-sm font-mono break-all">
                            {recharge.pix_code}
                          </code>
                          <Button
                            size="sm"
                            variant="ghost"
                            onClick={() => copyPixCode(recharge.pix_code)}
                            className="shrink-0"
                          >
                            {copiedCode === recharge.pix_code ? (
                              <Check className="h-4 w-4 text-green-600" />
                            ) : (
                              <Copy className="h-4 w-4" />
                            )}
                          </Button>
                        </div>
                      </div>

                      <div className="text-sm text-muted-foreground">
                        <p className="mb-1">
                          <strong>Instruções:</strong>
                        </p>
                        <ol className="list-decimal list-inside space-y-1 ml-2">
                          <li>Abra o app do seu banco</li>
                          <li>Escolha a opção PIX</li>
                          <li>Selecione "Pix Copia e Cola"</li>
                          <li>Cole o código acima</li>
                          <li>Confirme o pagamento</li>
                        </ol>
                        <p className="mt-3 p-2 bg-blue-50 dark:bg-blue-950 rounded text-blue-700 dark:text-blue-300">
                          💡 O saldo será creditado automaticamente após a confirmação do pagamento.
                        </p>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          ) : (
            <Card>
              <CardContent className="py-12">
                <div className="text-center">
                  <CheckCircle className="h-12 w-12 text-green-500 mx-auto mb-4" />
                  <h3 className="text-lg font-semibold mb-2">Nenhum pagamento pendente</h3>
                  <p className="text-muted-foreground">
                    Todos os seus pagamentos estão em dia!
                  </p>
                </div>
              </CardContent>
            </Card>
          )}
        </TabsContent>

        {/* History */}
        <TabsContent value="history" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Histórico de Recargas</CardTitle>
              <CardDescription>
                {paymentRequests.length} solicitação(ões) de recarga
              </CardDescription>
            </CardHeader>
            <CardContent>
              {paymentRequests.length === 0 ? (
                <div className="text-center py-12">
                  <CreditCard className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
                  <p className="text-muted-foreground">
                    Nenhuma solicitação de recarga ainda
                  </p>
                </div>
              ) : (
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Valor</TableHead>
                      <TableHead>Status</TableHead>
                      <TableHead>Data</TableHead>
                      <TableHead>Mensagem</TableHead>
                      <TableHead>Código PIX</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {paymentRequests.map((recharge) => (
                      <TableRow key={recharge.id}>
                        <TableCell className="font-bold">
                          {formatCurrency(recharge.amount)}
                        </TableCell>
                        <TableCell>{getStatusBadge(recharge.status)}</TableCell>
                        <TableCell>
                          {new Date(recharge.created_at).toLocaleDateString('pt-BR')}
                        </TableCell>
                        <TableCell className="max-w-xs truncate">
                          {recharge.message || '-'}
                        </TableCell>
                        <TableCell>
                          <div className="flex items-center gap-2">
                            <code className="text-xs bg-muted px-2 py-1 rounded">
                              {recharge.pix_code.substring(0, 10)}...
                            </code>
                            <Button
                              size="sm"
                              variant="ghost"
                              onClick={() => copyPixCode(recharge.pix_code)}
                              className="h-6 w-6 p-0"
                            >
                              {copiedCode === recharge.pix_code ? (
                                <Check className="h-3 w-3 text-green-600" />
                              ) : (
                                <Copy className="h-3 w-3" />
                              )}
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
        </TabsContent>
      </Tabs>
    </div>
  );
}