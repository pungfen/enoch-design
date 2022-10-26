import { mount } from '@vue/test-utils'

import { EnButton } from '../src'

describe('EnButton', () => {
  test('class', () => {
    const wrapper = mount(EnButton)
    expect(wrapper.classes).toContain('en-button')
  })
})
