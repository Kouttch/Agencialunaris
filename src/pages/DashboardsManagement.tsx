import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Edit, Save, X } from "lucide-react";

const mockClientData = [
  {
    id: 1,
    name: "João Silva",
    company: "Empresa XYZ",
    weeklyData: {
      conversas: 45,
      custo: 195.80,
      alcance: 4500,
      impressoes: 8900,
      frequencia: 2.1,
      orcamento: 500,
      investido: 450
    },
    monthlyData: {
      conversas: 180,
      custo: 720.50,
      alcance: 18000,
      impressoes: 35600,
      frequencia: 2.3,
      orcamento: 2000,
      investido: 1850
    }
  },
  {
    id: 2,
    name: "Maria Santos",
    company: "StartUp ABC",
    weeklyData: {
      conversas: 32,
      custo: 145.20,
      alcance: 3200,
      impressoes: 6400,
      frequencia: 1.9,
      orcamento: 400,
      investido: 380
    },
    monthlyData: {
      conversas: 128,
      custo: 580.80,
      alcance: 12800,
      impressoes: 25600,
      frequencia: 2.0,
      orcamento: 1600,
      investido: 1520
    }
  }
];

export default function DashboardsManagement() {
  const [selectedClient, setSelectedClient] = useState<string>("");
  const [editingField, setEditingField] = useState<string>("");
  const [editValues, setEditValues] = useState<any>({});

  const handleEdit = (field: string, currentValue: any) => {
    setEditingField(field);
    setEditValues({ [field]: currentValue });
  };

  const handleSave = (clientId: number, field: string) => {
    // TODO: Save to database
    console.log(`Saving ${field} for client ${clientId}:`, editValues[field]);
    setEditingField("");
    setEditValues({});
  };

  const handleCancel = () => {
    setEditingField("");
    setEditValues({});
  };

  const selectedClientData = mockClientData.find(client => client.id.toString() === selectedClient);

  const renderEditableField = (
    clientId: number,
    field: string,
    value: any,
    label: string,
    type: string = "text"
  ) => {
    const isEditing = editingField === `${clientId}-${field}`;
    
    return (
      <div className="flex items-center gap-2">
        <Label className="min-w-[120px] text-sm">{label}:</Label>
        {isEditing ? (
          <div className="flex items-center gap-2 flex-1">
            <Input
              type={type}
              value={editValues[`${clientId}-${field}`] || value}
              onChange={(e) => setEditValues({
                ...editValues,
                [`${clientId}-${field}`]: e.target.value
              })}
              className="flex-1"
            />
            <Button 
              size="sm" 
              onClick={() => handleSave(clientId, field)}
              className="h-8 w-8 p-0"
            >
              <Save className="h-4 w-4" />
            </Button>
            <Button 
              size="sm" 
              variant="outline" 
              onClick={handleCancel}
              className="h-8 w-8 p-0"
            >
              <X className="h-4 w-4" />
            </Button>
          </div>
        ) : (
          <div className="flex items-center gap-2 flex-1">
            <span className="flex-1">{value}</span>
            <Button 
              size="sm" 
              variant="ghost" 
              onClick={() => handleEdit(`${clientId}-${field}`, value)}
              className="h-8 w-8 p-0"
            >
              <Edit className="h-4 w-4" />
            </Button>
          </div>
        )}
      </div>
    );
  };

  return (
    <div className="container mx-auto p-6">
      <div className="mb-8">
        <h1 className="text-3xl font-bold mb-2">Gerenciamento de Dashboards</h1>
        <p className="text-muted-foreground">
          Gerencie os dados dos dashboards que serão exibidos aos clientes
        </p>
      </div>

      {/* Client Selection */}
      <Card className="mb-6">
        <CardHeader>
          <CardTitle>Selecionar Cliente</CardTitle>
          <CardDescription>
            Escolha um cliente para editar os dados do dashboard
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Select value={selectedClient} onValueChange={setSelectedClient}>
            <SelectTrigger className="max-w-sm">
              <SelectValue placeholder="Selecione um cliente..." />
            </SelectTrigger>
            <SelectContent>
              {mockClientData.map((client) => (
                <SelectItem key={client.id} value={client.id.toString()}>
                  {client.name} - {client.company}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </CardContent>
      </Card>

      {/* Client Dashboard Data */}
      {selectedClientData && (
        <Card>
          <CardHeader>
            <CardTitle>
              Dashboard: {selectedClientData.name} - {selectedClientData.company}
            </CardTitle>
            <CardDescription>
              Edite os dados que serão exibidos no dashboard do cliente
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Tabs defaultValue="weekly" className="space-y-4">
              <TabsList>
                <TabsTrigger value="weekly">Dados Semanais</TabsTrigger>
                <TabsTrigger value="monthly">Dados Mensais</TabsTrigger>
              </TabsList>

              <TabsContent value="weekly" className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-4">
                    <h3 className="font-semibold text-lg">Métricas de Performance</h3>
                    {renderEditableField(
                      selectedClientData.id,
                      "weekly-conversas",
                      selectedClientData.weeklyData.conversas,
                      "Conversas Iniciadas",
                      "number"
                    )}
                    {renderEditableField(
                      selectedClientData.id,
                      "weekly-custo",
                      `R$ ${selectedClientData.weeklyData.custo}`,
                      "Custo Total"
                    )}
                    {renderEditableField(
                      selectedClientData.id,
                      "weekly-alcance",
                      selectedClientData.weeklyData.alcance.toLocaleString(),
                      "Alcance",
                      "number"
                    )}
                    {renderEditableField(
                      selectedClientData.id,
                      "weekly-impressoes",
                      selectedClientData.weeklyData.impressoes.toLocaleString(),
                      "Impressões",
                      "number"
                    )}
                  </div>
                  
                  <div className="space-y-4">
                    <h3 className="font-semibold text-lg">Dados Financeiros</h3>
                    {renderEditableField(
                      selectedClientData.id,
                      "weekly-frequencia",
                      selectedClientData.weeklyData.frequencia,
                      "Frequência",
                      "number"
                    )}
                    {renderEditableField(
                      selectedClientData.id,
                      "weekly-orcamento",
                      `R$ ${selectedClientData.weeklyData.orcamento}`,
                      "Orçamento Diário"
                    )}
                    {renderEditableField(
                      selectedClientData.id,
                      "weekly-investido",
                      `R$ ${selectedClientData.weeklyData.investido}`,
                      "Valor Investido"
                    )}
                  </div>
                </div>
              </TabsContent>

              <TabsContent value="monthly" className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-4">
                    <h3 className="font-semibold text-lg">Métricas de Performance</h3>
                    {renderEditableField(
                      selectedClientData.id,
                      "monthly-conversas",
                      selectedClientData.monthlyData.conversas,
                      "Conversas Iniciadas",
                      "number"
                    )}
                    {renderEditableField(
                      selectedClientData.id,
                      "monthly-custo",
                      `R$ ${selectedClientData.monthlyData.custo}`,
                      "Custo Total"
                    )}
                    {renderEditableField(
                      selectedClientData.id,
                      "monthly-alcance",
                      selectedClientData.monthlyData.alcance.toLocaleString(),
                      "Alcance",
                      "number"
                    )}
                    {renderEditableField(
                      selectedClientData.id,
                      "monthly-impressoes",
                      selectedClientData.monthlyData.impressoes.toLocaleString(),
                      "Impressões",
                      "number"
                    )}
                  </div>
                  
                  <div className="space-y-4">
                    <h3 className="font-semibold text-lg">Dados Financeiros</h3>
                    {renderEditableField(
                      selectedClientData.id,
                      "monthly-frequencia",
                      selectedClientData.monthlyData.frequencia,
                      "Frequência",
                      "number"
                    )}
                    {renderEditableField(
                      selectedClientData.id,
                      "monthly-orcamento",
                      `R$ ${selectedClientData.monthlyData.orcamento}`,
                      "Orçamento Mensal"
                    )}
                    {renderEditableField(
                      selectedClientData.id,
                      "monthly-investido",
                      `R$ ${selectedClientData.monthlyData.investido}`,
                      "Valor Investido"
                    )}
                  </div>
                </div>
              </TabsContent>
            </Tabs>

            <div className="mt-6 pt-6 border-t">
              <Button className="w-full">
                Salvar Todas as Alterações
              </Button>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
}