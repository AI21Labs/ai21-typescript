import resolve from '@rollup/plugin-node-resolve';
import commonjs from '@rollup/plugin-commonjs';
import typescript from '@rollup/plugin-typescript';
import { terser } from 'rollup-plugin-terser';

export default {
  input: 'src/index.ts', // Entry point of your library
  output: [
    {
      file: 'dist/bundle.cjs.js',
      format: 'cjs', // CommonJS format for Node.js
      sourcemap: true,
    },
    {
      file: 'dist/bundle.esm.js',
      format: 'esm', // ES module format for modern browsers
      sourcemap: true,
    },
  ],
  plugins: [
    resolve(), // Resolves node_modules
    commonjs(), // Converts CommonJS to ES6
    typescript(), // Compiles TypeScript
    terser(), // Minifies the bundle
  ],
  external: ['node-fetch'], // Exclude node-fetch from the bundle
};