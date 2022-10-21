<template>
  <button @click="header.add.click">+</button>

  <div class="form-id">{{ form.data.id }}</div>

  <div class="form-name">{{ form.data.name }}</div>
</template>

<script lang="ts">
import { factory } from '@enochfe/factory'

export default factory({
  setup: {
    header: {
      children: {
        add: {
          click() {
            this.form.data.id++
            this.form.data.name
          }
        }
      }
    },
    form: {
      data: {
        id: 0
      },
      ajax: {
        get: {
          action: 'GET /test',
          data: 'object',
          pagination: true,
          loading: true
        },
        post: {
          action: 'GET /test'
        },
        put: {
          action: 'GET /test'
        }
      }
    }
  },

  mounted() {
    this.form.loading
  }
})
</script>
