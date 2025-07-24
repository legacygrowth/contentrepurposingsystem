// src/utils/genericapi.ts
import axios, { AxiosRequestConfig, AxiosError } from "axios";

// Optional: Add baseURL and token handling
const apiClient = axios.create({
  baseURL: import.meta.env.VITE_API_BASE_URL || "http://localhost:5000", // Fallback URL
  headers: {
    "Content-Type": "application/json",
  },
  timeout: 10000, // 10 second timeout
});

// Add request interceptor for debugging
apiClient.interceptors.request.use(
  (config) => {
    console.log(
      `Making ${config.method?.toUpperCase()} request to:`,
      config.url,
    );
    console.log("Request data:", config.data);
    return config;
  },
  (error) => {
    console.error("Request interceptor error:", error);
    return Promise.reject(error);
  },
);

// Add response interceptor for debugging
apiClient.interceptors.response.use(
  (response) => {
    console.log("Response received:", response.status, response.data);
    return response;
  },
  (error: AxiosError) => {
    console.error("API Error:", {
      status: error.response?.status,
      statusText: error.response?.statusText,
      data: error.response?.data,
      url: error.config?.url,
      method: error.config?.method,
    });
    return Promise.reject(error);
  },
);

// Add auth token if needed
export function setAuthToken(token: string | null) {
  if (token) {
    apiClient.defaults.headers.common["Authorization"] = `Bearer ${token}`;
  } else {
    delete apiClient.defaults.headers.common["Authorization"];
  }
}

// Generic GET
export async function getRequest<T>(
  url: string,
  config?: AxiosRequestConfig,
): Promise<T> {
  try {
    const response = await apiClient.get<T>(url, config);
    return response.data;
  } catch (error) {
    console.error(`GET ${url} failed:`, error);
    throw error;
  }
}

// Generic POST with enhanced error handling
export async function postRequest<TRequest, TResponse>(
  url: string,
  data: TRequest,
  config?: AxiosRequestConfig,
): Promise<TResponse> {
  try {
    const response = await apiClient.post<TResponse>(url, data, config);
    return response.data;
  } catch (error) {
    console.error(`POST ${url} failed:`, error);

    if (axios.isAxiosError(error)) {
      // Handle specific error cases
      if (error.response?.status === 404) {
        throw new Error(`Endpoint not found: ${url}`);
      } else if (error.response?.status === 401) {
        throw new Error("Unauthorized - Invalid or expired token");
      } else if (error.response?.status === 400) {
        throw new Error(
          `Bad request: ${error.response.data?.message || "Invalid data"}`,
        );
      }
    }

    throw error;
  }
}

// Generic PUT
export async function putRequest<TRequest, TResponse>(
  url: string,
  data: TRequest,
  config?: AxiosRequestConfig,
): Promise<TResponse> {
  try {
    const response = await apiClient.put<TResponse>(url, data, config);
    return response.data;
  } catch (error) {
    console.error(`PUT ${url} failed:`, error);
    throw error;
  }
}

// Generic DELETE
export async function deleteRequest<TResponse>(
  url: string,
  config?: AxiosRequestConfig,
): Promise<TResponse> {
  try {
    const response = await apiClient.delete<TResponse>(url, config);
    return response.data;
  } catch (error) {
    console.error(`DELETE ${url} failed:`, error);
    throw error;
  }
}
