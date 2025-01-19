import {ReactNode} from "react";

export function Tooltip({children, className  ="", ...rest}: { children: ReactNode, className?: string }) {
  return <div
    className={`absolute bottom-full left-0 mb-2 w-64 p-2 bg-gray-800 text-white text-xs rounded-lg opacity-0 invisible group-hover/type:opacity-100 group-hover/type:visible transition-all z-10 ` + className} {...rest}>
    {children}
  </div>
}