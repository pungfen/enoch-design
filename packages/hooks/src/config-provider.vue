<script lang="ts">
import { defineComponent, h, provide, type PropType } from 'vue'

import { FactoryConfigInjectionKey, type UserConfigExport } from './config'

const getDefaultConfig = () => {}

export default defineComponent({
  props: {
    config: {
      type: Object as PropType<UserConfigExport>,
      default: getDefaultConfig
    }
  },

  setup(props, { slots }) {
    provide(FactoryConfigInjectionKey, { ...props })

    return () => h('div', slots)
  }
})
</script>
