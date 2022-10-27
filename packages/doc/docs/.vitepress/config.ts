import { defineConfig } from 'vitepress'
import { version } from '../../../components/package.json'

const nav = [
  {
    text: '文档',
    activeMatch: '^/docs/',
    link: '/docs/install'
  },
  {
    text: '基础组件',
    activeMatch: '^/components/',
    link: '/components/button'
  },
  {
    text: 'Playground',
    link: 'https://sfc.tianyuhao.cn'
  },
  {
    text: version,
    link: 'https://www.npmjs.com/package/fighting-design'
  }
]

const sidebar = {
  '/docs/': [
    {
      text: '开发指南',
      link: '/docs/',
      items: [
        { text: '安装', link: '/docs/install' },
        { text: '快速上手', link: '/docs/import' }
      ]
    },
    {
      text: '指南',
      link: '/docs/',
      items: [{ text: '介绍', link: '/docs/introduce' }]
    },
    {
      text: '历程',
      link: '/docs/',
      items: [
        { text: '更新日志', link: '/docs/changelog' },
        { text: '里程碑', link: '/docs/milepost' }
      ]
    }
  ],
  '/components/': [
    {
      text: '基础组件',
      link: '/components/',
      items: [{ text: 'Button 按钮', link: '/components/button' }]
    }
  ]
}

export default defineConfig({
  title: 'Enochfe Design',
  description: 'Just playing around.',
  lastUpdated: true,
  themeConfig: {
    lastUpdatedText: '最后更新时间',
    nav,
    sidebar
  }
})
