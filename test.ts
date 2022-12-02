import { block, proxy, PARENT, createProxy } from './packages/core/src/index'

const origin = block({
  children: {
    form: {
      data: {
        name: 'xx'
      },
      fn() {
        this.form.data.name = 'yy'
      }
    }
  }
})

const state = proxy(origin)

state.form.fn()

console.log(state.form.data)
