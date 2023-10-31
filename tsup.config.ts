import { defineConfig } from 'tsup'

const config = {
  outDir: 'dist',
  clean: true,
  minify: true,
  sourcemap: false
}

export default defineConfig([
  {
    entry: ['index.ts'],
    publicDir: "./publish-template",
    treeshake: true,
    format: ['cjs'],
    ...config
  }
])