# Calabouço Restaurante e Pizzaria — site

Site do Calabouço (Rua Mateus Leme, 1000 — Centro Cívico, Curitiba/PR), feito com React + TypeScript + Vite. São três páginas estáticas:

| Página | Arquivo | Conteúdo |
|---|---|---|
| Inicial | `index.html` | Abertura, Sobre, destaques, prévia do cardápio, Coroa Real, Ambiente e Visite |
| Cardápio completo | `cardapio.html` | Todas as categorias, com abas presas abaixo do cabeçalho e versão para impressão |
| Página não encontrada | `404.html` | Usada pelo GitHub Pages para qualquer endereço inexistente |

Não tem backend, formulários, analytics nem rastreadores, e não carrega fontes ou scripts externos.

## Como executar

```bash
npm install
npm run dev        # desenvolvimento em http://localhost:5173 (o cardápio fica em /cardapio.html)
npm run build      # gera dist/ (typecheck + build)
npm run preview    # serve o build em http://localhost:4173
npm run lint       # ESLint
npm run images     # regera as imagens otimizadas a partir dos originais
npm run texture    # regera a textura de pedra do fundo (duas resoluções)
npm run wall       # regera a parede de pedra iluminada da seção Visite
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

O site fica em `https://blockl14.github.io/calabouco_restaurante/` (o cardápio em `…/cardapio`). Enquanto o Pages não estiver ativado, o workflow só gera o site e mostra um aviso, sem falhar.

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
- Dados estruturados: `Restaurant` na inicial (endereço, telefone, link do cardápio) e `Menu` no cardápio completo (todas as seções e itens, gerados de `src/content/menu.ts`).
- Favicon em SVG e PNG, ícone para iPhone/Android e `site.webmanifest`.
- Política de segurança de conteúdo (CSP) em cada página: só recursos do próprio site.

## Estrutura

A página inicial segue a interface aprovada pelo cliente (mockup de outubro de 2026), medida seção por seção numa tela de 1440 px; o cardápio completo, o rodapé, o menu do celular, a galeria e a 404 usam o mesmo fundo, fontes, filetes, botões e proporções. Abaixo de 1440 px tudo diminui na mesma proporção; no celular, a imagem vem antes do texto.

| Parte | Componente | Observações |
|---|---|---|
| Cabeçalho | `src/components/Header` | Coroa sobre o nome, menu em versal centralizado, botão “Ver cardápio” (no cardápio, “Como chegar”); encolhe ao rolar; no celular, menu em `<dialog>` |
| Abertura | `src/components/Hero` | “Uma experiência além da pizza”, “Explorar cardápio” e “Conhecer o ambiente”; foto do queijo à direita |
| Sobre nós + destaques | `src/components/About` | “Tradição em cada detalhe” com o letreiro da entrada; faixa com quatro destaques em moldura octogonal |
| Cardápio (inicial) | `src/components/Menu/Menu.tsx` | “Sabores que marcam”; abas Pizzas, Entradas, Pratos, Sobremesas e Bebidas com prévia de cada categoria e link para a categoria completa |
| Coroa Real | `src/components/Menu/Signature.tsx` | Faixa inteira; coroa ilustrada (`CrownIllustration.tsx`) sobre uma mesa, com a luz das velas ao fundo; “Ver no cardápio” abre o destaque no cardápio completo |
| Ambiente | `src/components/Ambience` | Corredor de arcos; o link abre a galeria ampliada (`<dialog>`, quatro imagens) |
| Visite | `src/components/Visit` | Endereço, horário (“consulte pelo telefone”), telefone e Instagram; “Como chegar”; estandarte ilustrado com lampião (`BannerArt.tsx`) |
| Rodapé | `src/components/Footer` | Marca, navegação, contato, endereço e “Como chegar” |
| Cardápio completo | `src/pages/MenuPage.tsx` | Abertura com a pizza, abas presas, uma seção por categoria (ícone em moldura octogonal), Coroa Real em destaque, impressão |
| 404 | `src/pages/NotFoundPage.tsx` | Mensagem e links para a inicial e o cardápio |

