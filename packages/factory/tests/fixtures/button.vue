<script setup lang="ts">
import { h } from 'vue'

defineFactory({
  name: 'en-button',
  render() {
    return h('div', this.$props)
  }
})
</script>

<template>
  <div>
    <h1>hello world</h1>
  </div>
</template>
