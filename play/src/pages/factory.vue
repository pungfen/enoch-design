<template>
  <button @click="header.add.click">+</button>

  <!-- <div class="form-id">{{ form.data.id }}</div> -->

  <!-- <div class="form-name">{{ obj.name }}</div> -->
</template>

<script lang="ts">
import { factory } from '@enochfe/factory'

export default factory({
  props: {
    name: String
  },

  setup: {
    header: {
      children: {
        add: {
          click() {
            this.form.value.change()
            this.form.value.name = 'xxxx'
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
      },
      children: {
        value: {
          name: 'ss',
          change() {
            console.log(this)
          }
        }
      }
    }
  },

  mounted() {}
})
</script>
