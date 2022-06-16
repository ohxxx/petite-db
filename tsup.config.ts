import { defineConfig } from 'tsup'

export default defineConfig({
  watch: true,
  entry: ['src/index.ts'],
  clean: true,
  splitting: false,
  format: ['esm'],
})
