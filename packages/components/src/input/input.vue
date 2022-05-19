<script lang="ts">
import { defineComponent, h } from 'vue'
import { ElInput } from 'element-plus'
import { inputProps } from './input'

export default defineComponent({
  name: 'EnInput',

  props: inputProps,

  setup(props, {}) {
    return () => {
      return h(ElInput, { ...props })
    }
  }
})
</script>
