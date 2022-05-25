<script lang="ts">
import { assign } from 'lodash'
import { defineStore } from 'pinia'
import { defineComponent, h, provide, type PropType } from 'vue'

import { getDefaultConfig, FactoryConfigInjectionKey, type UserConfigFactory } from './config'

const defaultConfig = getDefaultConfig()

export default defineComponent({
  name: 'factory-config-provider',

  props: {
    config: {
      type: Object as PropType<Partial<UserConfigFactory>>,
      default: getDefaultConfig
    }
  },

  setup(props, { slots }) {
    const store = defineStore('factory', assign(defaultConfig.store, props.config.store))

    provide(FactoryConfigInjectionKey, { ...props, store })

    return () => h('div', slots)
  }
})
</script>
