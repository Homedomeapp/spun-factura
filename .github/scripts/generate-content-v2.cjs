#!/usr/bin/env node
const fs = require('fs');
const path = require('path');
const https = require('https');

const ANTHROPIC_API_KEY = process.env.ANTHROPIC_API_KEY;
const CONTENT_DATA = JSON.parse(process.env.CONTENT_DATA || '{}');

const SYSTEM_PROMPT = `Eres un experto en facturación electrónica, Verifactu y normativa fiscal española.
Escribes contenido para SPUN Factura (factura.spun.es), un software de facturación para construcción y reformas.

REGLAS ESTRICTAS:
1. Español de España (no latinoamericano)
2. Tono profesional pero accesible
3. Cita SIEMPRE fuentes oficiales (BOE, AEAT) con URLs reales
4. NO inventes datos, fechas ni normativas
5. Usa Markdown estándar compatible con MDX/Astro

ESTRUCTURA OBLIGATORIA DEL ARTÍCULO:
1. Párrafo introductorio (2-3 frases enganchando al lector)
2. Secciones con ## (mínimo 5 secciones)
3. Tablas comparativas donde sea útil
4. Listas con viñetas para pasos o requisitos
5. Sección "## Preguntas frecuentes" con 4-6 preguntas en formato:
   ### ¿Pregunta aquí?
   Respuesta aquí.
6. Sección "## SPUN Factura: tu solución" (CTA)
7. Sección "## Fuentes oficiales" con enlaces reales al BOE y AEAT

GENERA TAMBIÉN (en formato JSON al final):
- 4-6 preguntas FAQ para el frontmatter
- Tiempo de lectura estimado (minutos)

FORMATO DE SALIDA:
Primero el contenido Markdown, luego una línea con "---JSON---" y después un objeto JSON con:
{
  "faq": [{"q": "pregunta", "a": "respuesta"}, ...],
  "readingTime": número
}`;

function buildUserPrompt(data) {
  return `Escribe un artículo completo sobre:

TÍTULO: ${data.title}
META DESCRIPTION: ${data.description}
CATEGORÍA: ${data.category}
KEYWORDS: ${data.keywords}

BRIEF/INSTRUCCIONES:
${data.brief}

FUENTES A CITAR (si las hay):
${data.sources || 'Usa fuentes oficiales del BOE y AEAT'}

REQUISITOS:
- Mínimo 1500 palabras
- Incluir tablas comparativas
- Sección FAQ con 4-6 preguntas
- Terminar con CTA hacia SPUN Factura
- Sección de fuentes oficiales con URLs reales
- No uses componentes personalizados, solo Markdown estándar`;
}

async function callClaudeAPI(systemPrompt, userPrompt) {
  return new Promise((resolve, reject) => {
    const requestData = JSON.stringify({
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
        'Content-Type': 'application/json; charset=utf-8',
        'x-api-key': ANTHROPIC_API_KEY,
        'anthropic-version': '2023-06-01'
      }
    }, (res) => {
      let body = '';
      res.setEncoding('utf8');
      res.on('data', chunk => body += chunk);
      res.on('end', () => {
        if (res.statusCode !== 200) {
          return reject(new Error(`API Error ${res.statusCode}: ${body}`));
        }
        try {
          const response = JSON.parse(body);
          resolve(response.content[0]?.text || '');
        } catch (e) {
          reject(new Error(`Parse error: ${e.message}`));
        }
      });
    });
    
    req.on('error', reject);
    req.write(requestData);
    req.end();
  });
}

function parseResponse(response) {
  const parts = response.split('---JSON---');
  let content = parts[0].trim();
  let metadata = { faq: [], readingTime: 8 };
  
  if (parts[1]) {
    try {
      const jsonStr = parts[1].trim().replace(/```json\n?|\n?```/g, '');
      metadata = JSON.parse(jsonStr);
    } catch (e) {
      console.log('Warning: Could not parse JSON metadata');
    }
  }
  
  return { content, metadata };
}

function generateFrontmatter(data, metadata) {
  const today = new Date().toISOString().split('T')[0];
  const tags = data.tags.split(',').map(t => t.trim()).filter(Boolean);
  
  const faqYaml = metadata.faq.map(item => 
    `  - q: "${item.q.replace(/"/g, '\\"')}"\n    a: "${item.a.replace(/"/g, '\\"')}"`
  ).join('\n');
  
  return `---
title: "${data.title}"
description: "${data.description}"
publishedDate: "${today}"
updatedDate: "${today}"
category: "${data.category}"
tags: [${tags.map(t => `"${t}"`).join(', ')}]
readingTime: ${metadata.readingTime || 8}
image: "/images/blog/${data.slug}.jpg"
imageAlt: "${data.title}"
faq:
${faqYaml}
---`;
}

async function main() {
  console.log('🤖 Generando contenido para:', CONTENT_DATA.slug);
  
  if (!ANTHROPIC_API_KEY) {
    throw new Error('ANTHROPIC_API_KEY no configurada');
  }
  
  const response = await callClaudeAPI(SYSTEM_PROMPT, buildUserPrompt(CONTENT_DATA));
  const { content, metadata } = parseResponse(response);
  const frontmatter = generateFrontmatter(CONTENT_DATA, metadata);
  const fullContent = `${frontmatter}\n\n${content}`;
  
  const outputPath = path.join('src', 'content', 'blog', `${CONTENT_DATA.slug}.mdx`);
  fs.mkdirSync(path.dirname(outputPath), { recursive: true });
  fs.writeFileSync(outputPath, fullContent, 'utf8');
  
  console.log('✅ Archivo creado:', outputPath);
  console.log('📊 Tiempo lectura:', metadata.readingTime, 'min');
  console.log('❓ FAQs generadas:', metadata.faq.length);
}

main().catch(err => {
  console.error('❌ Error:', err.message);
  process.exit(1);
});