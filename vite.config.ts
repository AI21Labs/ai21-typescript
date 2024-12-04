import { defineConfig } from 'vite';
import dts from 'vite-plugin-dts';

export default defineConfig({
  build: {
    lib: {
      entry: 'src/index.ts',
      name: 'MySDK',
      fileName: (format) => `bundle.${format}.js`,
      formats: ['es', 'cjs', 'umd'],
    },
    rollupOptions: {
      external: ['node-fetch', 'fs', 'path', 'stream', 'form-data'],
      output: {
        globals: {
          'node-fetch': 'fetch', 
        },
      },
    },
  },
  plugins: [
    dts({
      insertTypesEntry: true,
    }),
  ],
});
