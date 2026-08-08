import axios, { AxiosError, AxiosInstance, AxiosRequestConfig } from "axios";

interface ApiErrorResponse {
  success?: boolean;
  message?: string;
  statusCode?: number;
}

class ApiService {
  private readonly api: AxiosInstance;

  constructor() {
    this.api = axios.create({
      baseURL: import.meta.env.VITE_API_URL,
      timeout: 10000,
      headers: {
        "Content-Type": "application/json",
      },
    });

    this.setupInterceptors();
  }

  private setupInterceptors(): void {
    // Request Interceptor
    this.api.interceptors.request.use(
      (config) => {
        const token = localStorage.getItem("access_token");

        if (token) {
          config.headers.Authorization = `Bearer ${token}`;
        }

        return config;
      },
      (error) => {
        return Promise.reject(error);
      },
    );

    // Response Interceptor
    this.api.interceptors.response.use(
      (response) => response,

      (error: AxiosError<ApiErrorResponse>) => {
        if (error.response?.status === 401) {
          localStorage.removeItem("access_token");
          localStorage.removeItem("user");
        }

        return Promise.reject(error);
      },
    );
  }

 
  private handleError(error: unknown): never {
    if (axios.isAxiosError<ApiErrorResponse>(error)) {
      const message =
        error.response?.data?.message ||
        error.message ||
        "Something went wrong. Please try again.";

      throw new Error(message);
    }

    if (error instanceof Error) {
      throw error;
    }

    throw new Error("An unexpected error occurred.");
  }


  async get<T>(url: string, config?: AxiosRequestConfig): Promise<T> {
    try {
      const response = await this.api.get<T>(url, config);

      return response.data;
    } catch (error) {
      this.handleError(error);
    }
  }

  async post<T>(
    url: string,
    data?: unknown,
    config?: AxiosRequestConfig,
  ): Promise<T> {
    try {
      const response = await this.api.post<T>(url, data, config);

      return response.data;
    } catch (error) {
      this.handleError(error);
    }
  }


  async put<T>(
    url: string,
    data?: unknown,
    config?: AxiosRequestConfig,
  ): Promise<T> {
    try {
      const response = await this.api.put<T>(url, data, config);

      return response.data;
    } catch (error) {
      this.handleError(error);
    }
  }


  async delete<T>(url: string, config?: AxiosRequestConfig): Promise<T> {
    try {
      const response = await this.api.delete<T>(url, config);

      return response.data;
    } catch (error) {
      this.handleError(error);
    }
  }
}

export default new ApiService();
