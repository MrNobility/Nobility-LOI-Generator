// rollup.config.cjs
const postcss      = require('rollup-plugin-postcss');
const json         = require('@rollup/plugin-json');
const resolve = require('@rollup/plugin-node-resolve').nodeResolve;
const commonjs     = require('@rollup/plugin-commonjs');
const { babel }    = require('@rollup/plugin-babel');
const terser       = require('@rollup/plugin-terser').default;
const replace      = require('@rollup/plugin-replace');
const nodeGlobals  = require('rollup-plugin-node-globals');
const builtins     = require('rollup-plugin-node-builtins');
const tailwindcss  = require('tailwindcss');
const autoprefixer = require('autoprefixer');

module.exports = {
  input: 'src/main.jsx',
  output: {
    inlineDynamicImports: true,
    file: 'dist/bundle.js',
    format: 'iife',
    sourcemap: true,
    name: 'NobilityLOI'
  },
  plugins: [
    replace({
      preventAssignment: true,
      'process.env.NODE_ENV': JSON.stringify(process.env.NODE_ENV || 'development'),
    }),

    postcss({
      extensions: ['.css'],
      extract: true,
      minimize: process.env.NODE_ENV === 'production',
      plugins: [tailwindcss(), autoprefixer()]
    }),

    builtins(),
    nodeGlobals(),
    json(),
    resolve({
      browser: true,
      preferBuiltins: false,
      extensions: ['.mjs', '.js', '.jsx', '.json']
    }),
    commonjs(),

    babel({
      babelHelpers: 'bundled',
      presets: ['@babel/preset-react'],
      extensions: ['.js', '.jsx', '.mjs'],
      exclude: 'node_modules/**',
    }),

    terser()
  ]
};
