<script setup lang="ts">
import { h } from 'vue'

defineFactory({
  name: 'xx',
  render() {
    console.log(this)
    return h(
      'div',
      {
        class: 'flex flex-col'
      },
      [h('span', '我是span'), h('span', '我是span1')]
    )
  }
})
</script>
