<template>
  <div>
    <h1>Button - 按钮</h1>
    <en-button type="primary" disabled>按钮</en-button>
    <en-button class="ml-2">按钮</en-button>
  </div>

  <div>
    <h1>Popover - 弹框</h1>

    <en-popper placement="bottom" trigger="hover">
      <en-button type="primary" ref="buttonRef">按钮</en-button>
      <template #popper>
        <div class="h-20 w-20 border border-solid border-red">
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
import { EnButton, EnPopper } from '@enochfe/components'

const buttonRef = ref()
</script>
