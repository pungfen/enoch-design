<script lang="ts">
import { defineComponent, h } from 'vue'
import { ElButton } from 'element-plus'
import { buttonProps } from './button'

export default defineComponent({
  name: 'EnButton',

  props: buttonProps,

  setup(props, { slots }) {
    return () => {
      return h(
        ElButton,
        {
          type: props.type
        },
        { default: slots.default }
      )
    }
  }
})
</script>
