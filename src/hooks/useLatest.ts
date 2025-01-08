import {useRef} from "react";

export const useLatest = (value: any) => {
  const ref = useRef(value);
  ref.current = value;
  return ref;
}