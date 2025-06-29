import type { FetchOptions } from 'ofetch'

type HttpMethod = 'GET' | 'POST' | 'PUT' | 'PATCH' | 'DELETE'

interface ApiOptions extends Omit<FetchOptions, 'method'> {
  method?: HttpMethod
  showSuccessToast?: boolean
  showErrorToast?: boolean
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
  const nuxtApp = useNuxtApp()

  const defaultOptions: ApiOptions = {
    showSuccessToast: true,
    showErrorToast: true,
    showToastForMethods: ['POST', 'PUT', 'PATCH', 'DELETE'],
  }

  const getHeaders = (options: ApiOptions): Record<string, string> => {
    const headers = { ...options.headers } as Record<string, string>

    if (tokenStore.getStatus)
      headers.Authorization = `Bearer ${tokenStore.getToken}`

    if (nuxtApp.vueApp.config.globalProperties.$i18n)
      headers['X-App-Locale'] = nuxtApp.vueApp.config.globalProperties.$i18n.locale

    return headers
  }

  const _fetch = async <T>(url: string, options: ApiOptions = {}) => {
    const mergedOptions: ApiOptions = {
      ...defaultOptions,
      ...options,
      baseURL: config.public.baseBackendUrl,
      headers: getHeaders(options),
    }

    if (mergedOptions.body instanceof FormData)
      delete (mergedOptions.headers as any)['Content-Type']

    mergedOptions.onResponse = ({ response }) => {
      const method = mergedOptions.method?.toUpperCase()
      if (
        mergedOptions.showSuccessToast &&
        response.ok &&
        response._data?.message &&
        method &&
        mergedOptions.showToastForMethods?.includes(method as HttpMethod)
      ) {
        toast.add({
          color: 'success',
          title: response._data.message,
        })
      }
    }

    mergedOptions.onResponseError = ({ response }) => {
      if (mergedOptions.showErrorToast) {
        const showError = useErrorToast()
        showError({
          color: 'error',
          title: `Error ${response.status}`,
          description: response._data?.message || 'An unknown error occurred.'
        })
      }
    }

    const response = await $fetch<ApiResponse<T> | T>(url, mergedOptions)

    if (response && typeof response === 'object' && 'data' in response)
      return (response as ApiResponse<T>).data

    return response as T
  }

  const get = <T>(url: string, options: ApiOptions = {}) => {
    return _fetch<T>(url, { ...options, method: 'GET' })
  }

  const post = <T>(url: string, body: any, options: ApiOptions = {}) => {
    return _fetch<T>(url, { ...options, method: 'POST', body })
  }

  const put = <T>(url: string, body: any, options: ApiOptions = {}) => {
    return _fetch<T>(url, { ...options, method: 'PUT', body })
  }

  const patch = <T>(url: string, body: any, options: ApiOptions = {}) => {
    return _fetch<T>(url, { ...options, method: 'PATCH', body })
  }

  const del = <T>(url: string, options: ApiOptions = {}) => {
    return _fetch<T>(url, { ...options, method: 'DELETE' })
  }

  const postFormData = <T>(url: string, formData: FormData, options: ApiOptions = {}) => {
    return _fetch<T>(url, {
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
