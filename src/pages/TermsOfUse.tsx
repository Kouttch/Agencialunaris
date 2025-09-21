import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";

const TermsOfUse = () => {
  return (
    <div className="min-h-screen">
      <Header />
      <main className="container mx-auto px-4 py-20">
        <div className="max-w-4xl mx-auto">
          <h1 className="text-4xl font-bold text-center mb-8">📄 Termos de Uso – Lunaris Agência de Tráfego</h1>
          
          <div className="glass p-8 rounded-lg space-y-8">
            <section>
              <h2 className="text-2xl font-semibold mb-4">1. Aceitação dos Termos</h2>
              <p className="text-muted-foreground leading-relaxed">
                Ao acessar e utilizar o portal da Lunaris Agência de Tráfego ("Lunaris"), o cliente concorda integralmente com os presentes Termos de Uso. Caso não concorde, recomenda-se não utilizar a plataforma.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-semibold mb-4">2. Objetivo da Plataforma</h2>
              <p className="text-muted-foreground mb-4">O portal tem como finalidade disponibilizar aos clientes Lunaris:</p>
              <ul className="list-disc list-inside text-muted-foreground space-y-2 ml-4">
                <li>Acesso a dashboards de desempenho de campanhas;</li>
                <li>Solicitação de PIX para pagamento das campanhas;</li>
                <li>Comunicação direta com os gestores de tráfego responsáveis;</li>
                <li>Consulta ao plano contratado e suas condições;</li>
                <li>Acesso a estratégias de anúncios e relatórios;</li>
                <li>Suporte especializado;</li>
                <li>Gerenciamento de perfil e atualização de senha.</li>
              </ul>
            </section>

            <section>
              <h2 className="text-2xl font-semibold mb-4">3. Segurança e Responsabilidade</h2>
              <div className="space-y-3 text-muted-foreground">
                <p><strong>3.1.</strong> O acesso ao portal é pessoal e intransferível, mediante login e senha cadastrados pelo cliente.</p>
                <p><strong>3.2.</strong> A Lunaris adota medidas técnicas e organizacionais para proteger os dados dos clientes.</p>
                <p><strong>3.3.</strong> O portal não concede acesso direto às contas de Facebook/Meta dos clientes. Apenas os gestores autorizados da Lunaris têm acesso seguro às contas de anúncios, garantindo que não haja risco de uso indevido.</p>
                <p><strong>3.4.</strong> O cliente é responsável por manter a confidencialidade de suas credenciais de acesso.</p>
              </div>
            </section>

            <section>
              <h2 className="text-2xl font-semibold mb-4">4. Pagamentos</h2>
              <div className="space-y-3 text-muted-foreground">
                <p><strong>4.1.</strong> Os valores referentes às campanhas devem ser quitados via PIX, conforme solicitado pelo cliente no portal.</p>
                <p><strong>4.2.</strong> A liberação e execução das campanhas estão condicionadas à confirmação do pagamento.</p>
              </div>
            </section>

            <section>
              <h2 className="text-2xl font-semibold mb-4">5. Planos e Serviços</h2>
              <div className="space-y-3 text-muted-foreground">
                <p><strong>5.1.</strong> O cliente poderá consultar no portal o plano contratado (Bronze, Prata ou Ouro, ou outro vigente no momento).</p>
                <p><strong>5.2.</strong> Alterações de plano devem ser formalizadas diretamente com a Lunaris.</p>
                <p><strong>5.3.</strong> Os serviços disponíveis respeitam os limites do plano vigente, conforme contrato.</p>
              </div>
            </section>

            <section>
              <h2 className="text-2xl font-semibold mb-4">6. Suporte e Comunicação</h2>
              <div className="space-y-3 text-muted-foreground">
                <p><strong>6.1.</strong> O cliente terá acesso direto aos gestores de tráfego responsáveis por sua conta.</p>
                <p><strong>6.2.</strong> O suporte será prestado dentro do horário comercial, por meio dos canais oficiais disponibilizados pela Lunaris.</p>
              </div>
            </section>

            <section>
              <h2 className="text-2xl font-semibold mb-4">7. Propriedade Intelectual</h2>
              <p className="text-muted-foreground">
                <strong>7.1.</strong> Todo o conteúdo disponibilizado no portal, incluindo relatórios, estratégias e materiais de apoio, é de propriedade da Lunaris, sendo vedada sua reprodução ou uso indevido sem autorização expressa.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-semibold mb-4">8. Alterações nos Termos</h2>
              <div className="space-y-3 text-muted-foreground">
                <p><strong>8.1.</strong> A Lunaris poderá atualizar estes Termos de Uso a qualquer momento, cabendo ao cliente consultá-los periodicamente.</p>
                <p><strong>8.2.</strong> Alterações relevantes serão comunicadas por e-mail ou diretamente no portal.</p>
              </div>
            </section>

            <section>
              <h2 className="text-2xl font-semibold mb-4">9. Limitação de Responsabilidade</h2>
              <div className="space-y-3 text-muted-foreground">
                <p><strong>9.1.</strong> A Lunaris não se responsabiliza por falhas técnicas, indisponibilidades temporárias ou problemas decorrentes de força maior.</p>
                <p><strong>9.2.</strong> O cliente reconhece que os resultados de campanhas podem variar conforme fatores externos (mercado, concorrência, sazonalidade, etc.), não sendo garantias absolutas de performance.</p>
              </div>
            </section>

            <section>
              <h2 className="text-2xl font-semibold mb-4">10. Disposições Gerais</h2>
              <div className="space-y-3 text-muted-foreground">
                <p><strong>10.1.</strong> Estes Termos de Uso regem-se pela legislação brasileira.</p>
                <p><strong>10.2.</strong> Eventuais conflitos serão solucionados no foro da comarca de Guarulhos/SP.</p>
              </div>
            </section>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
};

export default TermsOfUse;