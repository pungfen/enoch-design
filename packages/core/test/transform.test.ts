import { transform } from '../src/node/transform'

describe('transform', () => {
  const files = import.meta.glob('./*.vue', {
    eager: true,
    as: 'raw'
  })

  for (const [id, code] of Object.entries(files)) {
    test(`transform ${id.replace(/\\/g, '/')}`, () => {
      const exec = () => transform(code, id, {})?.code
      expect(exec()).toMatchSnapshot()
    })
  }
})