Cada página tem a sua entrada (`src/main.tsx`, `src/menu-main.tsx`, `src/notfound-main.tsx`), todas com a base comum de `src/setup.ts`. Os links entre páginas usam `src/lib/routes.ts`.

## Onde editar

| O quê | Arquivo |
|---|---|
| Nome, endereço, telefone, links e menu de navegação | `src/content/business.ts` |
| Textos das seções da inicial e imagem de cada uma | `src/content/home.ts` |
| Cardápio (categorias, grupos, itens, Coroa Real, observação) | `src/content/menu.ts` |
| Fotos da galeria do ambiente | `src/content/gallery.ts` |
| Texto alternativo, enquadramento por breakpoint e crédito das imagens | `src/content/images.ts` |
| Cores, fontes, espaçamentos e durações de animação | `src/styles/tokens.css` |
| Botões, molduras, links de texto, sobretítulos e fundo | `src/styles/base.css` |
| Título, descrição e dados de compartilhamento de cada página | `index.html`, `cardapio.html` |
| Endereço do site, CSP, sitemap e dados estruturados do cardápio | `vite.config.ts` |

### Trocar ou acrescentar fotos

1. Coloque o original em `assets-src/originais/` (os originais nunca são alterados).
2. Registre-o em `JOBS` no arquivo `scripts/optimize-images.mjs` (recorte opcional e larguras).
3. Rode `npm run images`. O script gera AVIF + WebP em `public/images/` e atualiza `src/content/image-manifest.json`. Cada foto pode receber um tratamento de cor (`grade`): escurece médios e sombras, puxa vermelhos e amarelos para o âmbar e tira o excesso de vermelho da iluminação, para chegar ao tom escuro do mockup. Só cor e luz mudam; nada é acrescentado ou removido da cena. A foto da abertura é espelhada (`flop`) para o queijo ficar do lado de fora da página.
4. Descreva a imagem e ajuste o enquadramento (`position.base / md / lg`) em `src/content/images.ts`.

O logotipo está provisoriamente em tipografia, com a coroa da interface (classe `.brand`); não é o brasão oficial. Quando houver arquivo vetorial do logo, basta substituir esse bloco e rodar `npm run icons` com a nova marca.

## Identidade visual

- **Títulos:** Cinzel em versal, fina, em marfim (a Coroa Real em areia).
- **Texto, menu, botões e sobretítulos:** Poppins (400 e 500).
- **Cores:** fundo `#090706`, texto corrido em marfim claro, sobretítulos em bronze com filete e ponta de seta, links e aba ativa em cobre, botões em vinho com filete de cobre e cantos recortados em quarto de círculo (`.btn`; a mesma moldura em painéis: `.ticket-frame`), ícones e coroa em dourado. Todos os textos foram medidos sobre fotos e fundo com contraste de pelo menos 6,3:1.
- **Tamanhos:** escala fluida em `tokens.css`, calibrada no mockup a 1440 px (título da abertura ≈ 69 px, títulos de seção ≈ 51 px, texto corrido 20 px, botões 68 px de altura).
- **Fundo:** pedra quase preta com manchas e veios discretos, como o fundo do mockup (textura procedimental sem emenda, `npm run texture`), com faixas mais escuras nos destaques, nas abas e no rodapé.
- **Fotos × fundo:** as fotos à direita sangram até a borda e se dissolvem em direção ao texto; as da esquerda formam um bloco na metade da tela, com a borda do lado do texto dissolvida.
- **Ilustrações:** a coroa da Coroa Real e o estandarte da seção Visite são desenhos em SVG; a parede de pedra atrás do estandarte é gerada por `npm run wall`. Nenhuma imagem gerada por IA foi usada.
- **Peso das fontes:** Cinzel (26 KB) e Poppins 400 e 500 (8 KB cada), só o subconjunto latino, pré-carregadas.

## Materiais usados

