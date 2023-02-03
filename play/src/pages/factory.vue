<script lang="ts">
import { factory } from '@enochfe/factory'
import ViewItem from '@/components/view-item.vue'

export default factory({
  layout: ViewItem,

  config: {
    header: {
      children: [
        {
          is: 'button',
          class: 'm-button',
          children: '按钮'
        },
        {
          is: 'span',
          class: 'm-span',
          children: 'span'
        }
      ]
    }
  }
})
</script>

<style scoped>
.m-button {
  border: 1px solid teal;
}

.m-span {
  border: 1px solid springgreen;
}
</style>
