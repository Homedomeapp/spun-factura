import { defineConfig } from 'astro/config';
import mdx from '@astrojs/mdx';
import sitemap from '@astrojs/sitemap';
import rehypeSlug from 'rehype-slug';

export default defineConfig({
  site: 'https://factura.spun.es',
  integrations: [
    mdx(),
    sitemap({
      filter: (page) => !page.includes('/draft/'),
      serialize: (item) => {
        // Prioridades SEO personalizadas
        if (item.url === 'https://factura.spun.es/') {
          item.priority = 1.0;
        } else if (item.url === 'https://factura.spun.es/blog') {
          item.priority = 0.9;
        } else if (item.url.includes('/blog/')) {
          item.priority = 0.8;
        } else if (item.url.includes('/privacidad') || item.url.includes('/aviso-legal') || item.url.includes('/cookies')) {
          item.priority = 0.3;
        }
        return item;
      }
    })
  ],
  markdown: {
    rehypePlugins: [
      rehypeSlug // Genera slugs semánticos para headings
    ]
  },
  trailingSlash: 'never'
});
