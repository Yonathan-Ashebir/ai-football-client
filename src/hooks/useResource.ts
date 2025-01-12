import {useCallback, useEffect, useRef, useState} from "react";
import {useLatest} from "./useLatest.ts";


export function useResource<Resource = any>(callback: () => Promise<Resource>, dependencies: Array<any> | undefined, options: {
  initialValue: Resource,
  updateInterval?: number,
  lazy?: boolean,
  onReload?: () => void,
}): {
  isLoading: boolean;
  reload: () => Promise<Resource>;
  resource: Resource;
  error: any;
  quickUpdate: <Resource>(value: ((<Resource>(prevState: Resource) => (Resource)) | Resource)) => void
}

export function useResource<Resource = any>(callback: () => Promise<Resource>, dependencies: Array<any> | undefined, options?: {
  initialValue?: Resource,
  updateInterval?: number,
  lazy?: boolean,
  onReload?: () => void,
}): {
  isLoading: boolean;
  reload: () => Promise<Resource>;
  resource: Resource | null;
  error: any;
  quickUpdate: <Resource>(value: ((<Resource>(prevState: Resource) => (Resource)) | Resource)) => void
}


export function useResource<Resource = any>(callback: () => Promise<Resource>, dependencies: Array<any> | undefined, options: {
  initialValue?: Resource,
  updateInterval?: number,
  lazy?: boolean,
  onReload?: () => void,
} | undefined) {
  const callRef = useRef<{ request: Promise<Resource>, dependencies?: Array<any> } | null>(); // info: to enforce React level redundancy protection
  const loadingLocked = useRef<boolean>(false);
  const [resource, setResource] = useState(options?.initialValue ?? null)
  const [oldDependencies, setDependencies] = useState<typeof dependencies>();
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<any>();

  const loadResourceRef = useLatest(async () => {
    if (loadingLocked.current) return callRef.current!.request;
    let request = callback();
    loadingLocked.current = true;
    options?.onReload?.()
    setIsLoading(true);
    callRef.current = {request, dependencies};
    let result;
    try {
      do {
        request = callRef.current!.request
        result = await request
      } while (callRef.current!.request !== request)
      setResource(result ?? null)
      setError(null)
    } catch (e) {
      if (request === callRef.current!.request) setError(e);
    } finally {
      if (request === callRef.current!.request) {
        setDependencies(callRef.current!.dependencies)
        setIsLoading(false);
        loadingLocked.current = false;
      }
    }
    return request;
  })

  const reload: () => Promise<Resource> = useCallback(() => loadResourceRef.current(), [])

  useEffect(() => {
    if (options?.updateInterval) {
      const id = setInterval(() => reload(), options.updateInterval);
      return () => clearInterval(id)
    }
  }, [options?.updateInterval])

  useEffect(() => {
    if (!options?.lazy) reload().then()
  }, dependencies);

  return {
    resource, oldDependencies, reload, isLoading, error, quickUpdate: (resource: Resource, error = undefined) => {
      if (resource !== undefined) setResource(resource);
      if (error !== undefined) setError(error)
    }
  };
}
