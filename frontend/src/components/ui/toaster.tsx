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
    // Durasi Toast 4detik
    <ToastProvider duration={2000}>
      {toasts.map(function ({ id, title, description, action, ...props }, index) {
        // Pass `index` as a prop to control overlapping behavior
        return (
          <Toast
            key={id}
            {...props}
            style={{
              zIndex: 100 + index, // Higher z-index for newer toasts
              transform: `translateY(-${index * 10}px)`, // Slight upward shift for overlapping
            }}
          >
            <div className="grid gap-1">
              {title && <ToastTitle>{title}</ToastTitle>}
              {description && (
                <ToastDescription>{description}</ToastDescription>
              )}
            </div>
            {action}
            <ToastClose />
          </Toast>
        )
      })}
      <ToastViewport />
    </ToastProvider>
  )
}
