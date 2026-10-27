# Calabouço Restaurante e Pizzaria — site

Site do Calabouço (Rua Mateus Leme, 1000 — Centro Cívico, Curitiba/PR), feito com React + TypeScript + Vite.

O objetivo é que o cliente, em poucos segundos, entenda o que é a casa, se convença a ir e saiba como fazer isso: o que tem no cardápio, onde fica e como ligar. Por isso a página é uma só, com poucos botões, todos levando a uma ação concreta (ver o cardápio, ligar, traçar a rota, abrir o Instagram).

| Página | Arquivo | Conteúdo |
|---|---|---|
| Inicial | `index.html` | Abertura, motivos para ir, cardápio completo, ambiente, história e contato |
| Página não encontrada | `404.html` | Usada pelo GitHub Pages para qualquer endereço inexistente; leva ao cardápio e à inicial |

Não tem backend, formulários, login, carrinho, reservas, analytics nem rastreadores, e não carrega fontes ou scripts externos.

## Como executar

```bash
npm install
npm run dev        # desenvolvimento em http://localhost:5173
npm run build      # gera dist/ (typecheck + build)
npm run preview    # serve o build em http://localhost:4173
npm run lint       # ESLint
npm run typecheck  # TypeScript
npm run images     # regera as imagens otimizadas a partir dos originais
npm run icons      # regera favicon, ícones de celular e o manifesto
npm run og         # regera a imagem de compartilhamento (requer Playwright)
```

Sem variáveis de ambiente, o build usa caminhos relativos (`./`): a pasta `dist/` funciona em qualquer subdiretório de qualquer servidor.

## Publicar

### GitHub Pages (recomendado, já configurado)

O workflow `.github/workflows/deploy.yml` roda a cada push: instala, roda o lint e gera o site. Na branch padrão do repositório, ele também publica no GitHub Pages.

Para ativar, uma única vez:

1. No GitHub, abra o repositório → **Settings** → **Pages**.
2. Em **Build and deployment → Source**, escolha **GitHub Actions**.
3. Abra **Actions** → **Publicar site** → **Run workflow** (ou faça qualquer push na branch padrão).

O site fica em `https://blockl14.github.io/calabouco_restaurante/` (o cardápio em `…/#cardapio`). Enquanto o Pages não estiver ativado, o workflow só gera o site e mostra um aviso, sem falhar.

**Domínio próprio:** em Settings → Pages → **Custom domain**, informe o domínio e crie no provedor de DNS o registro indicado pelo GitHub (CNAME para `blockl14.github.io`, ou registros A para o domínio raiz). O workflow passa o endereço do Pages para o build, então canonical, Open Graph, dados estruturados e sitemap passam a usar o domínio novo na publicação seguinte.

### Outro servidor

Rode `npm run build` e envie o conteúdo de `dist/` para a pasta pública do servidor (FTP, painel de hospedagem, Netlify, Vercel, Cloudflare Pages etc.). Para que os links de compartilhamento e o sitemap usem o endereço certo, gere com:

```bash
SITE_URL=https://www.seudominio.com.br npm run build
```

Se o site ficar numa subpasta e você quiser caminhos absolutos (necessário para a página 404 em endereços com várias barras), acrescente `BASE_PATH=/subpasta`.

### O que vai junto no build

- `robots.txt` e `sitemap.xml` (gerados com `SITE_URL`).
- Canonical, Open Graph e Twitter Card com endereço absoluto e imagem de compartilhamento 1200 × 630 (`public/og-calabouco.jpg`).
- Dados estruturados: `Restaurant` (endereço, telefone, Instagram, link do cardápio) e `Menu` (todas as categorias, grupos e itens, gerados de `src/content/menu.ts`).
- Favicon em SVG e PNG, ícone para iPhone/Android e `site.webmanifest`.
- Política de segurança de conteúdo (CSP) em cada página: só recursos do próprio site.

## Estrutura da página

