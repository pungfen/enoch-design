import { factory } from '.'

describe('factory', () => {
  const f = factory({
    props: {
      type: Number
    },

    setup: {
      form: {
        ajax: {
          action: 'GET /test',
          data: 'object'
        }
      }
    },

    onMounted() {
      this.type
    }
  })

  it('Math.sqrt()', () => {
    expect(Math.sqrt(4)).toBe(2)
    expect(Math.sqrt(144)).toBe(12)
    expect(Math.sqrt(2)).toBe(Math.SQRT2)

    const result = Math.sqrt(16)
    expect(result).toMatchSnapshot()
    expect(result).toMatchInlineSnapshot('4')
  })
})

describe.skip('fp', () => {
  it('skipped test', () => {
      assert.equal(Math.sqrt(4), 10)
  })
})

describe.todo('unimplemented suite')

describe('suite', () => {
  it.todo('unimplemented test')
})

