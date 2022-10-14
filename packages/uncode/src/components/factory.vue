<script lang="ts">
import { h, defineComponent, ref, type PropType } from 'vue'

import type { FactoryConfig } from '../core/config'
import { useFactory } from '../hooks/use-factory'

export default defineComponent({
  props: {
    config: {
      type: Object as PropType<FactoryConfig>
    },
    data: {
      type: Object
    }
  },

  setup(props) {
    const { render } = useFactory()

    return { render }
  },

  render() {
    return h('div', this.render)
  }
})
</script>