| Parte | Componente | O que faz |
|---|---|---|
| Cabeçalho | `src/components/Header` | Fixo. Marca, links Cardápio · Ambiente · Visite (marca a seção visível) e o telefone. No celular, só a marca e “Cardápio” |
| Abertura | `src/components/Hero` | O que é, onde fica e desde quando, em uma frase; “Ver o cardápio” e “Como chegar”; endereço e telefone; mosaico com três fotos da casa e o selo “desde 1991” |
| Motivos | `src/components/Reasons` | Faixa curta: ambiente medieval, pizzas da casa, desde 1991 |
| Cardápio | `src/components/Menu` | Destaques (pizzas com nomes de castelo, Coroa Real, pizzas doces, cada um com link para a categoria) e o cardápio completo em abas: Pizzas, Entradas, Pratos, Sobremesas e Bebidas. No celular, cada categoria mostra 12 itens e “Ver todos” |
| Ambiente | `src/components/Ambience` | Faixa escura com quatro fotos da casa e legendas |
| Visite | `src/components/Visit` | História curta e um cartão com endereço (“Como chegar”), telefone (“Ligar”), horários (“consulte pelo telefone”) e Instagram (“Abrir”) |
| Rodapé | `src/components/Footer` | Marca, crédito da foto e “Voltar ao topo” |
| Barra do celular | `src/components/ActionBar` | Abaixo de 900 px: “Ligar” e “Como chegar” fixos na base da tela, que aparecem quando os botões da abertura saem da tela |
| 404 | `src/pages/NotFoundPage.tsx` | Mensagem e botões para o cardápio e a inicial |

Cada página tem a sua entrada (`src/main.tsx`, `src/notfound-main.tsx`), com a base comum de `src/setup.ts`. Os links entre páginas usam `src/lib/routes.ts`.

### Acessibilidade e uso

- Link “Pular para o conteúdo”, regiões (`header`, `nav`, `main`, `footer`) e títulos em ordem.
- Abas do cardápio no padrão ARIA, com setas, Home e End no teclado; o botão “Ver todos” informa se a lista está aberta.
- Foco sempre visível; alvos de toque com pelo menos 44 px; sem rolagem horizontal de 320 px em diante.
- Com “reduzir movimento” ativado no sistema, sem rolagem suave nem animações de entrada.
- Contraste de todo o texto medido sobre o fundo real (inclusive fotos) de 320 a 1920 px: o menor é 5,5:1.

## Onde editar

| O quê | Arquivo |
|---|---|
| Nome, endereço, telefone, links e menu de navegação | `src/content/business.ts` |
| Textos das seções (abertura, motivos, cardápio, ambiente, visite) | `src/content/site.ts` |
| Cardápio (categorias, grupos, itens, Coroa Real, observação) | `src/content/menu.ts` |
| Texto alternativo, enquadramento por breakpoint e crédito das imagens | `src/content/images.ts` |
| Cores, fontes, espaçamentos e durações de animação | `src/styles/tokens.css` |
| Botões, links de texto, sobretítulos e títulos | `src/styles/base.css` |
| Título, descrição e dados de compartilhamento | `index.html` |
| Endereço do site, CSP, sitemap e dados estruturados do cardápio | `vite.config.ts` |

### Trocar ou acrescentar fotos

1. Coloque o original em `assets-src/originais/` (os originais nunca são alterados).
2. Registre-o em `JOBS` no arquivo `scripts/optimize-images.mjs` (recorte opcional e larguras).
3. Rode `npm run images`. O script gera AVIF + WebP em `public/images/` e atualiza `src/content/image-manifest.json`. As fotos não recebem tratamento de cor.
4. Descreva a imagem e ajuste o enquadramento (`position.base / md / lg`) em `src/content/images.ts`.

O logotipo está provisoriamente em tipografia, com uma coroa desenhada para a interface (classe `.brand`); não é o brasão oficial. Quando houver arquivo vetorial do logo, basta substituir esse bloco e rodar `npm run icons` com a nova marca.

## Identidade visual

