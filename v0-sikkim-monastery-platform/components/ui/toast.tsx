'use client'

import * as React from 'react'
import { cva, type VariantProps } from 'class-variance-authority'
import { cn } from '@/lib/utils'

const toastVariants = cva(
  "group pointer-events-auto relative flex w-full items-center justify-between space-x-4 overflow-hidden rounded-md border p-6 pr-8 shadow-lg transition-all",
  {
    variants: {
      variant: {
        default: "bg-background text-foreground",
        destructive: "destructive border-destructive bg-destructive text-destructive-foreground",
        success: "border-green-500 bg-green-50 text-green-900 dark:bg-green-900/20 dark:text-green-100",
        warning: "border-yellow-500 bg-yellow-50 text-yellow-900 dark:bg-yellow-900/20 dark:text-yellow-100",
      },
    },
    defaultVariants: {
      variant: "default",
    },
  }
)

export interface ToastProps
  extends React.HTMLAttributes<HTMLDivElement>,
    VariantProps<typeof toastVariants> {
  title?: string
  description?: string
  action?: React.ReactNode
  onOpenChange?: (open: boolean) => void
}

const Toast = React.forwardRef<HTMLDivElement, ToastProps>(
  ({ className, variant, title, description, action, onOpenChange, ...props }, ref) => {
    return (
      <div
        ref={ref}
        className={cn(toastVariants({ variant }), className)}
        {...props}
      >
        <div className="flex-1 space-y-1">
          {title && (
            <div className="text-sm font-semibold">
              {title}
            </div>
          )}
          {description && (
            <div className="text-sm opacity-90">
              {description}
            </div>
          )}
        </div>
        {action}
      </div>
    )
  }
)
Toast.displayName = "Toast"

export { Toast, toastVariants }
