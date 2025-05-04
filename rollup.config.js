// rollup.config.js
import json from '@rollup/plugin-json';
import resolve from '@rollup/plugin-node-resolve';
import commonjs from '@rollup/plugin-commonjs';
import { babel } from '@rollup/plugin-babel';
import terser from '@rollup/plugin-terser'; // ✅ fixed this line
import replace from '@rollup/plugin-replace';
import nodeGlobals from 'rollup-plugin-node-globals';
import builtins from 'rollup-plugin-node-builtins';


export default {
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
      'process.env.NODE_ENV': JSON.stringify('development'),
    }),
    builtins(),
    nodeGlobals(),
    json(),
    resolve({ browser: true, preferBuiltins: false }),
    commonjs(),
    babel({
      babelHelpers: 'bundled',
      presets: ['@babel/preset-react'],
      extensions: ['.js', '.jsx'],
      exclude: 'node_modules/**',
    }),
    terser()
    ]
  }
