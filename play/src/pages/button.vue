<template>
  <en-config :theme="theme">
    <en-button type="primary" disabled>按钮</en-button>
    <en-button type="primary">按钮</en-button>

    <div>
      <span>{{ value }}</span>
      <en-input v-model="value" type="textarea"></en-input>
    </div>
  </en-config>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import { EnButton, EnConfig, EnInput, type Theme } from '@enochfe/components'

const theme: Theme = {
  button: {}
}

const value = ref('')
</script>

<style scoped></style>
