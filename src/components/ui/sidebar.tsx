import * as React from "react"
import { Slot } from "@radix-ui/react-slot"
import { VariantProps, cva } from "class-variance-authority"
import { PanelLeft } from "lucide-react"

import { useMobile } from "@/hooks/use-mobile"
import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"

const sidebarVariants = cva(
  "fixed inset-y-0 z-50 flex flex-col gap-2 bg-midasbuy-navy border-r border-midasbuy-blue/10 px-4 py-3 transition-transform duration-300",
  {
    variants: {
      side: {
        left: "left-0",
        right: "right-0",
      },
      variant: {
        push: "data-[state=open]:translate-x-0",
        slide: "data-[state=open]:translate-x-0",
      },
    },
    compoundVariants: [
      {
        side: "left",
        variant: "push",
        className: "-translate-x-full",
      },
      {
        side: "right",
        variant: "push",
        className: "translate-x-full",
      },
      {
        side: "left",
        variant: "slide",
        className: "-translate-x-full",
      },
      {
        side: "right",
        variant: "slide",
        className: "translate-x-full",
      },
    ],
    defaultVariants: {
      side: "left",
      variant: "push",
    },
  }
)

export interface SidebarProps
  extends React.HTMLAttributes<HTMLDivElement>,
    VariantProps<typeof sidebarVariants> {}

export const Sidebar = React.forwardRef<HTMLDivElement, SidebarProps>(
  ({ className, side, variant, ...props }, ref) => {
    return (
      <div
        ref={ref}
        className={cn(sidebarVariants({ side, variant, className }))}
        {...props}
      />
    )
  }
)
Sidebar.displayName = "Sidebar"

export const SidebarHeader = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement>
>(({ className, ...props }, ref) => {
  return (
    <div
      ref={ref}
      className={cn(
        "flex items-center justify-between py-2",
        className
      )}
      {...props}
    />
  )
})
SidebarHeader.displayName = "SidebarHeader"

export const SidebarTitle = React.forwardRef<
  HTMLParagraphElement,
  React.HTMLAttributes<HTMLParagraphElement>
>(({ className, ...props }, ref) => {
  return (
    <p
      ref={ref}
      className={cn(
        "text-sm font-semibold leading-none text-white",
        className
      )}
      {...props}
    />
  )
})
SidebarTitle.displayName = "SidebarTitle"

export const SidebarDescription = React.forwardRef<
  HTMLParagraphElement,
  React.HTMLAttributes<HTMLParagraphElement>
>(({ className, ...props }, ref) => {
  return (
    <p
      ref={ref}
      className={cn("text-sm text-muted-foreground", className)}
      {...props}
    />
  )
})
SidebarDescription.displayName = "SidebarDescription"

export const SidebarContent = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement>
>(({ className, ...props }, ref) => {
  return (
    <div
      ref={ref}
      className={cn("flex-1 overflow-y-auto py-2", className)}
      {...props}
    />
  )
})
SidebarContent.displayName = "SidebarContent"

export const SidebarFooter = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement>
>(({ className, ...props }, ref) => {
  return (
    <div
      ref={ref}
      className={cn("mt-auto py-4", className)}
      {...props}
    />
  )
})
SidebarFooter.displayName = "SidebarFooter"

export const SidebarTrigger = React.forwardRef<
  HTMLButtonElement,
  React.HTMLAttributes<HTMLButtonElement>
>(({ className, ...props }, ref) => {
  const isMobile = useMobile()
  return (
    <Button
      ref={ref}
      variant="ghost"
      size="sm"
      className={cn(
        "h-8 w-8 rounded-md p-0 data-[state=open]:bg-muted hover:bg-accent hover:text-muted-foreground",
        className
      )}
      {...props}
    >
      {isMobile ? <PanelLeft className="h-4 w-4" /> : <></>}
      <span className="sr-only">Open side panel</span>
    </Button>
  )
})
SidebarTrigger.displayName = "SidebarTrigger"

export { Slot as SidebarClose }
