import { describe, it, expect } from 'vitest'
import type { DataDefinition } from './dataDefinition'

describe('DataDefinition', () => {
  it('should allow creation with only get operations', async () => {
    const definition: DataDefinition<number> = {
      operations: [
        {
          get: async () => 42,
          isCache: true
        }
      ]
    }

    const result = await definition.operations[0].get()
    expect(result).toBe(42)
  })

  it('should allow creation with both get and set operations', async () => {
    let value = 0
    const definition: DataDefinition<number> = {
      operations: [
        {
          get: async () => value,
          set: async (newValue) => {
            value = newValue
          },
          isCache: false,
        }
      ]
    }

    await definition.operations[0].set?.(42)
    const result = await definition.operations[0].get()
    expect(result).toBe(42)
  })
})