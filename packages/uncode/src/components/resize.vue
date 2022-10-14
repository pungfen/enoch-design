<template>
  <div ref="resize"></div>
</template>

<script setup lang="ts">
import { ref } from 'vue'

const resize = ref<HTMLDivElement | null>()
</script>

<style scoped></style>
