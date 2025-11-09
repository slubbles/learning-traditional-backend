import * as React from "react"
import { Slot } from "@radix-ui/react-slot"
import { cva, type VariantProps } from "class-variance-authority"

import { cn } from "@/lib/utils"

const badgeVariants = cva(
  "inline-flex items-center justify-center rounded-full border px-2.5 py-1 text-xs font-medium w-fit whitespace-nowrap shrink-0 [&>svg]:size-3 gap-1.5 [&>svg]:pointer-events-none focus-visible:border-ring focus-visible:ring-ring/50 focus-visible:ring-[3px] aria-invalid:ring-destructive/20 dark:aria-invalid:ring-destructive/40 aria-invalid:border-destructive transition-all duration-200 overflow-hidden before:content-[''] before:w-1.5 before:h-1.5 before:rounded-full before:bg-current before:shrink-0",
  {
    variants: {
      variant: {
        default:
          "border-blue-200 bg-blue-50 text-blue-700 [a&]:hover:bg-blue-100 dark:border-blue-500/20 dark:bg-blue-500/10 dark:text-blue-400",
        secondary:
          "border-gray-200 bg-gray-50 text-gray-700 [a&]:hover:bg-gray-100 dark:border-gray-500/20 dark:bg-gray-500/10 dark:text-gray-400",
        destructive:
          "border-red-200 bg-red-50 text-red-700 [a&]:hover:bg-red-100 dark:border-red-500/20 dark:bg-red-500/10 dark:text-red-400",
        outline:
          "text-foreground border-border [a&]:hover:bg-accent [a&]:hover:text-accent-foreground",
        success:
          "border-emerald-200 bg-emerald-50 text-emerald-700 [a&]:hover:bg-emerald-100 dark:border-emerald-500/20 dark:bg-emerald-500/10 dark:text-emerald-400",
        warning:
          "border-amber-200 bg-amber-50 text-amber-700 [a&]:hover:bg-amber-100 dark:border-amber-500/20 dark:bg-amber-500/10 dark:text-amber-400",
        purple:
          "border-purple-200 bg-purple-50 text-purple-700 [a&]:hover:bg-purple-100 dark:border-purple-500/20 dark:bg-purple-500/10 dark:text-purple-400",
        indigo:
          "border-indigo-200 bg-indigo-50 text-indigo-700 [a&]:hover:bg-indigo-100 dark:border-indigo-500/20 dark:bg-indigo-500/10 dark:text-indigo-400",
      },
    },
    defaultVariants: {
      variant: "default",
    },
  }
)

function Badge({
  className,
  variant,
  asChild = false,
  ...props
}: React.ComponentProps<"span"> &
  VariantProps<typeof badgeVariants> & { asChild?: boolean }) {
  const Comp = asChild ? Slot : "span"

  return (
    <Comp
      data-slot="badge"
      className={cn(badgeVariants({ variant }), className)}
      {...props}
    />
  )
}

export { Badge, badgeVariants }