- **Títulos:** Fraunces (serifada, peso 600). **Texto, botões e sobretítulos:** Manrope. Só o subconjunto latino de cada uma, pré-carregado (37 KB e 25 KB).
- **Cores:** fundo creme `#f6efe6`, texto marrom quase preto `#1e1613`, terracota dos arcos de tijolo `#a3361d` nos botões e destaques, faixas escuras `#18110e` no ambiente e no rodapé.
- **Fotos:** as da casa, sem tratamento de cor, em cantos arredondados; nenhuma é esticada além da proporção original. Nenhuma imagem gerada por IA foi usada.
- **Ícones e selo:** desenhados em SVG para o site (coroa, arco, fatia de pizza, selo “desde 1991”).

## Materiais usados

| Original (em `assets-src/`) | Conteúdo | Dimensões | Uso |
|---|---|---|---|
| `originais/arte-corredor-abra-as-portas.webp` | Corredor de arcos, grades, tocha e escudo; frase “Abra as portas…”; crédito @gabrielmessine | 683×857 | Recorte sem a frase (com o crédito) no mosaico da abertura e no Ambiente |
| `originais/foto-queijo-puxado.webp` | Massa assada com queijo esticando; salão com velas ao fundo | 680×849 | Foto principal da abertura (sem o fragmento “…uço” da borda); recorte das velas no Ambiente; imagem de compartilhamento |
| `originais/arte-pizza-desde-1991.webp` | Forno, logotipo, “Restaurante e Pizzaria à la carte — Desde 1991”, pizza | 684×855 | Recorte só da pizza no destaque “Pizzas com nomes de castelo” |
| `originais/arte-fachada-tradicao-curitibana.webp` | Entrada em arco com o letreiro; faixa “Tradição curitibana” | 686×856 | Recorte do letreiro no mosaico da abertura e no Ambiente; arte completa no Ambiente |
| `referencias/cardapio-fotografado.webp` | Cardápio fotografado | 556×829 | Fonte do cardápio (não publicado) |

Os originais têm cerca de 680 px de largura, o que limita a nitidez em telas grandes. Por isso as fotos aparecem em blocos de até cerca de meia tela, em vez de ocupar a largura inteira.

## Decisões de conteúdo

- **Cardápio transcrito da foto do cardápio da casa**, apenas dos trechos legíveis, com a grafia original (“alici”, “caipira”, “spaghetti, tagliarini ou penne”). Ficaram de fora as linhas apagadas ou ilegíveis na foto (algumas entradas, sucos e rótulos de vinho). A “Burrata com rúcula e pesto genovese” veio da lista do briefing.
- **Bebidas** (vinhos, caipiras e batidas, aperitivos, cervejas, whiskies, licores, refrigerantes e sucos, café e chá) também vêm da foto. Os vinhos aparecem numa lista única, como no cardápio, sem separar por cor.
- **Nada de preços, gramaturas ou tamanhos**: há versões do cardápio com valores diferentes. A página traz “Consulte a casa sobre valores e disponibilidade”, com o telefone ao lado.
- **Não publicados**, por estarem na foto mas poderem ter mudado: taxa de serviço e formas de pagamento.
- **A foto do queijo não foi identificada como Coroa Real.** O prato parece compatível, mas o nome não está confirmado. A Coroa Real aparece com a descrição do cardápio e um ícone de coroa.
- **Também não foram publicados**: horários, WhatsApp, delivery, avaliações, história dos proprietários e prêmios. Do mockup de uma versão anterior não foram usados o endereço, o telefone e o horário (que não conferem com a casa) nem as imagens geradas por IA.

## Pendências que dependem da casa

- Logotipo em arquivo utilizável (SVG/PNG em alta resolução).
- Fotografias originais em alta resolução, de preferência do salão e dos pratos (com o nome de cada um), incluindo a Coroa Real.
- Confirmação do cardápio atual (itens, grafias, rótulos de vinho e bebidas) e, se a casa quiser, dos preços.
- Horários completos e se o telefone também atende por WhatsApp.
- Domínio definitivo, se não for usar o endereço do GitHub Pages.
