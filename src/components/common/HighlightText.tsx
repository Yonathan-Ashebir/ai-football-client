import {HTMLAttributes} from "react";

export function HighlightText({children, className, variant = 'primary', ...rest}: { children: string, variant?: 'primary' | 'danger' } & HTMLAttributes<HTMLSpanElement>) {
    return <span
        className={"px-2 py-1 rounded-lg text-xs font-medium" + (variant =='danger'? " bg-red-50 text-red-950 ring-1 ring-red-100 ": " bg-primary-50 text-primary ring-1 ring-primary-100 ") + className} {...rest}
    >
        {children}
        </span>
}