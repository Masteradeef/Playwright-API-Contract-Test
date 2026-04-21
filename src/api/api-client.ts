import { APIRequestContext } from "@playwright/test";

export interface ApiResponse<T = unknown> {
  status: number;
  headers: Record<string, string>;
  body: T;
  responseTime: number;
}

export class ApiClient {
  constructor(private request: APIRequestContext) {}

  async get<T = unknown>(
    endpoint: string,
    options?: { params?: Record<string, string>; headers?: Record<string, string> }
  ): Promise<ApiResponse<T>> {
    const start = Date.now();
    const response = await this.request.get(endpoint, {
      params: options?.params,
      headers: options?.headers,
    });
    const responseTime = Date.now() - start;

    return {
      status: response.status(),
      headers: response.headers(),
      body: (await response.json()) as T,
      responseTime,
    };
  }

  async post<T = unknown>(
    endpoint: string,
    data: unknown,
    options?: { headers?: Record<string, string> }
  ): Promise<ApiResponse<T>> {
    const start = Date.now();
    const response = await this.request.post(endpoint, {
      data,
      headers: options?.headers,
    });
    const responseTime = Date.now() - start;

    return {
      status: response.status(),
      headers: response.headers(),
      body: (await response.json()) as T,
      responseTime,
    };
  }

  async postForm<T = unknown>(
    endpoint: string,
    form: Record<string, string | boolean>,
    options?: { headers?: Record<string, string> }
  ): Promise<ApiResponse<T>> {
    const start = Date.now();
    const response = await this.request.post(endpoint, {
      form,
      headers: options?.headers,
    });
    const responseTime = Date.now() - start;

    return {
      status: response.status(),
      headers: response.headers(),
      body: (await response.json()) as T,
      responseTime,
    };
  }

  async put<T = unknown>(
    endpoint: string,
    data: unknown,
    options?: { headers?: Record<string, string> }
  ): Promise<ApiResponse<T>> {
    const start = Date.now();
    const response = await this.request.put(endpoint, {
      data,
      headers: options?.headers,
    });
    const responseTime = Date.now() - start;

    return {
      status: response.status(),
      headers: response.headers(),
      body: (await response.json()) as T,
      responseTime,
    };
  }

  async putForm<T = unknown>(
    endpoint: string,
    form: Record<string, string | boolean>,
    options?: { headers?: Record<string, string> }
  ): Promise<ApiResponse<T>> {
    const start = Date.now();
    const response = await this.request.put(endpoint, {
      form,
      headers: options?.headers,
    });
    const responseTime = Date.now() - start;

    return {
      status: response.status(),
      headers: response.headers(),
      body: (await response.json()) as T,
      responseTime,
    };
  }

  async patch<T = unknown>(
    endpoint: string,
    data: unknown,
    options?: { headers?: Record<string, string> }
  ): Promise<ApiResponse<T>> {
    const start = Date.now();
    const response = await this.request.patch(endpoint, {
      data,
      headers: options?.headers,
    });
    const responseTime = Date.now() - start;

    return {
      status: response.status(),
      headers: response.headers(),
      body: (await response.json()) as T,
      responseTime,
    };
  }

  async patchForm<T = unknown>(
    endpoint: string,
    form: Record<string, string | boolean>,
    options?: { headers?: Record<string, string> }
  ): Promise<ApiResponse<T>> {
    const start = Date.now();
    const response = await this.request.patch(endpoint, {
      form,
      headers: options?.headers,
    });
    const responseTime = Date.now() - start;

    return {
      status: response.status(),
      headers: response.headers(),
      body: (await response.json()) as T,
      responseTime,
    };
  }

  async delete<T = unknown>(
    endpoint: string,
    options?: { headers?: Record<string, string> }
  ): Promise<ApiResponse<T>> {
    const start = Date.now();
    const response = await this.request.delete(endpoint, {
      headers: options?.headers,
    });
    const responseTime = Date.now() - start;

    return {
      status: response.status(),
      headers: response.headers(),
      body: (await response.json()) as T,
      responseTime,
    };
  }
}
