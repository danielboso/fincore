import { build } from 'vite';

await build({
  configFile: false,
  publicDir: false,
  ssr: {
    noExternal: true,
  },
  build: {
    ssr: 'docker/migrate.js',
    outDir: 'dist',
    emptyOutDir: false,
    rollupOptions: {
      output: {
        entryFileNames: 'migrate.mjs',
        format: 'esm',
      },
    },
  },
});
