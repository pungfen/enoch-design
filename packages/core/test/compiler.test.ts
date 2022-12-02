import { mount } from '@vue/test-utils'
import Demo from './demo.vue'

test('mount', async () => {
  expect(Demo).toBeTruthy()

  const wrapper = mount(Demo)

  expect(wrapper.html()).toMatchSnapshot()
})
