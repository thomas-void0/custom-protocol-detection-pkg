import { describe, expect, test } from 'vitest'
import { checkBrowser } from '../src/utils'

describe('test utils function', () => {
  test('test', () => {
    expect(checkBrowser()).toStrictEqual({})
  })
})
