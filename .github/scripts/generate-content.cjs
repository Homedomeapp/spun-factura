#!/usr/bin/env node
const fs = require('fs');
const path = require('path');
const https = require('https');

const ANTHROPIC_API_KEY = process.env.ANTHROPIC_API_KEY;
const CONTENT_DATA = JSON.parse(process.env.CONTENT_DATA || '{}');

const SYSTEM_PROMPT = `Eres un experto en facturación electrónica y normativa fiscal española.
Escribes contenido para SPUN Factura (factura.spun.es).

REGLAS:
1. Español de España
2. Tono profesional pero accesible
3. Cita fuentes oficiales (BOE, AEAT)
4. NO inventes datos ni fechas
5. Formato MDX compatible con Astro
6. Incluye: TL;DR, FAQ, CTA hacia SPUN Factura

COMPONENTES:
- <Callout type="info|warning|tip">texto</Callout>
- <FAQ question="pregunta">respuesta</FAQ>`;

function generateFrontmatter(data) {
  const today = new Date().toISOString().split('T')[0];
  return `---
title: "${data.title}"
description: "${data.description}"
publishedDate: "${today}"
updatedDate: "${today}"
category: "${data.category}"
tags: [${data.tags.split(',').map(t => `"${t.trim()}"`).join(', ')}]
image: "/images/blog/${data.slug}.jpg"
imageAlt: "${data.title}"
author: "SPUN Factura"
draft: false
---`;
}

function buildUserPrompt(data) {
  return `Escribe un artículo sobre:
Título: ${data.title}
Meta description: ${data.description}
Categoría: ${data.category}
Keywords: ${data.keywords}
Brief: ${data.brief}
${data.sources ? `Fuentes: ${data.sources}` : ''}
${data.internal_links ? `Enlaces internos: ${data.internal_links}` : ''}

Mínimo 1500 palabras. Termina con CTA hacia SPUN Factura.`;
}

async function callClaudeAPI(systemPrompt, userPrompt) {
  return new Promise((resolve, reject) => {
    const data = JSON.stringify({
      model: 'claude-sonnet-4-20250514',
      max_tokens: 8000,
      system: systemPrompt,
      messages: [{ role: 'user', content: userPrompt }]
    });
    const req = https.request({
      hostname: 'api.anthropic.com',
      path: '/v1/messages',
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'x-api-key': ANTHROPIC_API_KEY,
        'anthropic-version': '2023-06-01'
      }
    }, (res) => {
      let body = '';
      res.on('data', chunk => body += chunk);
      res.on('end', () => {
        if (res.statusCode !== 200) return reject(new Error(`API Error: ${body}`));
        const response = JSON.parse(body);
        resolve(response.content[0]?.text || '');
      });
    });
    req.on('error', reject);
    req.write(data);
    req.end();
  });
}

async function main() {
  console.log('🤖 Generando contenido para:', CONTENT_DATA.slug);
  if (!ANTHROPIC_API_KEY) throw new Error('ANTHROPIC_API_KEY no configurada');
  
  const content = await callClaudeAPI(SYSTEM_PROMPT, buildUserPrompt(CONTENT_DATA));
  const fullContent = `${generateFrontmatter(CONTENT_DATA)}\n\n${content}`;
  
  const outputPath = path.join('src', 'content', 'blog', `${CONTENT_DATA.slug}.mdx`);
  fs.mkdirSync(path.dirname(outputPath), { recursive: true });
  fs.writeFileSync(outputPath, fullContent, 'utf8');
  console.log('✅ Archivo creado:', outputPath);
}

main().catch(err => { console.error('❌', err.message); process.exit(1); });
