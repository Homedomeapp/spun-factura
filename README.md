# SPUN Factura - Sitio Web Completo

Landing page + Blog SEO para SPUN Factura, construido con Astro.

## 🚀 Inicio rápido

```bash
# Instalar dependencias
npm install

# Desarrollo local
npm run dev
# Abre http://localhost:4321

# Build para producción
npm run build

# Preview del build
npm run preview
```

## 📁 Estructura

```
spun-factura/
├── src/
│   ├── pages/
│   │   ├── index.html          ← Landing principal
│   │   ├── blog/
│   │   │   ├── index.astro     ← Listado blog
│   │   │   └── [slug].astro    ← Posts dinámicos
│   │   ├── privacidad/index.html
│   │   ├── aviso-legal/index.html
│   │   └── cookies/index.html
│   ├── layouts/
│   │   ├── Base.astro
│   │   └── BlogPost.astro
│   └── content/blog/           ← Posts .mdx
├── public/
│   ├── images/                 ← Fotos e iconos
│   └── robots.txt
└── astro.config.mjs
```

## 🌐 URLs

| URL | Contenido |
|-----|-----------|
| `/` | Landing con formulario |
| `/blog` | Índice del blog |
| `/blog/[slug]` | Posts individuales |
| `/privacidad` | Política de privacidad |
| `/aviso-legal` | Aviso legal |
| `/cookies` | Política de cookies |
| `/sitemap-index.xml` | Sitemap para Google |

## 🚀 Deploy en Vercel

1. Sube a GitHub
2. Ve a vercel.com → Import project
3. Selecciona el repo
4. Framework: Astro (auto)
5. Deploy

### Dominio
En Vercel Settings → Domains → `factura.spun.es`

DNS: `CNAME factura → cname.vercel-dns.com`

## ✍️ Crear nuevo post

1. Crea archivo `.mdx` en `src/content/blog/`
2. Añade frontmatter:

```yaml
---
title: "Título"
description: "Descripción SEO"
publishedDate: "2025-12-17"
category: "Verifactu"
tags: ["tag1", "tag2"]
readingTime: 5
draft: false
---
```

3. Escribe en Markdown
4. Cambia `draft: false` cuando esté listo

## 🎨 Colores

- Primary: `#34CED6`
- Primary Dark: `#2BB5BD`

## ✅ Webhook configurado

El formulario ya envía a Make.com:
`https://hook.eu2.make.com/v73az8m16yumk4tm4vo6bl3arui5nlzp`

---

© 2025 Homedome Ibérica S.L.
