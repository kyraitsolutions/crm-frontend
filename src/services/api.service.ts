import axios, {
  type AxiosInstance,
  type AxiosRequestConfig,
  type AxiosResponse,
  AxiosError,
  type InternalAxiosRequestConfig,
} from "axios";

import type {
  ApiResponse,
  ApiError,
  RequestConfig,
  HttpMethod,
} from "../types";
import { Log, LocalStorageUtils } from "../utils";

class ApiService {
  private instance: AxiosInstance;

  constructor() {
    const API_URL = import.meta.env.VITE_API_URL + "/api";
    this.instance = axios.create({
      baseURL: API_URL,
      timeout: 10000,
      headers: {
        "Content-Type": "application/json",
      },
    });

    this.setupInterceptors();
  }

  private setupInterceptors(): void {
    this.instance.interceptors.request.use(
      (config: InternalAxiosRequestConfig) => {
        return this.handleRequest(config);
      },
      (error: AxiosError) => {
        return Promise.reject(this.handleError(error));
      }
    );

    this.instance.interceptors.response.use(
      (response: AxiosResponse): any => {
        return this.handleResponse(response);
      },
      (error: AxiosError): Promise<AxiosError> => {
        return Promise.reject(this.handleError(error));
      }
    );
  }

  private handleRequest(
    config: InternalAxiosRequestConfig
  ): InternalAxiosRequestConfig {
    const token = LocalStorageUtils.getItem("token");
    if (token && this.requiresAuth(config)) {
      config.headers.Authorization = `Bearer ${token}`;
    }

    this.logRequest({ method: config.method, url: config.url });
    return config;
  }

  private handleResponse(response: AxiosResponse) {
    return {
      data: response?.data?.result,
      status: response?.data?.responseStatusCode,
      message: response?.data?.responseMessage,
    };
  }

  private handleError(error: AxiosError): ApiError {
    if (error.response) {
      const apiError: ApiError = {
        message: (error.response.data as any)?.message || error.message,
        status: error.response.status,
        code: (error.response.data as any)?.code,
      };

      if (error.response.status === 401) {
        this.handleUnauthorized();
      }

      return apiError;
    } else if (error.request) {
      return {
        message: "No response received from server",
        status: 0,
      };
    } else {
      return {
        message: error.message,
        status: 0,
      };
    }
  }

  private requiresAuth(config: InternalAxiosRequestConfig): boolean {
    return !config.headers?.["X-Skip-Auth"];
  }

  private handleUnauthorized(): void {
    LocalStorageUtils.removeItem("token");
    window.location.href = "/login";
  }

  private logRequest(config: { method?: string; url?: string }) {
    Log.request(config.method as HttpMethod, config.url as string);
  }

  // Generic request method
  async request<T = any>(
    method: HttpMethod,
    url: string,
    data?: any,
    config?: RequestConfig
  ): Promise<ApiResponse<T>> {
    const axiosConfig: AxiosRequestConfig = {
      method,
      url,
      headers: config?.headers,
      params: config?.params,
      timeout: config?.timeout,
    };

    if (method === "GET" || method === "DELETE") {
      axiosConfig.params = data;
    } else {
      axiosConfig.data = data;
    }

    try {
      const response = await this.instance.request(axiosConfig);
      return response as ApiResponse<T>;
    } catch (error) {
      throw error as ApiError;
    }
  }

  // Specific HTTP methods with type safety
  async get<T = any>(
    url: string,
    params?: any,
    config?: RequestConfig
  ): Promise<ApiResponse<T>> {
    return this.request<T>("GET", url, params, config);
  }

  async post<T = any>(
    url: string,
    data?: any,
    config?: RequestConfig
  ): Promise<ApiResponse<T>> {
    return this.request<T>("POST", url, data, config);
  }

  async put<T = any>(
    url: string,
    data?: any,
    config?: RequestConfig
  ): Promise<ApiResponse<T>> {
    return this.request<T>("PUT", url, data, config);
  }

  async patch<T = any>(
    url: string,
    data?: any,
    config?: RequestConfig
  ): Promise<ApiResponse<T>> {
    return this.request<T>("PATCH", url, data, config);
  }

  async delete<T = any>(
    url: string,
    data?: any,
    config?: RequestConfig
  ): Promise<ApiResponse<T>> {
    return this.request<T>("DELETE", url, data, config);
  }

  // File upload method
  async upload<T = any>(
    url: string,
    formData: FormData,
    config?: RequestConfig
  ): Promise<ApiResponse<T>> {
    const uploadConfig: RequestConfig = {
      ...config,
      headers: {
        ...config?.headers,
        "Content-Type": "multipart/form-data",
      },
    };

    return this.post<T>(url, formData, uploadConfig);
  }
}

export { ApiService };
