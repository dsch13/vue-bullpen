import { ref, watch, Ref, isRef, unref } from 'vue'
import type { DataDefinition, DataOperation, Result } from '../types'

export function useData<T>(definition: DataDefinition<T> | Ref<DataDefinition<T> | null>, args?: { useCacheOperations?: boolean }) {
    const cache = args?.useCacheOperations ?? true;

    const result: Ref<Result<T>> = ref<Result<T>>({ status: 'fetching' }) as Ref<Result<T>>
    let token: symbol | null = null

    const fetchData = async (args?: { returnFirstValue?: boolean, keepResult?: boolean }): Promise<Result<T>> => {
        const firstValue = args?.returnFirstValue ?? false;
        const keepResult = args?.keepResult ?? true;

        const currentToken = Symbol()
        token = currentToken

        const currentDefinition = unref(definition)
        if (currentDefinition === null) return result.value as Result<T>;

        const previousData = result.value.status === 'success' ? result.value.data as T : undefined
        if (token === currentToken && !keepResult) {
            result.value = { status: 'fetching' }
        }

        const lastError = await executeOperations(currentDefinition.operations, cache, currentToken, firstValue)

        if (token !== currentToken) {
            return result.value as Result<T>
        }

        if (result.value.status === 'fetching') {
            if (previousData !== undefined) {
                result.value = { status: 'success', data: previousData as T }
                return result.value as Result<T>
            }
            else handleError(lastError, previousData);
        }

        return result.value as Result<T>
    }

    const executeOperations = async (operations: DataOperation<T>[], skipCache: boolean, currentToken: symbol, firstValue: boolean) => {
        let lastNonCacheError: Error | undefined

        for (const operation of operations) {
            if (token !== currentToken) {
                return lastNonCacheError
            }

            if (skipCache && operation.isCache) continue

            try {
                const data = await operation.get();

                if (data !== undefined && token === currentToken) {
                    result.value = { status: 'success', data: data as T }
                    if (operation.set) operation.set(data)
                    if (firstValue) return lastNonCacheError;
                }
                else if (!operation.isCache) lastNonCacheError = new Error('Operation failed')
            }
            catch (error) {
                if (!operation.isCache) lastNonCacheError = error instanceof Error ? error : new Error('Unknown error')
            }
        }

        return lastNonCacheError
    }

    const handleError = (error: unknown, previousData: T | undefined) => {
        if (previousData !== undefined) result.value = { status: 'success', data: previousData as T };
        else result.value = { status: 'error', error: error instanceof Error ? error : new Error('Fetch failed') };
    }

    const refreshResult = () => fetchData()

    if (isRef(definition)) {
        // Do not do immediately so we can return the promise below for when reactivity is not needed
        watch(definition, () => fetchData(), { immediate: false });
    }
    const data = fetchData();

    return { result, refreshResult, data }
}
