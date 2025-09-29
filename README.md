# Agência Lunaris - Portal de Tráfego Pago

Portal exclusivo da Agência Lunaris para clientes com dashboards avançados e gestão completa de campanhas.

## 🚀 Deploy no GitHub Pages

Para ativar o GitHub Pages e fazer o site funcionar corretamente:

### 1. Configurar GitHub Pages no repositório
1. Vá em **Settings** do repositório
2. Na seção **Pages** (menu lateral esquerdo)
3. Em **Source**, selecione **"GitHub Actions"**

### 2. O Deploy Automático já está configurado
- O arquivo `.github/workflows/deploy.yml` já está configurado
- O deploy acontece automaticamente a cada push na branch `main`
- O site será gerado na pasta `dist` e publicado no GitHub Pages

### 3. Aguardar o primeiro deploy
- Após configurar o Pages, faça um push na branch `main`
- O workflow será executado automaticamente
- O site estará disponível em: `https://seuusuario.github.io/nome-do-repo/`

### 4. Configurações importantes já aplicadas:
- ✅ Arquivo `.nojekyll` criado (evita processamento Jekyll)
- ✅ Arquivo `404.html` para SPA routing
- ✅ Script no `index.html` para roteamento correto
- ✅ Configuração do Vite otimizada para GitHub Pages

## 🛠️ Desenvolvimento Local

```bash
# Instalar dependências
npm install

# Executar em desenvolvimento
npm run dev

# Build para produção
npm run build

# Preview do build
npm run preview
```

## 📱 Tecnologias Utilizadas

- React 18
- TypeScript
- Tailwind CSS  
- Vite
- React Router
- Radix UI
- Framer Motion
- Supabase

## 🎨 Recursos

- Design responsivo e moderno
- Sistema de autenticação
- Dashboards interativos
- Tema dark/light
- Animações fluidas
- SEO otimizado

---

## Como usar Lovable

**URL do Projeto**: https://lovable.dev/projects/a51ebd63-21ca-4ba1-8af3-65d4ac15326c

Você pode editar este projeto diretamente no [Lovable](https://lovable.dev/projects/a51ebd63-21ca-4ba1-8af3-65d4ac15326c) ou usar seu IDE preferido clonando este repositório.
