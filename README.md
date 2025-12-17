# SPUN Factura - Sitio Web Unificado

Landing page + Blog SEO para SPUN Factura, construido con Astro.

## 🚀 Inicio rápido

### 1. Instalar dependencias
```bash
npm install
```

### 2. Desarrollo local
```bash
npm run dev
```
Abre http://localhost:4321 para ver el sitio.

### 3. Build para producción
```bash
npm run build
```

### 4. Preview del build
```bash
npm run preview
```

---

## 📁 Estructura del proyecto

```
spun-factura/
├── src/
│   ├── content/
│   │   └── blog/           ← Posts del blog (.mdx)
│   ├── layouts/
│   │   ├── Base.astro      ← Layout principal
│   │   └── BlogPost.astro  ← Layout para posts
│   ├── pages/
│   │   ├── index.astro     ← Landing principal
│   │   ├── blog/
│   │   │   ├── index.astro ← Listado de posts
│   │   │   └── [slug].astro← Página de cada post
│   │   ├── privacidad/
│   │   │   └── index.astro ← Política de privacidad
│   │   ├── aviso-legal/
│   │   │   └── index.astro ← Aviso legal
│   │   └── cookies/
│   │       └── index.astro ← Política de cookies
│   └── styles/
│       └── global.css      ← Estilos globales
├── public/
│   ├── images/             ← Imágenes estáticas
│   └── robots.txt          ← Robots.txt para SEO
├── astro.config.mjs        ← Configuración de Astro
└── package.json
```

---

## 🌐 URLs del sitio

| URL | Página |
|-----|--------|
| `/` | Landing principal |
| `/blog` | Índice del blog |
| `/blog/[slug]` | Post individual |
| `/privacidad` | Política de privacidad |
| `/aviso-legal` | Aviso legal |
| `/cookies` | Política de cookies |

---

## ✍️ Crear un nuevo post

### Opción 1: Script automático
```bash
npm run new-post
```

### Opción 2: Manual
1. Crea un archivo `.mdx` en `src/content/blog/`
2. Añade el frontmatter:

```yaml
---
title: "Título del post"
description: "Descripción para SEO"
publishedDate: "2025-12-17"
updatedDate: "2025-12-17"
category: "Verifactu"
tags: ["tag1", "tag2"]
readingTime: 5
draft: false
---
```

3. Escribe el contenido en Markdown/MDX
4. Cuando esté listo, cambia `draft: false`

---

## 🎨 Colores corporativos

```css
--color-primary: #34CED6;      /* Turquesa SPUN */
--color-primary-dark: #2BB5BD; /* Hover */
--color-primary-light: #9EE8EC;/* Bordes */
```

---

## 📋 SEO

### Sitemap
Se genera automáticamente en `/sitemap-index.xml` con prioridades:
- Landing: 1.0
- Blog index: 0.9
- Posts: 0.8
- Legales: 0.3

### Schema.org
- **Landing**: SoftwareApplication
- **Posts**: Article con author y publisher

### Meta tags
Cada página tiene:
- Title y description únicos
- Open Graph para redes sociales
- Canonical URL

---

## 🚀 Deploy en Vercel

1. Sube este repo a GitHub
2. Ve a vercel.com → Import project
3. Selecciona el repo
4. Framework: Astro (auto-detectado)
5. Deploy

### Configurar dominio
En Vercel Settings → Domains → Añade `factura.spun.es`

En tu DNS añade:
```
CNAME factura cname.vercel-dns.com
```

---

## 📝 TODO antes de lanzar

- [ ] Añadir imágenes de profesionales en `/public/images/`
- [ ] Configurar webhook de Make.com en `index.astro`
- [ ] Verificar propiedad en Google Search Console
- [ ] Enviar sitemap a GSC

---

## 📄 Licencia

© 2025 Homedome Ibérica S.L. Todos los derechos reservados.
