import {DependencyList, useCallback, useMemo, useRef, useState} from "react";
import {areDependenciesChanged} from "../utils";


export function useManaged<T = any>(compute: (prev: T | null, error: any) => (Awaited<T> | Promise<T> | [Awaited<T>, Promise<T>]), deps: DependencyList) {
  const callRef = useRef<Promise<T>>();

  const [previousResult, setPreviousResult] = useState<{
    value: Awaited<T> | null,
    error: any
  }>({value: null, error: null});

  const [previousComputedResult, setPreviousComputedResult] = useState<typeof previousResult>({
    value: null,
    error: null
  })

  const [previousAsyncResult, setPreviousAsyncResult] = useState<typeof previousResult>({
    value: null,
    error: null
  })

  const [asyncResult, setAsyncResult] = useState<typeof previousResult>({
    value: null,
    error: null
  })

  const lastDependencies = useRef<typeof deps | null>(null)  // TODO: weird bug: why the | null necessary


  const [isLoading, setIsLoading] = useState(false);

  const execute = async (task: Promise<T>) => {
    setIsLoading(true);
    let result;
    callRef.current = task;
    do {
      task = callRef.current
      try {
        result = {value: await task, error: null}
      } catch (e) {
        result = {value: null, error: e}
      }
    } while (callRef.current !== task)
    if (callRef.current === task) {
      setIsLoading(false);
      setAsyncResult(result)
    }
    return {value: result.value, error: result.error};
  }

  const computed: typeof previousResult = useMemo(() => {
    if (!areDependenciesChanged(lastDependencies.current, deps)) return previousComputedResult
    lastDependencies.current = deps
    const result = compute(previousResult?.value, previousResult?.error)
    if (result instanceof Promise) execute(result).then();
    else if (result instanceof Array && result[1] instanceof Promise) {
      execute(result[1]).then();
      return {
        value: result[0],
        error: null,
      }
    } else {
      return {
        value: result,
        error: null,
      } as typeof previousResult
    }
    return previousComputedResult
  }, deps)

  const {value, error} = useMemo(() => {
    if (previousComputedResult !== computed) {
      setPreviousResult(computed)
      return computed
    }
    if (previousAsyncResult != asyncResult) {
      setPreviousResult(asyncResult)
      return asyncResult
    }
    return previousResult
  }, [computed, asyncResult])

  if (previousComputedResult !== computed) setPreviousComputedResult(computed)
  if (previousAsyncResult !== asyncResult) setPreviousAsyncResult(asyncResult)


  const update = useCallback(async (value: Awaited<T> | Promise<T> | typeof compute) => {
    let result
    try {
      result = value instanceof Function ? value(previousResult.value, previousResult.error) : value;
    } catch (e) {
      setAsyncResult({value: null, error: e})
      return {value: null, error: e}
    }
    if (result instanceof Promise) return await execute(result)
    if (result instanceof Array && result[1] instanceof Promise) {
      execute(result[1]).then();
      return {
        value: result[0],
        error: null,
      }
    } else {
      return {
        value: result,
        error: null,
      } as typeof previousResult
    }
  }, [])

  return {
    value,
    error,
    isLoading,
    update
  }
}