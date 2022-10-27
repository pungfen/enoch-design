# 快速上手

## 完整引入

在 `main.js` 中引入下面内容

```js
import { createApp } from 'vue'
import App from './App.vue'

import FightingDesign from '@enochfe/components'
import '@enochfe/components/dist/index.css'

createApp(App).use(FightingDesign).mount('#app')
```

<!-- ## 按需引入

为了减小体积，只希望引入部分组件，可以使用按需引入的方式

```js
import { createApp } from 'vue'
import App from './App.vue'

// 组件按需引入
import { EnButton, FIcon } from '@enochfe/components'

// 样式按需引入
import '@enochfe/components/theme/button.css'
import '@enochfe/components/theme/icon.css'

createApp(App).use(EnButton).use(FIcon).mount('#app')
``` -->

## 使用 UMD

可通过 `UMD` 模式在 `*.html` 中引入 `Fighting Design`，快速构建您的程序

```html
<head>
  <link rel="stylesheet" href="https://cdn.jsdelivr.net/npm/@enochfe/components/dist/index.css" />
</head>

<body>
  <div id="app">
    <en-space>
      <en-button type="default">默认按钮</en-button>
      <en-button type="primary">主要按钮</en-button>
    </en-space>
  </div>

  <script src="https://cdn.jsdelivr.net/npm/vue/dist/vue.global.js"></script>
  <script src="https://cdn.jsdelivr.net/npm/@enochfe/components/dist/index.umd.js"></script>
  <script>
    const { createApp, ref } = Vue
    const { EnButton, EnSpace } = EnochfeComponents

    const app = createApp({
      setup() {
        const visible = ref(false)
        return { visible }
      }
    })

    app.use(EnButton)
    app.use(EnSpace)
    app.mount('#app')
  </script>
</body>
```
