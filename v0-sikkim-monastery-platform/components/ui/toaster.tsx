'use client'

import { useToast } from '@/hooks/use-toast'
import { Toast } from '@/components/ui/toast'
import { X } from 'lucide-react'

export function Toaster() {
  const { toasts } = useToast()

  return (
    <div className="fixed top-0 z-[100] flex max-h-screen w-full flex-col-reverse p-4 sm:bottom-0 sm:right-0 sm:top-auto sm:flex-col md:max-w-[420px]">
      {toasts.map(function ({ id, title, description, action, variant, onOpenChange, ...props }) {
        return (
          <div key={id} className="mb-4">
            <Toast
              variant={variant}
              title={title}
              description={description}
              action={action}
              onOpenChange={onOpenChange}
              {...props}
            />
          </div>
        )
      })}
    </div>
  )
}
