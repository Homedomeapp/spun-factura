import { defineConfig } from 'astro/config';
import mdx from '@astrojs/mdx';
import sitemap from '@astrojs/sitemap';

export default defineConfig({
  site: 'https://factura.spun.es',
  integrations: [
    mdx(),
    sitemap({
      filter: (page) => !page.includes('/draft/'),
      changefreq: 'weekly',
      priority: 0.7,
      serialize(item) {
        if (item.url === 'https://factura.spun.es/') {
          return { ...item, priority: 1.0, changefreq: 'daily' };
        }
        if (item.url.includes('/blog/') && !item.url.endsWith('/blog/') && !item.url.endsWith('/blog')) {
          return { ...item, priority: 0.8, changefreq: 'weekly' };
        }
        if (item.url.endsWith('/blog') || item.url.endsWith('/blog/')) {
          return { ...item, priority: 0.9, changefreq: 'daily' };
        }
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
