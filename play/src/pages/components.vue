<template>
  <div>
    <h1>Button - 按钮</h1>
    <en-space>
      <en-button type="primary">按钮</en-button>
      <en-button>按钮</en-button>
      <en-button type="primary" disabled>按钮</en-button>
      <en-button disabled>按钮</en-button>
      <en-button text>按钮</en-button>
      <en-button type="primary" text>按钮</en-button>
      <en-button text disabled>按钮</en-button>
      <en-button type="primary" text disabled>按钮</en-button>
    </en-space>
  </div>

  <div>
    <h1>Input - 输入</h1>

    <div class="flex flex-col gap-2">
      <span>{{ inputVal }}</span>
      <en-input v-model="inputVal"></en-input>
      <en-input placeholder="我是占位文字"></en-input>
    </div>
  </div>

  <div>
    <h1>Popover - 弹框</h1>

    <en-popper virtual-triggering :virtual-ref="buttonRef" placement="bottom-start" trigger="click">
      <en-button type="primary" ref="buttonRef">按钮</en-button>

      <template #popper>
        <div class="h-20 w-20">
          <span>1</span>
          <span>2</span>
          <span>3</span>
        </div>
      </template>
    </en-popper>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import { EnButton, EnInput, EnPopper, EnSpace } from '@enochfe/components'

const buttonRef = ref()
const inputVal = ref('')
</script>
