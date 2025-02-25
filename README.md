# Vue-Bullpen

### A flexible and powerful data-fetching composable for Vue 3

**Vue-Bullpen** is a composable for managing complex data management and caching in Vue 3. `useData` manages returns
a result which simplifies displaying to the user the state of data fetching operations. If data is retrieved from the 
cache, it will be displayed to the user immediately and updated in place with the result from a network call. It can 
leverage vue's reactivity system to update in place for filters and other user driven state.

---

## **Features**

- Configurable error handling and fallback behaviors
- Race condition handling (latest fetch always wins)
- Manual refresh control to support pull to refresh
- TypeScript support for strong typing

---

## **Installation**

```sh
npm install vue-bullpen
```

## **Usage**
Because the definiton is computed from the props it will retreive updated data if the props change.

```vue
<script setup lang="ts">
import { ref } from 'vue';
import { useData } from 'vue-bullpen';
import { DataDefinitions } from 'your-definitions'

interface Props {
  someKey: string
}
const props = defineProps<Props>();

const definition = computed(() => {
  return DataDefinitions.Example.Get(props.someKey)
});

// Use the composable with default configuration
const { result, refreshResult } = useData(definition);

// Manual refresh example
const refreshData = () => {
  refreshResult({ useCacheOperations: false });
};
</script>

<template>
  <div>
    <p v-if="result.status === 'fetching'">Loading...</p>
    <p v-else>Error: {{ result.error.message }}</p>
    <p v-else-if="result.status === 'success'">Data: {{ result.data }}</p>
    <button @click="refreshData">Refresh Data</button>
  </div>
</template>
```

## **Types**

### Result<T>
The response structure returned by useData:

```ts
type Result<T> = 
  | { status: 'fetching' }
  | { status: 'success'; data: T }
  | { status: 'error'; error: Error }
```

### DataDefinition<T>
Defines the structure for all operations involved in fetching data:

```ts
type DataDefinition<T> = {
  operations: DataOperation<T>[];  // List of operations to execute
}
```

### DataOperation<T>
Represents a single function to get data, with an optional caching mechanism:

```ts
type DataOperation<T> = {
  get: () => Promise<T | undefined>;  // Function to fetch data
  set?: (data: T) => void;            // Optional function to cache data
  isCache: boolean;                   // Flag for cached operations
}
```
## **Configuration Options**

You can customize the behavior of `useData` globally during initialization or override it dynamically during a refresh.

| **Option**            | **Type**    | **Default** | **Description**                                      |
|-----------------------|------------|------------|--------------------------------------------------------|
| `useCacheOperations`  | `boolean`  | `true`     | Whether to execute cache-based operations              |
| `returnFirstValue`    | `boolean`  | `true`     | Stop after the first successful operation              |
| `keepResult`          | `boolean`  | `true`     | Whether to retain the previous result during refetches |

## **License**
This project is licensed under the MIT License.
