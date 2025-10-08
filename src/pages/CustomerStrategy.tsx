import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Download, FileText, Calendar } from "lucide-react";
import { useAccountStatus } from "@/hooks/useAccountStatus";
import { DeactivatedAccount } from "@/components/DeactivatedAccount";

// TODO: Fetch from database
const mockDocuments = [
  {
    id: 1,
    title: "Estratégia de Marketing - Janeiro 2025",
    description: "Planejamento estratégico para campanhas do primeiro trimestre",
    uploadDate: "2025-01-15",
    fileUrl: "#",
    size: "2.4 MB"
  },
  {
    id: 2,
    title: "Relatório de Performance Q4 2024",
    description: "Análise detalhada dos resultados do último trimestre",
    uploadDate: "2024-12-20",
    fileUrl: "#",
    size: "1.8 MB"
  },
  {
    id: 3,
    title: "Guia de Boas Práticas",
    description: "Diretrizes e recomendações para otimização de campanhas",
    uploadDate: "2024-11-10",
    fileUrl: "#",
    size: "3.1 MB"
  }
];

export default function CustomerStrategy() {
  const { isActive } = useAccountStatus();
  
  const handleDownload = (doc: typeof mockDocuments[0]) => {
    // TODO: Implement actual download logic
    console.log("Downloading:", doc.title);
  };

  if (!isActive) {
    return <DeactivatedAccount />;
  }

  return (
    <div className="p-6 space-y-6">
      <div>
        <h1 className="text-3xl font-bold mb-2">Estratégias</h1>
        <p className="text-muted-foreground">
          Acesse documentos e materiais estratégicos compartilhados pelo seu gestor
        </p>
      </div>

      <div className="grid gap-4">
        {mockDocuments.map((doc) => (
          <Card key={doc.id} className="hover:shadow-lg transition-shadow">
            <CardHeader>
              <div className="flex items-start justify-between">
                <div className="flex items-start gap-3 flex-1">
                  <div className="p-2 rounded-lg bg-primary/10">
                    <FileText className="h-6 w-6 text-primary" />
                  </div>
                  <div className="flex-1">
                    <CardTitle className="text-lg mb-1">{doc.title}</CardTitle>
                    <CardDescription>{doc.description}</CardDescription>
                  </div>
                </div>
                <Button 
                  onClick={() => handleDownload(doc)}
                  size="sm"
                  className="gap-2"
                >
                  <Download className="h-4 w-4" />
                  Baixar
                </Button>
              </div>
            </CardHeader>
            <CardContent>
              <div className="flex items-center gap-4 text-sm text-muted-foreground">
                <div className="flex items-center gap-1">
                  <Calendar className="h-4 w-4" />
                  {new Date(doc.uploadDate).toLocaleDateString('pt-BR')}
                </div>
                <div>
                  {doc.size}
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {mockDocuments.length === 0 && (
        <Card>
          <CardContent className="flex flex-col items-center justify-center py-12">
            <FileText className="h-12 w-12 text-muted-foreground mb-4" />
            <p className="text-muted-foreground text-center">
              Nenhum documento disponível no momento
            </p>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