| Original (em `assets-src/`) | Conteúdo | Dimensões | Uso |
|---|---|---|---|
| `originais/arte-corredor-abra-as-portas.webp` | Corredor de arcos, grades, tocha e escudo; frase “Abra as portas…”; crédito @gabrielmessine | 683×857 | Recorte sem a frase (com o crédito) na seção Ambiente; arte completa na galeria |
| `originais/foto-queijo-puxado.webp` | Massa assada com queijo esticando; salão com velas ao fundo | 680×849 | Abertura (espelhada, sem o fragmento “…uço” da borda); imagem de compartilhamento; recorte das velas |
| `originais/arte-pizza-desde-1991.webp` | Forno, logotipo, “Restaurante e Pizzaria à la carte — Desde 1991”, pizza | 684×855 | Recorte só da pizza (seção Cardápio e abertura do cardápio completo) |
| `originais/arte-fachada-tradicao-curitibana.webp` | Entrada em arco com o letreiro; faixa “Tradição curitibana” | 686×856 | Recorte do letreiro em Sobre nós; arte completa na galeria |
| `referencias/cardapio-fotografado.webp` | Cardápio fotografado | 556×829 | Fonte do cardápio (não publicado) |

Os originais têm cerca de 680 px de largura, o que limita a nitidez em telas grandes. Por isso as fotos ocupam meia tela (ou pouco mais) e se dissolvem no escuro, em vez de serem esticadas para a largura inteira.

## Referências de design

- **Interface aprovada (mockup):** estrutura, ordem das seções, proporções das faixas, fundo, tipografia, cores, botões, links em versal com seta, destaques com ícones octogonais, abas do cardápio (Pizzas, Entradas, Pratos, Sobremesas, Bebidas), Coroa Real em faixa inteira e estandarte com lampião.
- **Do mockup não foram usados:** as imagens (geradas por IA, não são da casa), o endereço “Rua Via Veneto, 1450 — Santa Felicidade”, o telefone “(41) 99705-2205”, o horário “Terça a Domingo, 18h às 23h30” e os textos com afirmações não confirmadas (história da fundação, “massas artesanais”, “ingredientes selecionados”, “nossa especialidade”, “criação exclusiva… maiores símbolos”). No lugar, entram as fotos reais (com tratamento de cor), ilustrações e os dados e textos já verificados.
- **Links “Conheça nossa história” e “Conheça a Coroa Real”:** não há página de história nem foto do prato. Viraram “Venha nos visitar” (leva ao endereço) e “Ver no cardápio” (abre o destaque da Coroa Real no cardápio completo).

## Decisões de conteúdo

- **Cardápio transcrito da foto do cardápio da casa**, apenas dos trechos legíveis, com a grafia original (“alici”, “caipira”, “spaghetti, tagliarini ou penne”). Ficaram de fora as linhas apagadas ou ilegíveis na foto (algumas entradas, sucos e rótulos de vinho). A “Burrata com rúcula e pesto genovese” veio da lista do briefing.
- **Bebidas** (vinhos, caipiras e batidas, aperitivos, cervejas, whiskies, licores, refrigerantes e sucos, café e chá) também vêm da foto. Os vinhos aparecem numa lista única, como no cardápio, sem separar por cor.
- **Nada de preços, gramaturas ou tamanhos**: há versões do cardápio com valores diferentes. A página traz “Consulte a casa sobre valores e disponibilidade”.
- **Não publicados**, por estarem na foto mas poderem ter mudado: taxa de serviço e formas de pagamento.
- **A foto do queijo não foi identificada como Coroa Real.** O prato parece compatível, mas o nome não está confirmado. A Coroa Real aparece com a descrição do cardápio e uma coroa ilustrada.
- **Também não foram publicados**: horários, WhatsApp, avaliações, história dos proprietários e prêmios.

## Pendências que dependem da casa

- Logotipo em arquivo utilizável (SVG/PNG em alta resolução).
- Fotografias originais em alta resolução, de preferência do salão e dos pratos (com o nome de cada um), incluindo a Coroa Real.
- Confirmação do cardápio atual (itens, grafias, rótulos de vinho e bebidas).
- Horários completos e se o telefone também atende por WhatsApp.
- Domínio definitivo, se não for usar o endereço do GitHub Pages.
