import { graphql, rest } from 'msw'

export const data = [
  {
    age: 1,
    name: 'first data name'
  },
  {
    age: 2,
    name: 'second data name'
  },
  {
    age: 3,
    name: 'third data name'
  }
]

const jsonPlaceHolder = graphql.link('https://jsonplaceholder.ir/graphql')

export const handlers = [
  rest.get('https://jsonplaceholder.typicode.com/posts', (req, res, ctx) => {
    return res(ctx.status(200), ctx.json(data))
  }),

  jsonPlaceHolder.query('/test', (req, res, ctx) => {
    return res(
      ctx.data({
        data
      })
    )
  })
]
