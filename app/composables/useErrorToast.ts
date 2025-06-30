import { useToast } from '#imports'

interface ErrorToastOptions {
  title?: string
  description?: string
  color?: 'error' | 'warning' | 'info' | 'success'
  timeout?: number
}

export function useErrorToast() {
  const toast = useToast()
  return (options: string | Error | ErrorToastOptions) => {
    if (typeof options === 'string') {
      toast.add({
        title: options,
        color: 'error',
      })
    }
    else if (options instanceof Error) {
      toast.add({
        title: options.message,
        color: 'error',
      })
    }
    else {
      toast.add({
        title: options.title || 'Ошибка',
        description: options.description,
        color: options.color || 'error',
        timeout: options.timeout,
      })
    }
  }
}
