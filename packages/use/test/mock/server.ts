import { setupServer } from 'msw/node'
import { rest } from 'msw'

const baseUrl = 'https://example.com'

export const server = setupServer(
  rest.get(baseUrl, (req, res, ctx) => {
    console.log(res())
    const data = res()
    return data
  })
)

beforeAll(() => server.listen())
afterEach(() => server.resetHandlers())
afterAll(() => server.close())
