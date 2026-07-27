# YSAGES

Site institucional da YSAGES — Infrastructure for Human Cultural Continuity — em inglês, português e espanhol.

Live: https://ysages.com

## Stack

Site estático (HTML + CSS + JS puro, sem build step). O conteúdo dos três idiomas vive em três blocos (`#lang-en`, `#lang-pt`, `#lang-es`) na mesma página; o idioma exibido é decidido em `js/i18n.js` a partir do caminho da URL (`/`, `/pt`, `/es`), preferência salva ou idioma do navegador.

## Estrutura

```
index.html          marcação e conteúdo das três versões de idioma
css/main.css         estilos do site
css/fonts.css        @font-face (Cinzel, Cormorant Garamond, Montserrat)
js/i18n.js           detecção/troca de idioma, meta tags, roteamento client-side
js/reveal.js         animação de reveal-on-scroll (IntersectionObserver)
assets/fonts/        fontes auto-hospedadas (woff2)
netlify.toml         rewrites de /pt e /es para index.html + headers de segurança
```

## Desenvolvimento local

Não há build. Basta servir a pasta com qualquer servidor estático:

```bash
python3 -m http.server 8080
```

## Deploy

Publicado no Netlify (site `ysages.com`). O `netlify.toml` já define publish dir (`.`), rewrites e headers.
