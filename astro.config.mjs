import { defineConfig } from 'astro/config';
import mdx from '@astrojs/mdx';
import sitemap from '@astrojs/sitemap';

export default defineConfig({
  site: 'https://factura.spun.es',
  integrations: [
    mdx(),
    sitemap({
      filter: (page) => !page.includes('/draft/'),
      customPages: [
        'https://factura.spun.es/',
        'https://factura.spun.es/privacidad',
        'https://factura.spun.es/aviso-legal',
        'https://factura.spun.es/cookies',
        'https://factura.spun.es/blog'
      ],
      changefreq: 'weekly',
      priority: 0.7,
      serialize(item) {
        // Prioridades personalizadas
        if (item.url === 'https://factura.spun.es/') {
          return { ...item, priority: 1.0, changefreq: 'daily' };
        }
        if (item.url.includes('/blog/') && !item.url.endsWith('/blog/')) {
          return { ...item, priority: 0.8, changefreq: 'weekly' };
        }
        if (item.url.endsWith('/blog') || item.url.endsWith('/blog/')) {
          return { ...item, priority: 0.9, changefreq: 'daily' };
        }
        // Páginas legales - baja prioridad
        if (item.url.includes('/privacidad') || item.url.includes('/aviso-legal') || item.url.includes('/cookies')) {
          return { ...item, priority: 0.3, changefreq: 'monthly' };
        }
        return item;
      }
    })
  ],
  markdown: {
    shikiConfig: {
      theme: 'github-light'
    }
  },
  trailingSlash: 'never'
});
