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
```

O build usa caminhos relativos (`base: './'`), então a pasta `dist/` funciona em qualquer subdiretório.

## Estrutura

A página segue a interface aprovada pelo cliente (mockup de outubro de 2026): fundo quase preto, títulos em capitulares, fotos que sangram até a borda da tela e se dissolvem no escuro, alternando lado a lado com o texto.

| Parte | Componente | Observações |
|---|---|---|
| Cabeçalho | `src/components/Header` | Coroa + nome, menu em versal (Início, Sobre, Cardápio, Ambiente, Visite), botão “Ver cardápio”; no celular, menu em `<dialog>` |
| Abertura | `src/components/Hero` | Título “Uma experiência além da pizza”, texto, “Explorar cardápio” e “Conhecer o ambiente”; foto do queijo à direita |
| Sobre nós + destaques | `src/components/About` | “Tradição em cada detalhe” com o letreiro da entrada; faixa com quatro destaques em moldura octogonal |
| Cardápio | `src/components/Menu/Menu.tsx` | “Sabores que marcam” com a pizza; abas acessíveis e lista do cardápio |
| Coroa Real | `src/components/Menu/Signature.tsx` | Sugestão da casa com a descrição do cardápio; coroa dourada ilustrada sobre a luz das velas (não há foto confirmada do prato) |
| Ambiente | `src/components/Ambience` | “Mais que um restaurante, uma experiência” com o corredor de arcos; o link abre a galeria ampliada (`<dialog>`) |
| Visite | `src/components/Visit` | Endereço, horário (“consulte pelo telefone”), telefone e Instagram em grade; “Como chegar”; entrada da casa à direita |

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
| Botões chanfrados, links de texto, sobretítulos e parede ao fundo | `src/styles/base.css` |
| SEO, Open Graph e dados estruturados | `index.html` |

### Trocar ou acrescentar fotos

1. Coloque o original em `assets-src/originais/` (os originais nunca são alterados).
2. Registre-o em `JOBS` no arquivo `scripts/optimize-images.mjs` (recorte opcional e larguras).
3. Rode `npm run images`. O script gera AVIF + WebP em `public/images/` e atualiza `src/content/image-manifest.json` com as dimensões.
4. Descreva a imagem e ajuste o enquadramento (`position.base / md / lg`) em `src/content/images.ts`.

O logotipo está provisoriamente em tipografia, com a coroa da interface (classe `.brand` em `Header.tsx`); não é o brasão oficial. Quando houver arquivo vetorial do logo, basta substituir esse bloco.

## Identidade visual

- **Títulos:** Cinzel em versal, fina, em marfim.
- **Texto, menu, botões e sobretítulos:** Poppins (400 e 500).
- **Cores:** fundo `#0b0807`, títulos em marfim, sobretítulos em bronze, links e aba ativa em cobre, botões em vinho com filete de cobre e cantos chanfrados (`.btn`), ícones e coroa em dourado. Todos os textos foram medidos sobre fotos e fundo com contraste de pelo menos 4,5:1.
- **Fundo:** parede de tijolos quase no escuro (textura discreta gerada por `npm run texture`, em duas resoluções).
- **Fotos × fundo:** cada foto se dissolve no escuro por máscara em direção ao texto e nas bordas de cima e de baixo, sem moldura.
- **Peso das fontes:** Cinzel (26 KB) e Poppins 400 e 500 (8 KB cada), só o subconjunto latino, pré-carregadas.

## Materiais usados

| Original (em `assets-src/originais/`) | Conteúdo | Dimensões | Texto incorporado | Uso |
|---|---|---|---|---|
| `arte-corredor-abra-as-portas.webp` | Corredor de arcos, grades, tocha e escudo; frase “Abra as portas…”; crédito @gabrielmessine | 683×857 | Sim | Recorte sem a frase (com o crédito) na seção Ambiente; arte completa na galeria |
| `foto-queijo-puxado.webp` | Massa assada com queijo esticando; salão com velas ao fundo | 680×849 | Só um fragmento (“…uço” no avental) | Abertura; recorte das velas na Coroa Real e na galeria |
| `arte-pizza-desde-1991.webp` | Forno com fogo, logotipo, “Restaurante e Pizzaria à la carte — Desde 1991”, pizza | 684×855 | Sim | Recorte só da pizza na seção Cardápio |
| `arte-fachada-tradicao-curitibana.webp` | Entrada em arco com o letreiro; faixa “Tradição curitibana” | 686×856 | Sim (faixa) | Seção Visite; recorte do letreiro em Sobre nós e na galeria |
| `assets-src/referencias/cardapio-fotografado.webp` | Cardápio fotografado | 556×829 | — | Apenas fonte de conteúdo, não publicado |

Os originais recebidos nesta sessão já estavam em WebP com cerca de 680 px de largura, e isso limita a nitidez em telas grandes. Por isso as fotos ocupam meia tela (ou pouco mais, na abertura) e se dissolvem no escuro, em vez de serem esticadas para a largura inteira.

## Referências de design

- **Interface aprovada (mockup):** estrutura, ordem das seções, tipografia, cores, botões chanfrados, links em versal com seta, faixa de destaques com ícones octogonais e abas do cardápio.
- **Do mockup não foram usados:** as imagens (geradas por IA, não são da casa), o endereço “Rua Via Veneto, 1450 — Santa Felicidade”, o telefone “(41) 99705-2205”, o horário “Terça a Domingo, 18h às 23h30” e os textos com afirmações não confirmadas (história da fundação, “massas artesanais”, “ingredientes selecionados”, “criação exclusiva… maiores símbolos”). No lugar, entram as fotos reais e os dados e textos já verificados.

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
