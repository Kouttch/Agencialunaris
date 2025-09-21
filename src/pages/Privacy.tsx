import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";

const Privacy = () => {
  return (
    <div className="min-h-screen">
      <Header />
      <main className="container mx-auto px-4 py-20">
        <div className="max-w-4xl mx-auto">
          <h1 className="text-4xl font-bold text-center mb-8">📄 Política de Privacidade – Lunaris Agência de Tráfego</h1>
          
          <div className="glass p-8 rounded-lg space-y-8">
            <section>
              <h2 className="text-2xl font-semibold mb-4">1. Introdução</h2>
              <p className="text-muted-foreground leading-relaxed">
                A Lunaris Agência de Tráfego ("Lunaris") respeita a privacidade e a proteção dos dados pessoais de seus clientes e visitantes.
                Esta Política de Privacidade explica como coletamos, utilizamos, armazenamos e protegemos suas informações ao utilizar nosso portal e serviços.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-semibold mb-4">2. Coleta de Dados Pessoais</h2>
              <p className="text-muted-foreground mb-4">Podemos coletar as seguintes informações:</p>
              <ul className="list-disc list-inside text-muted-foreground space-y-2 ml-4">
                <li>Dados cadastrais: nome, e-mail, telefone, CPF/CNPJ;</li>
                <li>Dados de acesso: login, senha e registros de navegação;</li>
                <li>Informações de pagamento: comprovantes e solicitações via PIX;</li>
                <li>Dados de uso da plataforma: interações com dashboards, relatórios e solicitações de suporte.</li>
              </ul>
            </section>

            <section>
              <h2 className="text-2xl font-semibold mb-4">3. Finalidade da Coleta</h2>
              <p className="text-muted-foreground mb-4">Os dados coletados têm as seguintes finalidades:</p>
              <ul className="list-disc list-inside text-muted-foreground space-y-2 ml-4">
                <li>Gerenciar o acesso ao portal e às funcionalidades disponíveis;</li>
                <li>Permitir a solicitação e controle de pagamentos das campanhas;</li>
                <li>Facilitar a comunicação com os gestores de tráfego;</li>
                <li>Garantir o suporte técnico e operacional;</li>
                <li>Cumprir obrigações legais e regulatórias.</li>
              </ul>
            </section>

            <section>
              <h2 className="text-2xl font-semibold mb-4">4. Compartilhamento de Dados</h2>
              <div className="space-y-3 text-muted-foreground">
                <p><strong>4.1.</strong> A Lunaris não compartilha dados pessoais com terceiros para fins comerciais.</p>
                <p><strong>4.2.</strong> O compartilhamento poderá ocorrer apenas:</p>
                <ul className="list-disc list-inside ml-4 space-y-1">
                  <li>Com prestadores de serviço necessários à execução dos contratos (ex: ferramentas de gestão de tráfego);</li>
                  <li>Quando exigido por lei, ordem judicial ou autoridades competentes.</li>
                </ul>
              </div>
            </section>

            <section>
              <h2 className="text-2xl font-semibold mb-4">5. Armazenamento e Segurança</h2>
              <div className="space-y-3 text-muted-foreground">
                <p><strong>5.1.</strong> Os dados são armazenados em ambientes seguros, com uso de criptografia, controle de acesso e monitoramento.</p>
                <p><strong>5.2.</strong> Apenas gestores autorizados da Lunaris têm acesso às contas de anúncios, sem que haja acesso direto às contas pessoais de Facebook/Meta do cliente.</p>
                <p><strong>5.3.</strong> O cliente é responsável por manter a confidencialidade de suas credenciais de login.</p>
              </div>
            </section>

            <section>
              <h2 className="text-2xl font-semibold mb-4">6. Direitos do Titular de Dados</h2>
              <p className="text-muted-foreground mb-4">Em conformidade com a LGPD, o cliente pode:</p>
              <ul className="list-disc list-inside text-muted-foreground space-y-2 ml-4">
                <li>Confirmar a existência de tratamento de seus dados;</li>
                <li>Solicitar acesso, correção, atualização ou exclusão de informações;</li>
                <li>Solicitar portabilidade para outro fornecedor de serviço;</li>
                <li>Revogar o consentimento a qualquer momento.</li>
              </ul>
              <p className="text-muted-foreground mt-4">
                Para exercer esses direitos, o cliente deve entrar em contato pelo canal oficial da Lunaris: [e-mail de contato].
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-semibold mb-4">7. Uso de Cookies</h2>
              <div className="space-y-3 text-muted-foreground">
                <p><strong>7.1.</strong> O portal poderá utilizar cookies e tecnologias semelhantes para melhorar a experiência do usuário, como:</p>
                <ul className="list-disc list-inside ml-4 space-y-1">
                  <li>Lembrar preferências de login;</li>
                  <li>Coletar dados estatísticos de navegação;</li>
                  <li>Aperfeiçoar funcionalidades do site.</li>
                </ul>
                <p><strong>7.2.</strong> O usuário pode desativar cookies no navegador, ciente de que algumas funcionalidades podem ser prejudicadas.</p>
              </div>
            </section>

            <section>
              <h2 className="text-2xl font-semibold mb-4">8. Alterações na Política</h2>
              <p className="text-muted-foreground">
                A Lunaris poderá atualizar esta Política de Privacidade a qualquer momento, visando atender requisitos legais ou aprimorar seus serviços. As alterações serão comunicadas no portal ou por e-mail.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-semibold mb-4">9. Foro e Legislação Aplicável</h2>
              <p className="text-muted-foreground">
                Esta Política é regida pela legislação brasileira. Eventuais conflitos serão solucionados no foro da comarca de Guarulhos/SP.
              </p>
            </section>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
};

export default Privacy;