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

const features = [
  {
    icon: BarChart3,
    title: "Dashboards Semanais e Mensais",
    description: "Visualize métricas detalhadas: conversas iniciadas, custo por conversa, alcance, impressões, frequência e muito mais.",
  },
  {
    icon: CreditCard,
    title: "Gestão de Pagamentos",
    description: "Acompanhe status de pagamentos, recargas via PIX e histórico financeiro completo em tempo real.",
  },
  {
    icon: Download,
    title: "Estratégias Exclusivas",
    description: "Baixe materiais personalizados enviados pela equipe de gestores para otimizar suas campanhas.",
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
            <Card key={index} className="glass border-glass-border hover:shadow-glow transition-all duration-500 group">
              <CardHeader>
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

        {/* Stats section */}
        <div className="mt-24 grid md:grid-cols-4 gap-8">
          {[
            { number: "99.9%", label: "Uptime" },
            { number: "500+", label: "Clientes Ativos" },
            { number: "R$ 50M+", label: "Investimento Gerenciado" },
            { number: "24/7", label: "Suporte" },
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