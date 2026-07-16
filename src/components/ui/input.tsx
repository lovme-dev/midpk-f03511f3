
import * as React from "react"

import { cn } from "@/lib/utils"

export interface InputProps
  extends React.InputHTMLAttributes<HTMLInputElement> {
  variant?: "default" | "blue" | "dark" | "colored"
}

const Input = React.forwardRef<HTMLInputElement, InputProps>(
  ({ className, type, variant = "default", ...props }, ref) => {
    return (
      <input
        type={type}
        className={cn(
          "flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-base ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium file:text-foreground placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50 md:text-sm",
          variant === "blue" && "bg-[#0099FF]/10 border-none text-white text-lg placeholder:text-gray-400 focus-visible:ring-0 h-12",
          variant === "dark" && "bg-[#1E293B] border-none text-white placeholder:text-gray-400 focus-visible:ring-0 focus-visible:ring-offset-0 hover:bg-[#263548] transition-colors focus-visible:bg-[#263548]",
          variant === "colored" && "bg-[#0099FF] border-none text-white placeholder:text-white/80 focus-visible:ring-0 focus-visible:ring-offset-0 hover:bg-[#0088EE] transition-colors",
          className
        )}
        ref={ref}
        {...props}
      />
    )
  }
)
Input.displayName = "Input"

export { Input }
