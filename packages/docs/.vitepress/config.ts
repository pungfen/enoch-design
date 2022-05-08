import { defineConfig } from 'vitepress'

export default defineConfig({
  lang: 'zh-CN',
  title: 'Enoch-Design',
  description: 'Enoch-Design-doc',
  lastUpdated: true,
  outDir: '../../dist/docs',
  locales: {
    'zh-CN': {
      label: '中文',
      lang: 'zh_CN'
    },
    'en-US': {
      label: '英文',
      lang: 'en-US'
    }
  },
  head: [
    [
      'link',
      {
        rel: 'icon',
        type: 'image/png',
        href: 'favicon.ico'
      }
    ]
  ],
  themeConfig: {
    repo: 'https://github.com/pungfen/enoch-design',
    docsBranch: 'dev',
    docsDir: 'docs',
    editLinks: true,
    editLinkText: 'Edit this page on GitHub',
    lastUpdated: 'Last Updated',

    nav: [
      { text: '指南', link: '/zh-CN/guide/introduction', activeMatch: '^/zh-CN/guide/' },
      { text: '组件', link: '/zh-CN/components/button', activeMatch: '^/zh-CN/components/' },
      { text: 'hooks', link: '/zh-CN/hooks/use-factory', activeMatch: '^/zh-CN/hooks/' }
    ],
    sidebar: {
      '/zh-CN/guide/': [
        {
          text: '介绍',
          link: '/zh-CN/guide/introduction'
        },
        {
          text: '更新日志',
          link: '/zh-CN/guide/changelogs'
        },
        {
          text: '快速开始',
          link: '/zh-CN/guide/quick-start'
        }
      ],
      '/zh-CN/components/': [
        {
          text: 'Button 按钮',
          link: '/zh-CN/components/button'
        }
      ],
      '/zh-CN/hooks/': [
        {
          text: 'use-factory',
          link: '/zh-CN/hooks/use-factory'
        }
      ]
    }
  }
})
