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

  onMounted() {
    this.modelValue?.name
    this.table.ajax()
    this.table.data
    this.dialog.visible = false
    this.dialog.check.click()
  },

  onUnmounted() {},

  setup: {
    table: {
      ajax: {
        action: 'GET /test',
        data: 'array'
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
    },
    dialog: {
      visible: false,
      children: {
        check: {
          click() {}
        }
      }
    }
  }
})
</script>
