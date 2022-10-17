import type { ComponentPublicInstance } from 'vue'

type Index = {}

type Children<C> = {}

type _FactoryConfig = {
  [index: string]: any
}

interface FactoryConfig {
  name: string
  setup?: Record<string, _FactoryConfig>
  mount?: () => void
  unmount?: () => void
}

export const factory = <FC extends FactoryConfig>(config: FC) => {}

factory({
  name: '',
  setup: {
    header: {
      slots: {
        add: {
          tag: 'en-button',
          on: {
            click() {
              console.log(this)
            }
          }
        }
      }
    },
    manifest: {
      slots: {
        table: {
          tag: 'en-table',
          props: {
            code: 'XXXXX'
          }
        },
        form: {
          data: {
            name: ''
          },
          props: {
            items: [{ label: '姓名', prop: 'name' }]
          }
        }
      }
    }
  }
})
