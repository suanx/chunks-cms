export const useApi = () => {
  const config = useRuntimeConfig();

  const request = async <T = any>(url: string, options: any = {}): Promise<T> => {
    const headers: Record<string, string> = { ...options.headers };
    if (process.client) {
      const token = localStorage.getItem('token');
      if (token) headers.Authorization = `Bearer ${token}`;
    }
    try {
      const response = await $fetch<{ data?: T; code?: number; message?: string } | T>(
        url,
        {
          baseURL: config.public.apiBase,
          ...options,
          headers,
        },
      );
      // 处理后端统一包装 { code, data, message }
      if (response && typeof response === 'object' && 'data' in response && 'code' in response) {
        return (response as any).data as T;
      }
      return response as T;
    } catch (error: any) {
      if (error?.status === 401 && process.client) {
        localStorage.removeItem('token');
        localStorage.removeItem('refreshToken');
        navigateTo('/');
      }
      throw error;
    }
  };

  const api = {
    get: <T = any>(url: string, params?: any) =>
      request<T>(url, { method: 'GET', params }),
    post: <T = any>(url: string, body?: any) =>
      request<T>(url, { method: 'POST', body }),
    patch: <T = any>(url: string, body?: any) =>
      request<T>(url, { method: 'PATCH', body }),
    put: <T = any>(url: string, body?: any) =>
      request<T>(url, { method: 'PUT', body }),
    delete: <T = any>(url: string, params?: any) =>
      request<T>(url, { method: 'DELETE', params }),
  };

  return { api };
};
