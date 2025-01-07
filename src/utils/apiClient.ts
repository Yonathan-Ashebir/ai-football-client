import axios, { AxiosError, AxiosInstance } from 'axios';

interface RetryConfig {
  retries: number;
  retryDelay: number;
}

export function createApiClient(
  baseURL: string,
  headers: Record<string, string>,
  retryConfig: RetryConfig = { retries: 3, retryDelay: 1000 }
): AxiosInstance {
  const client = axios.create({
    baseURL,
    headers,
    timeout: 10000, // 10 second timeout
  });

  client.interceptors.response.use(
    response => response,
    async (error: AxiosError) => {
      const config = error.config;
      if (!config) return Promise.reject(error);

      // Add retry count to config
      config.retryCount = config.retryCount ?? 0;

      if (config.retryCount >= retryConfig.retries) {
        return Promise.reject(error);
      }

      // Increment retry count
      config.retryCount += 1;

      // Wait before retrying
      await new Promise(resolve => setTimeout(resolve, retryConfig.retryDelay));

      return client(config);
    }
  );

  return client;
}