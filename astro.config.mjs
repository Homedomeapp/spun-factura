import { defineConfig } from 'astro/config';
import mdx from '@astrojs/mdx';
import sitemap from '@astrojs/sitemap';
import rehypeSlug from 'rehype-slug';

export default defineConfig({
  site: 'https://factura.spun.es',
  integrations: [mdx(), sitemap()],
  markdown: {
    rehypePlugins: [rehypeSlug]
  },
  trailingSlash: 'never'
});
