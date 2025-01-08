import {useCallback, useEffect, useRef, useState} from "react";
import {useLatest} from "./useLatest.ts";
import {Simulate} from "react-dom/test-utils";
import error = Simulate.error;

interface Resource {
}

interface Options {
  updateInterval?: number;
  default?: Resource;
}


export const useResource = (callback: () => Promise<Resource>, dependencies: [] | undefined, options: Options | undefined) => {
  const callRef = useRef<Promise | undefined>(); // info: to enforce React level redundancy protection
  const loadingLocked = useRef(false);
  const [resource, setResource] = useState(options?.default)
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);

  const loadResourceRef = useLatest(async () => {
    if (loadingLocked.current) return callRef.current;
    let request = callback();
    loadingLocked.current = true;
    setIsLoading(true);
    callRef.current = request;
    let result;
    try {
      do {
        request = callRef.current
        result = await request
      } while (callRef.current !== request)
      console.log('result', result)
      setResource(result)
      setError(null)
      return result;
    } catch (e) {
      setError(e);
    } finally {
      if (request === callRef.current) {
        setIsLoading(false);
        loadingLocked.current = undefined;
      }
    }
  })

  const reload: () => Promise<Resource> = useCallback(() => loadResourceRef.current())

  useEffect(() => {
    if (options.updateInterval) {
      const id = setInterval(() => reload(), options.updateInterval);
      return () => clearInterval(id)
    }
  }, [options?.updateInterval])

  useEffect(() => {
    reload().then()
  }, dependencies);

  return [resource, reload, isLoading, error];
}