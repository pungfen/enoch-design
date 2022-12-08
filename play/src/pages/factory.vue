<template>
  <fieldset>
    <legend>defineFactory</legend>

    <div ref="paging">{{ table.paging }}</div>

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
            action: 'GET /enocloud/common/release/note',
            data: 'array',
            pagination: true,
            params(params) {
              params.query = { pageIndex: 1 }
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
