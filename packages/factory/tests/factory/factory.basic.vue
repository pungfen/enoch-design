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
          data: {} as { name: string },
          click() {
            this.form.data.id++

            this.table.ajax.get()

            this.table.detail.data
          }
        }
      }
    },
    form: {
      data: {
        id: 0,
        name: 'pung'
      },
      computed: {
        fullname() {
          return '我叫' + this.form.data.name
        }
      }
    },
    table: {
      ajax: {
        get: {
          action: 'GET /test',
          data: 'array'
        }
      },
      children: {
        detail: {
          ajax: {
            get: {
              action: 'GET /test',
              data: 'object',
              loading: true
            }
          }
        }
      }
    }
  }
})
</script>
