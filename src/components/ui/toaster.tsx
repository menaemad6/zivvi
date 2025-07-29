import { useToast } from "@/hooks/use-toast"
import {
  Toast,
  ToastClose,
  ToastDescription,
  ToastProvider,
  ToastTitle,
  ToastViewport,
} from "@/components/ui/toast"

export function Toaster() {
  const { toasts } = useToast()

  return (
    <ToastProvider>
      {toasts.map(function ({ id, title, description, action, ...props }) {
        return (
          <Toast key={id} {...props}>
            <div className="grid gap-1 pointer-events-auto z-[101]">
              {title && <ToastTitle>{title}</ToastTitle>}
              {description && (
                <ToastDescription>{description}</ToastDescription>
              )}
            </div>
            {action}
            <ToastClose className="z-[101]" />
          </Toast>
        )
      })}
      <ToastViewport className="fixed z-[100] flex flex-col-reverse w-full max-h-screen p-4 bottom-0 left-0 right-0 sm:top-auto sm:right-0 sm:left-auto sm:flex-col sm:w-auto sm:max-w-[420px] pointer-events-none" />
    </ToastProvider>
  )
}
