<template>
  <button @click="header.add.click">+</button>

  <div class="form-id">{{ form.data.id }}</div>

  <div class="form-name">{{ form.data.name }}</div>
</template>

<script lang="ts">
import { factory } from '../../src'

export default factory({
  setup: {
    header: {
      children: {
        add: {
          click() {
            this.form.data.id++
          }
        }
      }
    },
    form: {
      data: {
        id: 0,
        name: 'pung'
      },
      ajax: {
        action: 'GET /xx'
      }
    }
  },

  mount() {}
})
</script>
