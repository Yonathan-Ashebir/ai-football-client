import {DependencyList, useCallback, useMemo, useRef, useState} from "react";


export function useManaged<T = any>(compute: (prev: T | null, error: any) => (Awaited<T> | Promise<T>), deps: DependencyList, options?: {
  initialState?: Awaited<T>
}) {
  const updateIndexRef = useRef(0)
  const callRef = useRef<Promise<T>>(); // info: to enforce React level redundancy protection
  const [lateResult, setLateResult] = useState<{
    value: Awaited<T> | null,
    error: any,
    updateIndex: number
  }>({value: options?.initialState ?? null, error: null, updateIndex: updateIndexRef.current});

  const [isLoading, setIsLoading] = useState(false);

  const execute = async (task: Promise<T>) => {
    setIsLoading(true);
    let result;
    do {
      callRef.current = task;
      try {
        result = {value: await task, error: null, updateIndex: updateIndexRef.current++}
      } catch (e) {
        result = {value: null, error: e, updateIndex: updateIndexRef.current++}
      }
    } while (callRef.current !== task)
    if (callRef.current === task) {
      setIsLoading(false);
      setLateResult(result)
    }
    return {value: result.value, error: result.error};
  }

  const computed = useMemo(() => {
    const result = compute(lateResult?.value, lateResult?.error)
    if (result instanceof Promise) execute(result).then();
    else {
      const newState: { value: Awaited<T> | null; error: any; updateIndex: number; } = {
        ...result,
        value: result,
        error: null,
        updateIndex: updateIndexRef.current++
      }
      setLateResult(newState);
      return newState
    }
    return lateResult
  }, deps)

  const [value, error] = useMemo(() => {
    if (lateResult?.updateIndex > computed?.updateIndex) return [lateResult.value, lateResult.value]
    else return [computed.value, computed.error]
  }, [lateResult, computed])

  const update = useCallback(async (value: Awaited<T> | Promise<T> | ((prev: Awaited<T> | null, error: any) => (Awaited<T> | Promise<T>))) => {
    let immediate
    try {
      immediate = value instanceof Function ? value(lateResult.value, lateResult.error) : value;
    } catch (e) {
      setLateResult({value: null, error: e, updateIndex: updateIndexRef.current++})
      return {value: null, error: e}
    }
    if (immediate instanceof Promise) return await execute(immediate)
    setLateResult({value: immediate, error: null, updateIndex: updateIndexRef.current++})
    return {value: immediate, error: null}
  }, [])

  return {
    value,
    error,
    isLoading,
    update
  }
}