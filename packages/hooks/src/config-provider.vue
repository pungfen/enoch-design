<script lang="ts">
import { defineComponent, h, provide, type PropType } from 'vue'

import { getDefaultConfig, FactoryConfigInjectionKey, type UserConfigFactory } from './config'

export default defineComponent({
  name: 'factory-config-provider',

  props: {
    config: {
      type: Object as PropType<UserConfigFactory>,
      default: getDefaultConfig
    }
  },

  setup(props, { slots }) {
    provide(FactoryConfigInjectionKey, { ...props })

    return () => h('div', slots)
  }
})
</script>
