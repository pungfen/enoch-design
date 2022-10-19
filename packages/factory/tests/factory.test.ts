import { mount } from '@vue/test-utils'

import FactoryBasic from './factory/factory.basic.vue'

describe('factory basic', () => {
  test('mount component', () => {
    expect(FactoryBasic).toBeTruthy()
  })

  test(`shoule render 'form data name' correctly`, () => {
    const wrapper = mount(FactoryBasic)
    const formElement = wrapper.find('.form-name')
    expect(formElement.text()).toBe('pung')
    expect(wrapper.html()).toMatchSnapshot()
  })

  test(`shoule render 'form data id' correctly`, () => {
    const wrapper = mount(FactoryBasic)
    const formElement = wrapper.find('.form-id')
    expect(formElement.text()).toBe('0')
    expect(wrapper.html()).toMatchSnapshot()
  })

  test(`emit 'header.add.click' event, shoule render 'form data id' correctly`, async () => {
    const wrapper = mount(FactoryBasic)
    const buttonElement = wrapper.get('button')
    const formElement = wrapper.find('.form-id')
    expect(formElement.text()).toContain('0')

    await buttonElement.trigger('click')

    expect(formElement.text()).toContain('1')

    expect(wrapper.html()).toMatchSnapshot()
  })
})
