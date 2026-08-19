"use client";

import { forwardRef } from "react";

interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> { onClear?: () => void }

const Input = forwardRef<HTMLInputElement, InputProps>(({ onClear, className = "", ...props }, ref) => (
  <div className="relative w-full">
    <span className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground">&gt;</span>
    <input ref={ref} className={`w-full border border-input bg-transparent py-2 pl-8 pr-12 text-sm outline-none transition-colors hover:border-ring/50 focus:border-ring focus:ring-1 focus:ring-ring ${className}`} {...props} />
    {onClear && props.value && <button type="button" className="input-clear" onClick={onClear} aria-label="Clear search">[x]</button>}
  </div>
));

Input.displayName = "Input";
export { Input };
