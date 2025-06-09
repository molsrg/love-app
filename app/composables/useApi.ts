type HttpMethod = 'GET' | 'POST' | 'PUT' | 'PATCH' | 'DELETE'

interface ApiOptions {
  showSuccessToast?: boolean
  showErrorToast?: boolean
  headers?: Record<string, string>
  method?: HttpMethod
  body?: any
}

interface ApiResponse<T> {
  data: T
  message?: string
}

export function useApi() {
  const config = useRuntimeConfig()
  const toast = useToast()
  const tokenStore = useTokenStore()

  const defaultOptions: ApiOptions = {
    showSuccessToast: true,
    showErrorToast: true,
    headers: {
      'Content-Type': 'application/json',
    },
  }

  const handleResponse = <T>(response: ApiResponse<T> | T, options: ApiOptions) => {
    // If response is already the data (not wrapped in ApiResponse)
    if (!('data' in response)) {
      return response
    }

    if (options.showSuccessToast && response.message) {
      toast.add({
        color: 'success',
        title: response.message,
      })
    }
    return response.data
  }

  const handleError = (error: any, options: ApiOptions) => {
    if (options.showErrorToast) {
      toast.add({
        color: 'error',
        title: error.data?.message?.[0] || error.data?.message || 'Unknown error',
      })
    }
    throw error
  }

  const getHeaders = (options: ApiOptions): Record<string, string> => {
    const headers = { ...defaultOptions.headers, ...options.headers } as Record<string, string>

    if (tokenStore.getStatus) {
      headers.Authorization = `Bearer ${tokenStore.getToken}`
    }

    return headers
  }

  const fetch = async <T>(url: string, options: ApiOptions = {}) => {
    const mergedOptions = {
      ...defaultOptions,
      ...options,
      headers: getHeaders(options),
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
      headers: {
        ...getHeaders(options),
        'Content-Type': 'multipart/form-data',
      },
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
