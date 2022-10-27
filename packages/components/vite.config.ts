import { resolve } from 'path'
import { defineConfig } from 'vite'

import vue from '@vitejs/plugin-vue'
import dts from 'vite-plugin-dts'
import unocss from 'unocss/vite'
import { presetUno, presetAttributify, presetIcons } from 'unocss'
import transformerDirective from '@unocss/transformer-directives'

export default defineConfig({
  plugins: [
    vue({ reactivityTransform: true }),
    dts({
      outputDir: ['./dist/types']
    }),
    unocss({
      shortcuts: [],
      presets: [presetUno(), presetAttributify(), presetIcons()],
      transformers: [transformerDirective()],
      theme: {
        colors: {
          primary: '#4C58D9'
        }
      }
    })
  ],
  build: {
    target: 'modules',
    minify: true,
    chunkSizeWarningLimit: 2,
    reportCompressedSize: true,
    emptyOutDir: true,
    outDir: resolve(__dirname, 'dist'),
    lib: {
      entry: resolve(__dirname, 'src/index.ts'),
      name: 'EnochComponent'
    },
    rollupOptions: {
      external: ['vue', 'uno.css'],
      output: [
        {
          format: 'umd',
          exports: 'named',
          dir: 'dist',
          sourcemap: false,
          entryFileNames: 'index.umd.js',
          chunkFileNames: '[name].js',
          assetFileNames: '[name].[ext]',
          namespaceToStringTag: true,
          manualChunks: undefined,
          inlineDynamicImports: false,
          globals: { vue: 'Vue' }
        },
        {
          format: 'es', // 打包模式 https://rollupjs.org/guide/en/#outputformat
          exports: 'named', // 导出模式 https://rollupjs.org/guide/en/#outputexports
          dir: 'dist/es', // 输出路径 https://rollupjs.org/guide/en/#outputdir
          entryFileNames: 'index.js', // 输出后的文件名 https://rollupjs.org/guide/en/#outputentryfilenames
          chunkFileNames: '[name].js', // 输出的 chunk文件名 https://rollupjs.org/guide/en/#outputchunkfilenames
          assetFileNames: '[name].[ext]', // 输出资产文件名 https://rollupjs.org/guide/en/#outputassetfilenames
          inlineDynamicImports: false, // https://rollupjs.org/guide/en/#outputinlinedynamicimports
          manualChunks: undefined,
          preserveModules: true, // https://rollupjs.org/guide/en/#outputpreservemodules
          preserveModulesRoot: 'src' // https://rollupjs.org/guide/en/#outputpreservemodules
        },
        {
          format: 'cjs',
          exports: 'named',
          dir: 'dist/lib',
          sourcemap: false,
          entryFileNames: 'index.js',
          chunkFileNames: '[name].js',
          assetFileNames: '[name].[ext]',
          namespaceToStringTag: true,
          inlineDynamicImports: false,
          manualChunks: undefined,
          preserveModules: true,
          preserveModulesRoot: 'src'
        }
      ]
    }
  }
})
