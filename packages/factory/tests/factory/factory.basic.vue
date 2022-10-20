<template>
  <button @click="header.add.click">+</button>

  <div class="form-data-id">{{ form.data.id }}</div>

  <div class="form-data-name">{{ form.data.name }}</div>

  <div class="form-fullname">{{ form.fullname }}</div>
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
        action: 'GET /test',
        data: 'object'
      },
      computed: {
        fullname() {
          return '我叫' + this.form.data.name
        }
      }
    },
    table: {
      ajax: {
        action: 'GET /test',
        data: 'array'
      },
      children: {
        detail: {
          ajax: {
            action: 'GET /test',
            data: 'array',
            loading: true
          }
        }
      }
    }
  },

  mounted() {
    this.form.ajax()
    this.table.detail.ajax()
    this.table.detail.data[0].name
    this.table.detail.loading
  }
})
</script>
