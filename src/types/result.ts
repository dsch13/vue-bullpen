export type Result<T> = 
  | { status: 'fetching' }
  | { status: 'error'; error: Error }
  | { status: 'success'; data: T }

export function isFetching<T>(result: Result<T>): result is { status: 'fetching' } {
  return result.status === 'fetching'
}

export function isError<T>(result: Result<T>): result is { status: 'error'; error: Error } {
  return result.status === 'error'
}

export function isSuccess<T>(result: Result<T>): result is { status: 'success'; data: T } {
  return result.status === 'success'
}