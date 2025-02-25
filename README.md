# Vue-Bullpen

### A flexible and powerful data-fetching composable for Vue 3

**Vue-Bullpen** is a composable for managing complex data-fetching workflows in Vue 3. It supports advanced configurations such as caching, early returns, error handling, and reactive data fetching. Designed for flexibility, it integrates seamlessly with Vue’s reactivity system while allowing manual control over fetch behavior when needed.

---

## 🚀 **Features**

- ✅ Reactive data-fetching system using Vue 3 Composition API  
- ✅ Support for multiple operations with built-in caching  
- ✅ Configurable error handling and fallback behaviors  
- ✅ Token-based race condition handling (latest fetch always wins)  
- ✅ Supports reactive and non-reactive data definitions  
- ✅ Manual refresh control with override options  
- ✅ TypeScript support for strong typing  

---

## 📦 **Installation**

```sh
npm install vue-bullpen
```

## **Usage**
```vue
<script setup lang="ts">
import { ref } from 'vue';
import { useData } from 'vue-bullpen';
import type { DataDefinition } from 'vue-bullpen';

// Define your data operations
const definition = ref<DataDefinition<number>>({
  operations: [
    {
      get: async () => {
        const response = await fetch('https://api.example.com/data');
        return response.ok ? await response.json() : undefined;
      },
      isCache: false
    }
  ]
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
    <p v-else-if="result.status === 'success'">Data: {{ result.data }}</p>
    <p v-else>Error: {{ result.error.message }}</p>
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
