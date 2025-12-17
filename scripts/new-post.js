#!/usr/bin/env node

import * as fs from 'fs';
import * as path from 'path';
import * as readline from 'readline';

const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout
});

function slugify(text) {
  return text
    .toLowerCase()
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-|-$/g, '');
}

function question(prompt) {
  return new Promise((resolve) => {
    rl.question(prompt, resolve);
  });
}

async function main() {
  console.log('\n📝 Crear nuevo post para SPUN Factura Blog\n');

  const title = await question('Título del post: ');
  const description = await question('Descripción (para SEO): ');
  const category = await question('Categoría (ej: Verifactu, IVA, Facturación): ');
  const tagsInput = await question('Tags (separados por coma): ');
  const readingTime = await question('Tiempo de lectura (minutos): ');

  const slug = slugify(title);
  const tags = tagsInput.split(',').map(t => t.trim()).filter(Boolean);
  const today = new Date().toISOString().split('T')[0];

  const frontmatter = `---
title: "${title}"
description: "${description}"
publishedDate: "${today}"
updatedDate: "${today}"
category: "${category}"
tags: [${tags.map(t => `"${t}"`).join(', ')}]
readingTime: ${readingTime || 5}
draft: true
---

<!--
  INSTRUCCIONES:
  1. Escribe el contenido en Markdown
  2. Usa ## para H2 y ### para H3
  3. Añade enlaces internos a otros posts cuando sea relevante
  4. IMPORTANTE: Cada afirmación normativa debe tener fuente AEAT/BOE
  5. Cuando esté listo, cambia "draft: true" a "draft: false"
-->

Escribe aquí la introducción del artículo...

## Primera sección

Contenido...

## Segunda sección

Contenido...

## Preguntas frecuentes

### ¿Pregunta 1?

Respuesta...

---

## Fuentes

- [AEAT - Verifactu](https://sede.agenciatributaria.gob.es/Sede/iva/sistemas-informaticos-facturacion-verifactu.html)
- [BOE - RD 1007/2023](https://www.boe.es/diario_boe/txt.php?id=BOE-A-2023-24840)

---

*[CTA: Reserva tu plaza en SPUN Factura](/#form)*
`;

  const postsDir = path.join(process.cwd(), 'src', 'content', 'blog');
  const filePath = path.join(postsDir, `${slug}.mdx`);

  if (fs.existsSync(filePath)) {
    console.log(`\n❌ Ya existe un archivo con ese slug: ${slug}.mdx`);
    process.exit(1);
  }

  fs.writeFileSync(filePath, frontmatter);

  console.log(`\n✅ Post creado: src/content/blog/${slug}.mdx`);
  console.log(`\n📋 Siguiente paso: edita el archivo y cuando esté listo, cambia "draft: true" a "draft: false"`);
  console.log(`\n🔗 URL final: /blog/${slug}\n`);

  rl.close();
}

main().catch(console.error);
