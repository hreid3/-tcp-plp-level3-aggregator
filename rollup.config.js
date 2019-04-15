import typescript from 'rollup-plugin-typescript3'
import async from 'rollup-plugin-async'
import { terser } from "rollup-plugin-terser";
import pkg from './package.json'
export default {
  input: 'src/index.ts',
  output: [
    {
      file: pkg.main,
      format: 'cjs',
    },
    {
      file: pkg.module,
      format: 'es',
    },
  ],
  external: [
    ...Object.keys(pkg.dependencies || {}),
    ...Object.keys(pkg.peerDependencies || {}),
  ],
  plugins: [
    terser(),
    async(),
    typescript({
      typescript: require('typescript'),
    }),
  ],
}
