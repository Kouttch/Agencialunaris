import CampaignNameManager from "@/components/CampaignNameManager";

export default function CampaignNamesManagement() {
  return (
    <div className="container mx-auto p-6 pb-24">
      <div className="mb-10">
        <h1 className="text-3xl font-bold mb-2">Gerenciar Nomes de Campanhas</h1>
        <p className="text-muted-foreground">
          Personalize os nomes das campanhas exibidos aos clientes
        </p>
      </div>

      <CampaignNameManager />
    </div>
  );
}