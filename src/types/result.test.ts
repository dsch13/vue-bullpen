import { describe, it, expect } from 'vitest'
import { isFetching, isError, isSuccess } from './result'
import type { Result } from './result'

describe('Result type guards', () => {
  it('should correctly identify fetching state', () => {
    const result: Result<number> = { status: 'fetching' }
    expect(isFetching(result)).toBe(true)
    expect(isError(result)).toBe(false)
    expect(isSuccess(result)).toBe(false)
  })

  it('should correctly identify error state', () => {
    const result: Result<number> = { status: 'error', error: new Error('Test error') }
    expect(isFetching(result)).toBe(false)
    expect(isError(result)).toBe(true)
    expect(isSuccess(result)).toBe(false)
  })

  it('should correctly identify success state', () => {
    const result: Result<number> = { status: 'success', data: 42 }
    expect(isFetching(result)).toBe(false)
    expect(isError(result)).toBe(false)
    expect(isSuccess(result)).toBe(true)
  })
})