import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Copy, Check, Clock, CheckCircle, XCircle, CreditCard, QrCode } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

const mockRecharges = [
  {
    id: 1,
    amount: 500,
    status: "Pago",
    pix_code: "PIX123456789ABCDEF",
    created_at: "2024-01-07",
    processed_at: "2024-01-07",
    transaction_id: "TXN001"
  },
  {
    id: 2,
    amount: 300,
    status: "Pendente",
    pix_code: "PIX987654321FEDCBA",
    created_at: "2024-01-05",
    processed_at: null,
    transaction_id: null
  },
  {
    id: 3,
    amount: 750,
    status: "Cancelado",
    pix_code: "PIX555444333GHIJK",
    created_at: "2024-01-03",
    processed_at: null,
    transaction_id: null
  }
];

const pendingRecharges = mockRecharges.filter(r => r.status === "Pendente");

export default function CustomerRecharge() {
  const [copiedCode, setCopiedCode] = useState("");
  const { toast } = useToast();

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
      "Pago": "default",
      "Pendente": "secondary",
      "Cancelado": "destructive"
    } as const;
    
    const icons = {
      "Pago": <CheckCircle className="h-3 w-3 mr-1" />,
      "Pendente": <Clock className="h-3 w-3 mr-1" />,
      "Cancelado": <XCircle className="h-3 w-3 mr-1" />
    };
    
    return (
      <Badge variant={variants[status as keyof typeof variants] || "outline"} className="flex items-center">
        {icons[status as keyof typeof icons]}
        {status}
      </Badge>
    );
  };

  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat('pt-BR', {
      style: 'currency',
      currency: 'BRL'
    }).format(value);
  };

  return (
    <div className="container mx-auto p-6">
      <div className="mb-8">
        <h1 className="text-3xl font-bold mb-2">Recargas de Anúncios</h1>
        <p className="text-muted-foreground">
          Gerencie suas recargas e acompanhe pagamentos via PIX
        </p>
      </div>

      {/* Balance Overview */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">
              Saldo Atual
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-green-600">R$ 1.248,50</div>
            <p className="text-xs text-muted-foreground mt-1">Disponível para campanhas</p>
          </CardContent>
        </Card>

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
              Total Investido (Mês)
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">R$ 3.450,00</div>
            <p className="text-xs text-green-600 mt-1">+15% vs mês anterior</p>
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
                          Criado em {new Date(recharge.created_at).toLocaleDateString()}
                        </CardDescription>
                      </div>
                      {getStatusBadge(recharge.status)}
                    </div>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
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
              <CardContent className="py-8">
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
                Acompanhe todas as suas transações
              </CardDescription>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Valor</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead>Data Criação</TableHead>
                    <TableHead>Data Processamento</TableHead>
                    <TableHead>ID Transação</TableHead>
                    <TableHead>Código PIX</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {mockRecharges.map((recharge) => (
                    <TableRow key={recharge.id}>
                      <TableCell className="font-medium">
                        {formatCurrency(recharge.amount)}
                      </TableCell>
                      <TableCell>{getStatusBadge(recharge.status)}</TableCell>
                      <TableCell>
                        {new Date(recharge.created_at).toLocaleDateString()}
                      </TableCell>
                      <TableCell>
                        {recharge.processed_at 
                          ? new Date(recharge.processed_at).toLocaleDateString()
                          : "-"
                        }
                      </TableCell>
                      <TableCell>
                        {recharge.transaction_id || "-"}
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
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}