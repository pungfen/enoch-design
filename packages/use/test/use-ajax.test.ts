// import { fetch } from '../src'
import './mock/server'

// let fetchSpy = vitest.spyOn(window, 'fetch')
// let onFetchErrorSpy = vitest.fn()
// let onFetchResponseSpy = vitest.fn()
// let onFetchFinallySpy = vitest.fn()

describe('fetch', () => {
  // beforeEach(() => {
  //   fetchSpy = vitest.spyOn(window, 'fetch')
  //   onFetchErrorSpy = vitest.fn()
  //   onFetchResponseSpy = vitest.fn()
  //   onFetchFinallySpy = vitest.fn()
  // })

  test('should have status code of 200 and message of Hello World', async () => {
    const res = await window.fetch('https://enocloudd.enoch-car.com/enocloud/sso/security/user').then((res) => res.json())
  })
})
