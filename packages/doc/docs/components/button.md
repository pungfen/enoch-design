# Button 按钮

功能很强大的按钮

- [源代码](https://github.com/pungfen/enoch-design/tree/main/packages/components/src/button)
- [文档编辑](https://github.com/pungfen/enoch-design/tree/main/packages/docs/docs/components/button.md)

## 基本使用

`type` 属性可以配置不同的按钮类型，展示不同的颜色状态

<!-- <f-sticky-card :open="false" close-text="展开代码" open-text="折叠代码"> -->

<template #source>
<en-button type="default">默认按钮</en-button>
<en-button type="primary">主要按钮</en-button>

<br />

<en-button type="default">默认按钮</en-button>
<en-button type="primary">主要按钮</en-button>

</template>

```html
<en-button type="default">默认按钮</en-button>
<en-button type="primary">主要按钮</en-button>

<en-button simple type="default">默认按钮</en-button>
<en-button simple type="primary">主要按钮</en-button>
```

<!-- </f-sticky-card> -->
