<template>
  <div>{{ _DF_PROXY }}</div>
</template>

<script setup lang="ts">
defineFactory({
  children: {
    form: {
      data: {
        name: 'xx'
      },
      watch: {
        name() {
          console.log('name is change', this.form.data.name)
        }
      },
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
