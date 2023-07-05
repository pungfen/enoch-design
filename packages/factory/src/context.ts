import autobind from 'autobind-decorator'
import { reactive, h } from 'vue'

import type { Children, Options, Props } from './types'

@autobind
export class Context<PropsOptions extends Props, ChildrenOptions extends Children> {
  state = reactive<any>({})

  constructor(public readonly options: Options<PropsOptions, ChildrenOptions>) {
    this.options = options
  }

  converter() {}

  converterBlock() {}

  converterState() {}

  setup() {
    return this.render
  }

  render() {
    return h('div', null, [
      h('span', null, this.state.count),
      h(
        'button',
        {
          onClick: () => {
            this.state.count++
          }
        },
        '+'
      ),
      h(
        'button',
        {
          onClick: () => {
            this.state.count--
          }
        },
        '-'
      )
    ])
  }
}
