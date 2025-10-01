import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { 
  BarChart3, 
  CreditCard, 
  Download, 
  MessageSquare, 
  Shield, 
  TrendingUp,
  Users,
  Zap
} from "lucide-react";
import { useNavigate } from "react-router-dom";

const features = [
  {
    icon: BarChart3,
    title: "Dashboards Semanais e Mensais",
    description: "Visualize métricas detalhadas: conversas iniciadas, custo por conversa, alcance, impressões, frequência e muito mais.",
    link: "/minha-conta",
  },
  {
    icon: CreditCard,
    title: "Gestão de Pagamentos",
    description: "Acompanhe status de pagamentos, recargas via PIX e histórico financeiro completo em tempo real.",
    link: "/minha-conta",
  },
  {
    icon: Download,
    title: "Estratégias Exclusivas",
    description: "Baixe materiais personalizados enviados pela equipe de gestores para otimizar suas campanhas.",
    link: "/minha-conta",
  },
  {
    icon: MessageSquare,
    title: "Sistema de Feedbacks",
    description: "Canal direto com sua equipe para enviar sugestões e acompanhar melhorias contínuas.",
  },
  {
    icon: Shield,
    title: "Segurança Avançada",
    description: "Dados protegidos com criptografia de ponta e autenticação segura via Supabase.",
  },
  {
    icon: Users,
    title: "Gestor Dedicado",
    description: "Cada cliente tem um gestor responsável identificado no portal para suporte personalizado.",
  },
];

export const Features = () => {
  const navigate = useNavigate();

  return (
    <section className="py-24 px-4 bg-gradient-to-b from-background to-card/30">
      <div className="container mx-auto">
        <div className="text-center mb-16">
          <h2 className="text-4xl md:text-6xl font-bold mb-6">
            <span className="bg-gradient-to-r from-foreground to-primary bg-clip-text text-transparent">
              Recursos Avançados
            </span>
          </h2>
          <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
            Uma plataforma completa com tudo que você precisa para acompanhar e otimizar 
            suas campanhas de tráfego pago com tecnologia de ponta.
          </p>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
          {features.map((feature, index) => (
            <Card 
              key={index} 
              className="glass border-glass-border hover:shadow-glow transition-all duration-500 group cursor-pointer"
              onClick={() => feature.link && navigate(feature.link)}
            >
              <CardHeader className="text-center">
                <div className="w-12 h-12 bg-gradient-to-br from-primary to-primary-glow rounded-lg flex items-center justify-center mb-4 group-hover:animate-pulse mx-auto">
                  <feature.icon className="w-6 h-6 text-primary-foreground" />
                </div>
                <CardTitle className="text-xl group-hover:text-primary transition-colors">
                  {feature.title}
                </CardTitle>
              </CardHeader>
              <CardContent>
                <CardDescription className="text-muted-foreground leading-relaxed">
                  {feature.description}
                </CardDescription>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Advertising Platforms Section */}
        <div className="mt-24">
          <div className="text-center mb-12">
            <h3 className="text-3xl md:text-4xl font-bold mb-4">
              <span className="bg-gradient-to-r from-primary to-primary-glow bg-clip-text text-transparent">
                Onde Anunciamos
              </span>
            </h3>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
              Expertise completa nas principais plataformas de publicidade digital
            </p>
          </div>
          
          <div className="grid md:grid-cols-3 gap-8 mb-16">
            <Card className="glass border-glass-border hover:shadow-glow transition-all duration-500 group text-center">
              <CardHeader>
                <div className="w-16 h-16 bg-gradient-to-br from-blue-500 to-blue-600 rounded-lg flex items-center justify-center mb-4 group-hover:animate-pulse mx-auto">
                  <span className="text-2xl font-bold text-white">f</span>
                </div>
                <CardTitle className="text-xl group-hover:text-primary transition-colors">
                  Meta Ads
                </CardTitle>
              </CardHeader>
              <CardContent>
                <CardDescription className="text-muted-foreground">
                  Facebook e Instagram Ads com segmentação avançada e otimização contínua para máximo ROI.
                </CardDescription>
              </CardContent>
            </Card>

            <Card className="glass border-glass-border hover:shadow-glow transition-all duration-500 group text-center">
              <CardHeader>
                <div className="w-16 h-16 bg-gradient-to-br from-red-500 to-yellow-500 rounded-lg flex items-center justify-center mb-4 group-hover:animate-pulse mx-auto">
                  <span className="text-2xl font-bold text-white">G</span>
                </div>
                <CardTitle className="text-xl group-hover:text-primary transition-colors">
                  Google Ads
                </CardTitle>
              </CardHeader>
              <CardContent>
                <CardDescription className="text-muted-foreground">
                  Campanhas de busca, display e shopping otimizadas para capturar leads qualificados.
                </CardDescription>
              </CardContent>
            </Card>

            <Card className="glass border-glass-border hover:shadow-glow transition-all duration-500 group text-center">
              <CardHeader>
                <div className="w-16 h-16 bg-gradient-to-br from-pink-500 to-purple-600 rounded-lg flex items-center justify-center mb-4 group-hover:animate-pulse mx-auto">
                  <TrendingUp className="w-8 h-8 text-white" />
                </div>
                <CardTitle className="text-xl group-hover:text-primary transition-colors">
                  TikTok Ads Manager
                </CardTitle>
              </CardHeader>
              <CardContent>
                <CardDescription className="text-muted-foreground">
                  Campanhas criativas e envolventes na plataforma que mais cresce no mundo digital.
                </CardDescription>
              </CardContent>
            </Card>
          </div>
        </div>

        {/* Stats section */}
        <div className="mt-16 grid md:grid-cols-4 gap-8">
          {[
            { number: "+88%", label: "Taxa de aproveitamento de criativos" },
            { number: "20+", label: "Clientes Ativos" },
            { number: "R$ 500K+", label: "Investido em Anúncios" },
            { number: "+7", label: "Atuação em estados do Brasil" },
          ].map((stat, index) => (
            <div key={index} className="text-center">
              <div className="text-4xl md:text-5xl font-black text-primary mb-2">
                {stat.number}
              </div>
              <div className="text-muted-foreground font-medium">
                {stat.label}
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};