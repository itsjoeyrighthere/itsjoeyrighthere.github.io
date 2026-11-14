import { defineConfig } from 'astro/config';
import sitemap from '@astrojs/sitemap';

export default defineConfig({
  site: 'https://itsjoeyrighthere.github.io',
  output: 'static',
  trailingSlash: 'always',
  integrations: [sitemap({ filter: (page) => !new URL(page).pathname.startsWith('/blog/') })],
  compressHTML: true,
});
