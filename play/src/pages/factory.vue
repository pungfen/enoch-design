<template>
  <h1>factory</h1>

  <div>{{ number }}</div>

  <div>{{ form.data.name }}</div>

  <div>fullName{{ form.fullName }}</div>

  <input v-model="form.data.name" type="text" />

  <button @click="form.submit.click">按钮</button>
</template>

<script lang="ts">
import type { PropType } from 'vue'
import { factory } from '@enochfe/factory'

export default factory({
  props: {
    modelValue: {
      type: Object as PropType<{ name: string }>
    },
    number: {
      type: Number,
      default: 10
    }
  },

  async onMounted() {
    this.modelValue?.name

    await this.table.ajax()
  },

  setup: {
    table: {
      ajax: {
        action: 'GET /test'
      }
    },
    form: {
      data: {
        name: 'xxx'
      },
      computed: {
        fullName() {
          return '我叫' + this.form.data.name
        }
      },
      children: {
        submit: {
          ajax: {
            action: 'GET /test',
            data: 'array'
          },
          click() {
            console.log(this.form.fullName)
          }
        }
      }
    }
  }
})
</script>
