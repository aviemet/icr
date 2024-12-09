import { setupServer } from 'msw/node'
import { handlers } from  './handlers'
import { afterAll, afterEach, beforeAll } from 'vitest'

const server = setupServer(...handlers)

beforeAll(() => server.listen())
afterEach(() => server.resetHandlers())
afterAll(() => server.close())
