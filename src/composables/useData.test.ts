import { describe, it, expect, vi } from 'vitest'
import { ref } from 'vue'
import { useData } from './useData'
import type { DataDefinition } from '../types'

describe('useData', () => {
    // ... existing tests ...

    it('should handle race conditions when definition changes during fetch', async () => {
        const firstGet = vi.fn().mockImplementation(() => new Promise(resolve => {
            setTimeout(() => resolve(1), 50)
        }));

        const secondGet = vi.fn().mockImplementation(() => new Promise(resolve => {
            setTimeout(() => resolve(2), 50)
        }));

        const definition = ref<DataDefinition<number>>({
            operations: [
                {
                    get: firstGet,
                    isCache: false
                }
            ]
        });

        const { result } = useData(definition)

        // Initial state should be fetching
        expect(result.value.status).toBe('fetching')

        // Update definition immediately while first fetch is still in progress
        definition.value = {
            operations: [
                {
                    get: secondGet,
                    isCache: false
                }
            ]
        }

        // Wait for all operations to complete
        await new Promise(resolve => setTimeout(resolve, 60))

        // Result should reflect the second definition's value
        expect(result.value.status).toBe('success')
        if (result.value.status === 'success') {
            expect(result.value.data).toBe(2)
        }

        // Both gets should have been called
        expect(firstGet).toHaveBeenCalled()
        expect(secondGet).toHaveBeenCalled()
    })
})
