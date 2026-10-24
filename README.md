# Calabouço Restaurante e Pizzaria — landing page

Página única do Calabouço (Rua Mateus Leme, 1000 — Centro Cívico, Curitiba/PR), feita com React + TypeScript + Vite. Não tem backend, formulários, analytics nem rastreadores, e não carrega fontes ou scripts externos.

## Como executar

```bash
npm install
npm run dev        # desenvolvimento em http://localhost:5173
npm run build      # gera dist/ (typecheck + build)
npm run preview    # serve o build em http://localhost:4173
npm run lint       # ESLint
npm run images     # regera as imagens otimizadas a partir dos originais
npm run texture    # regera a textura da parede de tijolos (duas resoluções)
npm run wall       # regera a parede de pedra iluminada da seção Visite
```

O build usa caminhos relativos (`base: './'`), então a pasta `dist/` funciona em qualquer subdiretório.

## Estrutura

A página segue a interface aprovada pelo cliente (mockup de outubro de 2026), medida seção por seção numa tela de 1440 px: fundo quase preto, títulos em capitulares, faixas de imagem + texto alternando de lado, com as mesmas alturas, posições e tamanhos de texto do mockup. Abaixo de 1440 px tudo diminui na mesma proporção; no celular, a imagem vem antes do texto.

| Parte | Componente | Observações |
|---|---|---|
| Cabeçalho | `src/components/Header` | Coroa sobre o nome, menu em versal centralizado (Início, Sobre, Cardápio, Ambiente, Visite), botão “Ver cardápio”; encolhe ao rolar; no celular, menu em `<dialog>` |
| Abertura | `src/components/Hero` | Título “Uma experiência além da pizza”, texto, “Explorar cardápio” e “Conhecer o ambiente”; foto do queijo à direita |
| Sobre nós + destaques | `src/components/About` | “Tradição em cada detalhe” com o letreiro da entrada e o link “Venha nos visitar”; faixa com quatro destaques em moldura octogonal |
| Cardápio | `src/components/Menu/Menu.tsx` | “Sabores que marcam” com a pizza; “Ver cardápio completo” leva à lista já aberta; abas Pizzas, Entradas, Pratos, Sobremesas e Vinhos |
| Coroa Real | `src/components/Menu/Signature.tsx` | Faixa inteira com a descrição do cardápio; coroa dourada ilustrada sobre uma mesa, com a luz das velas do salão ao fundo; “Ver no cardápio” abre a aba Pratos, com a Coroa Real em destaque |
| Ambiente | `src/components/Ambience` | “Mais que um restaurante, uma experiência” com o corredor de arcos; o link abre a galeria ampliada (`<dialog>`, quatro imagens) |
| Visite | `src/components/Visit` | Endereço, horário (“consulte pelo telefone”), telefone e Instagram em grade; “Como chegar”; à direita, estandarte ilustrado com lampião (`BannerArt.tsx`) |

As seções com imagem + texto usam o mesmo bloco, `src/components/Split`.

## Onde editar

| O quê | Arquivo |
|---|---|
| Nome, endereço, telefone, links e menu de navegação | `src/content/business.ts` |
| Textos das seções e imagem de cada uma | `src/content/home.ts` |
| Cardápio (categorias, itens, Coroa Real, observação) | `src/content/menu.ts` |
| Fotos da galeria do ambiente | `src/content/gallery.ts` |
| Texto alternativo, enquadramento por breakpoint e crédito das imagens | `src/content/images.ts` |
| Cores, fontes, espaçamentos e durações de animação | `src/styles/tokens.css` |
| Botões, links de texto, sobretítulos e parede ao fundo | `src/styles/base.css` |
| SEO, Open Graph e dados estruturados | `index.html` |

### Trocar ou acrescentar fotos

1. Coloque o original em `assets-src/originais/` (os originais nunca são alterados).
2. Registre-o em `JOBS` no arquivo `scripts/optimize-images.mjs` (recorte opcional e larguras).
3. Rode `npm run images`. O script gera AVIF + WebP em `public/images/` e atualiza `src/content/image-manifest.json` com as dimensões. Cada foto pode receber um tratamento de cor (`grade`): escurece médios e sombras, puxa vermelhos e amarelos para o âmbar e tira o excesso de vermelho da iluminação, para chegar ao tom escuro do mockup. Só cor e luz mudam; nada é acrescentado ou removido da cena. A foto da abertura é espelhada (`flop`) para o queijo ficar do lado de fora da página, como no mockup.
4. Descreva a imagem e ajuste o enquadramento (`position.base / md / lg`) em `src/content/images.ts`.

O logotipo está provisoriamente em tipografia, com a coroa da interface (classe `.brand` em `Header.tsx`); não é o brasão oficial. Quando houver arquivo vetorial do logo, basta substituir esse bloco.

## Identidade visual

