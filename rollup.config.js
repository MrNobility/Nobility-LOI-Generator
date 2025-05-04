// rollup.config.js
import json from '@rollup/plugin-json';            // ← first, so JSON imports work
import resolve from '@rollup/plugin-node-resolve'; // lets Rollup find modules
import commonjs from '@rollup/plugin-commonjs';    // lets Rollup handle CommonJS packages
import { terser } from '@rollup/plugin-terser';     // minifier

export default {
  input: 'src/main.js',
  output: {
    inlineDynamicImports: true,
    file: 'src/dist/bundle.js',
    format: 'iife',
    sourcemap: true,
    name: 'NobilityLOI'
  },
  plugins: [
    json(),      // ← JSON support must come before code that imports JSON
    resolve(),
    commonjs(),
    terser()
  ]
};
