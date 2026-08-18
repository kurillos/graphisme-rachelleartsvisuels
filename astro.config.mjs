import { defineConfig } from 'astro/config';

export default defineConfig({
  site: 'https://graphisme.rachelleartsvisuels.fr',
  // Export 100% statique -> compatible hébergement mutualisé (O2switch)
  output: 'static',
});
