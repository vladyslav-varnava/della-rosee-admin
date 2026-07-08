import axios, {
  AxiosError,
  AxiosInstance,
  AxiosRequestConfig,
  InternalAxiosRequestConfig,
} from 'axios';

const API_URL = process.env.NEXT_PUBLIC_API_URL;

if (!API_URL) {
  throw new Error('NEXT_PUBLIC_API_URL is not defined');
}

type ApiErrorData = {
  message?: string | string[];
  error?: string;
  statusCode?: number;
};

export class ApiError extends Error {
  status?: number;
  data?: unknown;

  constructor(message: string, status?: number, data?: unknown) {
    super(message);
    this.name = 'ApiError';
    this.status = status;
    this.data = data;
  }
}

const isBrowser = typeof window !== 'undefined';

const getErrorMessage = (error: AxiosError<ApiErrorData>) => {
  const data = error.response?.data;

  if (Array.isArray(data?.message)) {
    return data.message.join(', ');
  }

  if (typeof data?.message === 'string') {
    return data.message;
  }

  if (typeof data?.error === 'string') {
    return data.error;
  }

  if (error.message) {
    return error.message;
  }

  return 'Something went wrong';
};

const createApiClient = (): AxiosInstance => {
  const instance = axios.create({
    baseURL: API_URL,
    timeout: 30000,
    withCredentials: true,
    headers: {
      Accept: 'application/json',
    },
  });

  instance.interceptors.request.use((config: InternalAxiosRequestConfig) => {
    const isFormData =
      typeof FormData !== 'undefined' && config.data instanceof FormData;

    if (!isFormData) {
      config.headers.set('Content-Type', 'application/json');
    }

    return config;
  });

  instance.interceptors.response.use(
    (response) => response,
    (error: AxiosError<ApiErrorData>) => {
      const status = error.response?.status;
      const message = getErrorMessage(error);

      if (status === 401 && isBrowser) {
        const isAuthPage =
          window.location.pathname === '/login' ||
          window.location.pathname === '/sign-in';

        if (!isAuthPage) {
          window.location.href = '/login';
        }
      }

      return Promise.reject(
        new ApiError(message, status, error.response?.data ?? error),
      );
    },
  );

  return instance;
};

export const api = createApiClient();

export const apiClient = {
  get: async <TResponse>(
    url: string,
    config?: AxiosRequestConfig,
  ): Promise<TResponse> => {
    const response = await api.get<TResponse>(url, config);
    return response.data;
  },

  post: async <TResponse, TBody = unknown>(
    url: string,
    body?: TBody,
    config?: AxiosRequestConfig,
  ): Promise<TResponse> => {
    const response = await api.post<TResponse>(url, body, config);
    return response.data;
  },

  put: async <TResponse, TBody = unknown>(
    url: string,
    body?: TBody,
    config?: AxiosRequestConfig,
  ): Promise<TResponse> => {
    const response = await api.put<TResponse>(url, body, config);
    return response.data;
  },

  patch: async <TResponse, TBody = unknown>(
    url: string,
    body?: TBody,
    config?: AxiosRequestConfig,
  ): Promise<TResponse> => {
    const response = await api.patch<TResponse>(url, body, config);
    return response.data;
  },

  delete: async <TResponse>(
    url: string,
    config?: AxiosRequestConfig,
  ): Promise<TResponse> => {
    const response = await api.delete<TResponse>(url, config);
    return response.data;
  },

  upload: async <TResponse>(
    url: string,
    formData: FormData,
    config?: AxiosRequestConfig,
  ): Promise<TResponse> => {
    const response = await api.post<TResponse>(url, formData, {
      ...config,
      headers: {
        ...config?.headers,
      },
    });

    return response.data;
  },
};
