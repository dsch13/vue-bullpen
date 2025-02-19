export interface DataOperation<T> {
  get: () => Promise<T>;
  set?: (value: T) => Promise<void>;
  isCache: boolean;
}

export interface DataDefinition<T> {
  operations: DataOperation<T>[];
}