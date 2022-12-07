<template>
  <fieldset>
    <legend>defineFactory</legend>

    <div>{{ table.paging }}</div>

    <h1>xxx{{ table.totalCount }}</h1>

    <div>{{ $factory }}</div>
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
            action: 'GET /enocloud/service/query',
            data: 'array',
            pagination: true,
            params(params) {
              params.payload = { name: '22' }
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
