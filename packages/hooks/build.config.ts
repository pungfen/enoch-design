import { defineBuildConfig } from 'unbuild'

export default defineBuildConfig({
  entries: ['./src/index', { input: 'src/components/', outDir: 'dist/components' }],
  hooks: {
    'rollup:options'() {}
  },
  declaration: true
})
