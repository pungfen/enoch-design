# esm（ES Modules

https://zhuanlan.zhihu.com/p/456483953

> JavaScript 官方的标准化模块系统（草案），在标准化道路上花了近 10 年时间。

- 适用于:

  - Browser
  - Node.js ≥ 12.17

<br/>

- 导出语法:

  ```js
  export default foo
  export const foo = 1
  export { bar as foo } from ''
  ```

- 使用语法:

  ```js
  import { foo } from 'name'
  import { foo as bar } from 'name'
  ```

- 备注:
  - JS 标准，优先考虑使用该模块
  - Tree Shaking 友好

# cjs（CommonJS）

> Node.js 的模块标准，文件即模块。

- 适用于：

  - Node.js

- 导出语法:

  ```js
  module.exports = foo
  exports.foo = 1
  ```

- 使用语法:

  ```js
  const foo = require('name')
  const { foo } = require('name')
  ```

- 备注:
  - 对 Tree Shaking 不友好
  - 前端也可以使用 cjs 格式，依靠构建工具（webpack / rollup 等）

# umd（Universal Module Definition）

> umd 严格意义上不算规范，只是社区出的通用包模块结合体的格式，兼容 CJS 和 AMD 格式。浏览器端用来挂载全局变量 （如：window.\*）

- 适用于：

  - Browser（external 场景）
  - Node.js（较少）

- 导出语法:

  ```js
  (function (root, factory) {
  if (// amd) {
  } else if (//cjs) {
  } else (//global) {
  }
  })(this, function() {})
  ```

- 使用语法:

  ```js
  window.React
  window.ReactDOM
  $
  ```
