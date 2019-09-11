import resolve from 'rollup-plugin-node-resolve';
import commonjs from 'rollup-plugin-commonjs';
import postcss from 'rollup-plugin-postcss';

export default {
  input: 'app/index.js',
  output: {
    file: 'public/bundle.js',
    format: 'iife',
    name: 'sfMovies'
  },
  plugins: [
    resolve(),
    commonjs(),
    postcss({
      plugins: []
    })
  ]
};