<template>
  <div></div>
</template>

<script setup lang="ts">
defineFactory({
  children: {
    form: {
      children: {
        name: {
          change() {
            console.log(`I am form's name change`)
          }
        }
      }
    }
  }
})
</script>
