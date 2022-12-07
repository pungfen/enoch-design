<template>
  <div>
    <button @click="download">下载</button>
  </div>
</template>

<script setup lang="ts">
const download = async () => {
  const resource = await fetch('http://oss.ptponclick.com/oss_file/Default/File/20221130/a4cbe5dea98e448c867ac599e4ecb250.jpg').then((res) =>
    res.blob()
  )
  const a = document.createElement('a')
  const url = window.URL.createObjectURL(resource)
  a.href = url
  a.download = 'xxx'
  a.click()
  a.remove()
  window.URL.revokeObjectURL(url)
}
</script>

<style scoped></style>
