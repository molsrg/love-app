type HttpMethod = 'GET' | 'POST' | 'PUT' | 'PATCH' | 'DELETE'

interface ApiOptions {
  showSuccessToast?: boolean
  showErrorToast?: boolean
  headers?: Record<string, string>
  method?: HttpMethod
  body?: any
  query?: Record<string, any>
  showToastForMethods?: HttpMethod[]
}

interface ApiResponse<T> {
  data: T
  message?: string
}

export function useApi() {
  const config = useRuntimeConfig()
  const toast = useToast()
  const tokenStore = useTokenStore()
  const { locale } = useI18n()

  const defaultOptions: ApiOptions = {
    showSuccessToast: true,
    showErrorToast: true,
    headers: {
      'Content-Type': 'application/json',
    },
    showToastForMethods: ['POST', 'PUT', 'PATCH'],
  }

  const handleResponse = <T>(response: ApiResponse<T> | T, options: ApiOptions) => {
    // If response is null or undefined, return it directly
    if (response === null || typeof response === 'undefined') {
      return response as T
    }

    // Check if it's an ApiResponse (object with 'data' property)
    if (typeof response === 'object' && 'data' in response) {
      // It's ApiResponse<T>
      if (options.showSuccessToast && (response as ApiResponse<T>).message && options.method && options.showToastForMethods?.includes(options.method)) {
        toast.add({
          color: 'success',
          title: (response as ApiResponse<T>).message,
        })
      }
      return (response as ApiResponse<T>).data
    }

    // Otherwise, it's already the raw data T (e.g., for DELETE that returns true)
    return response as T
  }

  const handleError = (error: any, options: ApiOptions) => {
    if (options.showErrorToast && options.method && options.showToastForMethods?.includes(options.method)) {
      toast.add({
        color: 'error',
        title: error.data?.message?.[0] || error.data?.message || 'Unknown error',
      })
    }
    throw error
  }

  const getHeaders = (options: ApiOptions): Record<string, string> => {
    const headers = { ...defaultOptions.headers, ...options.headers } as Record<string, string>

    // Remove Content-Type for FormData requests
    if (options.body instanceof FormData) {
      delete headers['Content-Type']
    }

    if (tokenStore.getStatus) {
      headers.Authorization = `Bearer ${tokenStore.getToken}`
    }

    // Add current locale to headers
    headers['Accept-Language'] = locale.value

    return headers
  }

  const fetch = async <T>(url: string, options: ApiOptions = {}) => {
    const mergedOptions = {
      ...defaultOptions,
      ...options,
      headers: getHeaders(options),
    }

    // Remove Content-Type for FormData requests
    if (options.body instanceof FormData) {
      delete mergedOptions.headers['Content-Type']
    }

    try {
      const response = await $fetch<ApiResponse<T>>(`${config.public.baseBackendUrl}${url}`, mergedOptions)
      return handleResponse(response, mergedOptions)
    }
    catch (error: any) {
      return handleError(error, mergedOptions)
    }
  }

  const get = <T>(url: string, options: ApiOptions = {}) => {
    return fetch<T>(url, { ...options, method: 'GET' })
  }

  const post = <T>(url: string, body: any, options: ApiOptions = {}) => {
    return fetch<T>(url, { ...options, method: 'POST', body })
  }

  const put = <T>(url: string, body: any, options: ApiOptions = {}) => {
    return fetch<T>(url, { ...options, method: 'PUT', body })
  }

  const patch = <T>(url: string, body: any, options: ApiOptions = {}) => {
    return fetch<T>(url, { ...options, method: 'PATCH', body })
  }

  const del = <T>(url: string, options: ApiOptions = {}) => {
    return fetch<T>(url, { ...options, method: 'DELETE' })
  }

  const postFormData = <T>(url: string, formData: FormData, options: ApiOptions = {}) => {
    return fetch<T>(url, {
      ...options,
      method: 'POST',
      body: formData,
    })
  }

  return {
    get,
    post,
    put,
    patch,
    delete: del,
    postFormData,
  }
}
