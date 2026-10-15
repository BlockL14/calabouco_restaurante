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
npm run arch       # regera o arco de tijolos da seção Visite (duas resoluções)
```

O build usa caminhos relativos (`base: './'`), então a pasta `dist/` funciona em qualquer subdiretório.

## Estrutura

| Parte | Componente | Observações |
|---|---|---|
| Abertura | `src/components/Showcase` | Destaques sobre a parede de tijolos: foto da casa se dissolvendo na parede, título em duas linhas, setas + progresso + numeração. Troca por fusão lenta entre as fotos. Teclado (← →) e gesto lateral no celular |
| Sabores | `src/components/Flavors` | Destaque da Coroa Real + seleção do cardápio em abas acessíveis |
| A experiência | `src/components/Experience` | Galeria assimétrica + visualização ampliada (`<dialog>`) |
| A casa | `src/components/House` | Fachada, arte de identidade e “Desde 1991” |
| Visite | `src/components/Visit` | Composição centralizada com pílulas; placas da casa com endereço e telefone ladeando a porta em arco de tijolos (aduelas radiais e ombreiras em fiadas, como o arco da fachada), com a pizza da casa surgindo da soleira |

## Onde editar

| O quê | Arquivo |
|---|---|
| Nome, endereço, telefone, links e menu de navegação | `src/content/business.ts` |
| Destaques da abertura (textos, imagem, chamada) | `src/content/slides.ts` |
| Cardápio (categorias, itens, Coroa Real, observação) | `src/content/menu.ts` |
| Galeria da experiência | `src/content/gallery.ts` |
| Texto alternativo, enquadramento por breakpoint e crédito das imagens | `src/content/images.ts` |
| Cores, fontes, espaçamentos e durações de animação | `src/styles/tokens.css` |
| Parede de tijolos (textura e escurecimento geral) | `src/styles/base.css` + `scripts/make-brick-texture.mjs` |
| SEO, Open Graph e dados estruturados | `index.html` |

### Trocar ou acrescentar fotos

1. Coloque o original em `assets-src/originais/` (os originais nunca são alterados).
2. Registre-o em `JOBS` no arquivo `scripts/optimize-images.mjs` (recorte opcional e larguras).
3. Rode `npm run images`. O script gera AVIF + WebP em `public/images/` e atualiza `src/content/image-manifest.json` com as dimensões.
4. Descreva a imagem e ajuste o enquadramento (`position.base / md / lg`) em `src/content/images.ts`.

O logotipo está provisoriamente em tipografia (classe `.brand` em `Header.tsx`). Quando houver arquivo vetorial do logo, basta substituir esse bloco.

## Identidade medieval

A página usa, em todas as larguras, a mesma dupla tipográfica das artes da casa e um fundo de parede de tijolos.

- **Títulos:** Cinzel (capitulares romanas; as minúsculas saem em versalete, como em “Abra as portas para uma noite” e “Tradição” nas artes).
- **Palavras em destaque** (`<em>` dos títulos, “Coroa Real”): Grenze Gotisch, uma gótica de “d” reto, legível em frases curtas, sempre em linha própria. A UnifrakturCook (fraktur mais próxima do letreiro) foi testada nos destaques, mas o “d” redondo dificulta a leitura de “desde”, “do”, “da”; ficou só no nome “Calabouço”, que é logotipo.
- **Texto corrido, botões e itens do cardápio:** Inter.
- **Parede:** textura procedimental gerada por `npm run texture` (determinística, sem emenda), com cores calibradas nos tijolos das fotos da fachada e do corredor. Há duas resoluções: `tijolos-p` (≈ 42 KB, celulares) e `tijolos` (≈ 90 KB, a partir de 700 px). Cada seção escurece a parede com degradês próprios e “acende” um trecho junto às fotos; na abertura, a luz da foto ativa tinge a parede.
- **Fotos × parede:** a foto da abertura se dissolve na parede por uma máscara longa em curva suave — pela base em telas em pé, pela esquerda (e topo e base) em telas deitadas —, com penumbra sobre a faixa de fusão. As fotos das seções têm bordas esfumadas (classe `.feather`), sem moldura retangular.
- **Arco da seção Visite:** imagem gerada por `npm run arch` com a mesma paleta e a mesma luz da parede: 35 aduelas radiais com a profundidade de um tijolo, ombreiras em fiadas alternadas que se encaixam na parede, sombra onde o arco encosta nos tijolos e a luz quente do forno saindo pelo vão (≈ 17 KB no celular, ≈ 38 KB nas telas largas, em AVIF).
- **Abertura sem cartões:** a troca de destaque é feita pelas setas, pelo teclado (← →) e por gesto lateral, com fusão lenta entre as fotos (`--dur-fade`).
- **Peso das fontes:** Inter (48 KB), Cinzel (26 KB), Grenze Gotisch (17 KB) e UnifrakturCook (17 KB), só o subconjunto latino, todas pré-carregadas.

## Materiais usados

| Original (em `assets-src/originais/`) | Conteúdo | Dimensões | Texto incorporado | Uso |
|---|---|---|---|---|
| `arte-corredor-abra-as-portas.webp` | Corredor de arcos, grades, tocha e escudo; frase “Abra as portas…”; crédito @gabrielmessine | 683×857 | Sim | Recorte sem a frase (com o crédito) na abertura; arte completa na galeria |
| `foto-queijo-puxado.webp` | Massa assada com queijo esticando; salão com velas ao fundo | 680×849 | Só um fragmento (“…uço” no avental) | Destaque “Da cozinha”, abertura de Sabores; recorte das velas na galeria |
| `arte-pizza-desde-1991.webp` | Forno com fogo, logotipo, “Restaurante e Pizzaria à la carte — Desde 1991”, pizza | 684×855 | Sim | Destaque “Pizzas” (peça inteira), seção A casa; recorte só da pizza na aba Pizzas |
| `arte-fachada-tradicao-curitibana.webp` | Entrada em arco com o letreiro; faixa “Tradição curitibana” | 686×856 | Sim (faixa) | Destaque “A casa” e seção A casa; recorte do letreiro na galeria |
| `assets-src/referencias/cardapio-fotografado.webp` | Cardápio fotografado | 556×829 | — | Apenas fonte de conteúdo, não publicado |

Os originais recebidos nesta sessão já estavam em WebP com cerca de 680 px de largura, e isso limita a nitidez em telas grandes. Por isso, em telas deitadas, a foto da abertura ocupa o lado direito (do topo ao rodapé) e se dissolve na parede à esquerda, em vez de ser esticada para a largura inteira.

## Referências de design

- **Carrossel (vídeo de referência principal):** estrutura e coreografia da abertura — título em duas linhas com traço e rótulo, setas, linha de progresso e numeração grande; o fundo anterior escurece e o título sobe linha a linha. Os cartões em fileira da referência foram retirados a pedido do cliente; a troca passou a ser uma fusão entre as fotos.
- **Forma metálica (vídeo secundário):** usada só como princípio — cena escura, composição central, botão em pílula clara, informações flutuando ao lado do objeto e luz quente. A forma abstrata em si não foi usada: no lugar dela entram elementos da casa (a porta em arco, a pizza e placas com endereço e telefone), para que a página lembre sempre uma pizzaria temática.

## Decisões de conteúdo

- **Nada de preços, gramaturas ou tamanhos**: há versões do cardápio com valores diferentes. A página traz a observação “Consulte a casa sobre valores e disponibilidade”.
- **A foto do queijo não foi identificada como Coroa Real.** O prato parece compatível, mas o nome não está confirmado na imagem. A Coroa Real aparece em destaque tipográfico, com a descrição do cardápio.
- **Itens de leitura duvidosa ficaram de fora.** A “Burrata com rúcula e pesto genovese” veio da lista do briefing, porque não aparece na foto do cardápio disponível.
- **Não foram publicados**: horários, WhatsApp, link de cardápio, avaliações, história dos proprietários e prêmios.
- **Ordem do menu**: os links seguem a ordem das seções na página (Sabores, Experiência, A casa, Como chegar).

## Pendências que dependem da casa

- Logotipo em arquivo utilizável (SVG/PNG em alta resolução).
- Fotografias originais em alta resolução, de preferência mais fotos do salão e fotos horizontais.
- Foto confirmada da Coroa Real e de outros pratos, com o nome do prato.
- Confirmação do cardápio atual (itens, grafias e rótulos de vinho).
- Horários completos e se o telefone também atende por WhatsApp.
- Domínio definitivo, para trocar `og:image` por uma URL absoluta.
