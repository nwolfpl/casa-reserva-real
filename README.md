# Rua H, nº 2 — Reserva Real | Montes Claros/MG

Landing page de venda do imóvel. Site estático: HTML, CSS e JS puros, sem build,
sem dependências e sem backend. Basta subir a pasta `site/` em qualquer hospedagem.

```
site/
├── index.html                 página inteira
├── assets/css/style.css       sistema visual
├── assets/js/main.js          galeria, diagrama, simulador, formulário
├── assets/img/                13 fotos + og-image (prévia de compartilhamento)
└── assets/video/              2 vídeos verticais + capas
```

## Publicar

Qualquer uma destas opções funciona sem configuração:

- **Netlify Drop** — arraste a pasta `site/` para <https://app.netlify.com/drop>
- **Vercel** — `vercel deploy` dentro de `site/`
- **GitHub Pages** — suba `site/` num repositório e ative Pages
- **Hospedagem tradicional** — envie o conteúdo de `site/` por FTP para a raiz do domínio

Depois de escolher o domínio, atualize duas linhas em `index.html`:

- `<link rel="canonical" href="...">` (linha 9)
- `<meta property="og:image" content="assets/img/og-image.jpg">` (linha 17) —
  troque por **URL absoluta** (`https://seudominio.com.br/assets/img/og-image.jpg`),
  senão a prévia não aparece ao compartilhar no WhatsApp.

## Onde mexer

| O que | Onde |
|---|---|
| Preço | `index.html`: hero (~linha 63), ficha técnica, barra do celular (~linha 550) e JSON-LD (~linha 606) |
| Telefone / WhatsApp | `index.html`: todos os `wa.me/5531998264493` e `tel:+5531998264493`; e `var ZAP` no topo de `main.js` |
| Textos | `index.html`, direto nas seções |
| Cores e tipografia | `:root` no topo de `style.css` |
| Fotos | `assets/img/` — troque os arquivos mantendo os nomes, ou edite os `<button class="foto">` |
| Taxa padrão do simulador | `index.html`, `<input id="taxa" ... value="11.5">` |

## Como funciona

- **Formulário e simulador não enviam nada para servidor.** Ambos montam uma
  mensagem pronta e abrem o WhatsApp. Nenhum dado do visitante é gravado.
- **Diagrama dos sistemas**: SVG desenhado à mão em `index.html`. Clicar num
  sistema na legenda isola o percurso dele no desenho.
- **Botão "Salvar em PDF"**: usa a impressão do navegador. Há um `@media print`
  no CSS que remove nav, vídeos e simulador e reorganiza a página em uma ficha.
- **SEO**: JSON-LD com `SingleFamilyResidence`, `RealEstateListing` + `Offer` e
  `FAQPage`; Open Graph para a prévia no WhatsApp/Instagram/Facebook.

## Verificar antes de divulgar

- Prévia do link: <https://developers.facebook.com/tools/debug/>
- Dados estruturados: <https://search.google.com/test/rich-results>

## Pendências

Campos marcados como **"Sob consulta"** na ficha técnica, à espera de confirmação:
área do terreno, IPTU e condomínio. A distribuição dos ambientes (térreo/superior)
e a afirmação de que o imóvel aceita financiamento e FGTS também precisam de
conferência antes da divulgação.
