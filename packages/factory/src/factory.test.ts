import { factory } from '.'

describe('factory', () => {
  const f = factory(
    {
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

      onMounted () {
        this.type
      }
    }
  )

})
