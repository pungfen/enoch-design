<template>
  <fieldset>
    <legend>defineFactory</legend>

    <div>{{ table.paging }}</div>

    <h1>xxx{{ table.totalCount }}</h1>
  </fieldset>
</template>

<script lang="ts">
import { factory } from '@enochfe/factory'

export default factory(
  {
    children: {
      table: {
        ajax: {
          get: {
            action: 'GET /xx',
            data: 'array',
            pagination: true,
            params(params) {
              params.query = { name: 'xx' }
            }
          }
        },
        computed: {
          totalCount() {
            return this.table.paging.itemCount + this.table.paging.pageSize
          }
        }
      }
    }
  },
  {
    mounted() {
      this.table.get()
    }
  }
)
</script>