- **Títulos:** Cinzel em versal, fina, em marfim.
- **Texto, menu, botões e sobretítulos:** Poppins (400 e 500).
- **Cores:** fundo `#0b0807`, títulos em marfim (a Coroa Real em areia), texto corrido em marfim claro, sobretítulos em bronze com filete e ponta de seta, links e aba ativa em cobre, botões em vinho com filete de cobre e cantos recortados em quarto de círculo (`.btn`), ícones e coroa em dourado. Todos os textos foram medidos sobre fotos e fundo com contraste de pelo menos 5,9:1.
- **Tamanhos:** escala fluida em `tokens.css`, calibrada no mockup a 1440 px (título da abertura ≈ 69 px, títulos de seção ≈ 51 px, texto corrido 20 px, botões 68 px de altura) e reduzida em linha reta até o celular.
- **Fundo:** parede de tijolos quase no escuro (textura discreta gerada por `npm run texture`, em duas resoluções).
- **Fotos × fundo:** as fotos à direita sangram até a borda e se dissolvem em direção ao texto; as da esquerda formam um bloco na metade da tela, com a borda do lado do texto dissolvida.
- **Ilustrações:** a coroa da Coroa Real e o estandarte da seção Visite são desenhos em SVG. A parede de pedra atrás do estandarte é gerada por `npm run wall` (procedimental, com a luz saindo do vidro do lampião). Nenhuma imagem gerada por IA foi usada.
- **Peso das fontes:** Cinzel (26 KB) e Poppins 400 e 500 (8 KB cada), só o subconjunto latino, pré-carregadas.

## Materiais usados

| Original (em `assets-src/originais/`) | Conteúdo | Dimensões | Texto incorporado | Uso |
|---|---|---|---|---|
| `arte-corredor-abra-as-portas.webp` | Corredor de arcos, grades, tocha e escudo; frase “Abra as portas…”; crédito @gabrielmessine | 683×857 | Sim | Recorte sem a frase (com o crédito) na seção Ambiente; arte completa na galeria |
| `foto-queijo-puxado.webp` | Massa assada com queijo esticando; salão com velas ao fundo | 680×849 | Só um fragmento (“…uço” no avental), cortado na abertura | Abertura (espelhada); recorte das velas na Coroa Real e na galeria |
| `arte-pizza-desde-1991.webp` | Forno com fogo, logotipo, “Restaurante e Pizzaria à la carte — Desde 1991”, pizza | 684×855 | Sim | Recorte só da pizza na seção Cardápio |
| `arte-fachada-tradicao-curitibana.webp` | Entrada em arco com o letreiro; faixa “Tradição curitibana” | 686×856 | Sim (faixa) | Recorte do letreiro em Sobre nós; arte completa na galeria |
| `assets-src/referencias/cardapio-fotografado.webp` | Cardápio fotografado | 556×829 | — | Apenas fonte de conteúdo, não publicado |

Os originais recebidos nesta sessão já estavam em WebP com cerca de 680 px de largura, e isso limita a nitidez em telas grandes. Por isso as fotos ocupam meia tela (ou pouco mais, na abertura) e se dissolvem no escuro, em vez de serem esticadas para a largura inteira.

## Referências de design

- **Interface aprovada (mockup):** estrutura, ordem das seções, proporções das faixas, tipografia, cores, botões, links em versal com seta, faixa de destaques com ícones octogonais, abas do cardápio, Coroa Real em faixa inteira e estandarte com lampião na seção Visite.
- **Do mockup não foram usados:** as imagens (geradas por IA, não são da casa), o endereço “Rua Via Veneto, 1450 — Santa Felicidade”, o telefone “(41) 99705-2205”, o horário “Terça a Domingo, 18h às 23h30” e os textos com afirmações não confirmadas (história da fundação, “massas artesanais”, “ingredientes selecionados”, “nossa especialidade”, “criação exclusiva… maiores símbolos”). No lugar, entram as fotos reais (com tratamento de cor), ilustrações e os dados e textos já verificados.
- **Abas do cardápio:** o mockup traz Pizzas, Entradas, Pratos, Sobremesas e Bebidas. A página usa “Vinhos” no lugar de “Bebidas”, porque o cardápio disponível só lista vinhos; “Pratos” reúne as massas e os pratos especiais.
- **Links “Conheça nossa história” e “Conheça a Coroa Real”:** não há página de história nem foto do prato. Viraram “Venha nos visitar” (leva ao endereço) e “Ver no cardápio” (abre a aba Pratos com a Coroa Real em destaque).

## Decisões de conteúdo

- **Nada de preços, gramaturas ou tamanhos**: há versões do cardápio com valores diferentes. A página traz a observação “Consulte a casa sobre valores e disponibilidade”.
- **A foto do queijo não foi identificada como Coroa Real.** O prato parece compatível, mas o nome não está confirmado na imagem. A Coroa Real aparece com a descrição do cardápio e uma coroa ilustrada.
- **Itens de leitura duvidosa ficaram de fora.** A “Burrata com rúcula e pesto genovese” veio da lista do briefing, porque não aparece na foto do cardápio disponível.
- **Não foram publicados**: horários, WhatsApp, link de cardápio, avaliações, história dos proprietários e prêmios.
- **Ordem do menu**: os links seguem a ordem das seções na página (Início, Sobre, Cardápio, Ambiente, Visite).

## Pendências que dependem da casa

- Logotipo em arquivo utilizável (SVG/PNG em alta resolução).
- Fotografias originais em alta resolução, de preferência mais fotos do salão e fotos horizontais.
- Foto confirmada da Coroa Real e de outros pratos, com o nome do prato.
- Confirmação do cardápio atual (itens, grafias e rótulos de vinho).
- Horários completos e se o telefone também atende por WhatsApp.
- Domínio definitivo, para trocar `og:image` por uma URL absoluta.
