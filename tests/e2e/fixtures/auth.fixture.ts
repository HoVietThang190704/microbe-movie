import { test as base, expect, APIRequestContext } from '@playwright/test';

type AuthFixtures = {
  authenticatedRequest: APIRequestContext;
  authToken: string;
  userId: string;
};

type RequestOptions = Parameters<APIRequestContext['get']>[1];

interface LoginResponse {
  access_token?: string;
  token?: string;
}

interface AuthMeResponse {
  id?: string;
  userId?: string;
}

export const test = base.extend<AuthFixtures>({
  authToken: async ({ request }, use) => {
    // Login để lấy token
    const response = await request.post(
      'http://localhost:3000/api/auth/login',
      {
        data: {
          email: 'thang8@gmail.com',
          password: 'Aa123456',
        },
      },
    );

    expect(response.status()).toBe(200);
    const data = (await response.json()) as LoginResponse;
    const token = data.access_token || data.token;

    await use(token!);
  },

  userId: async ({ request, authToken }, use) => {
    // Lấy user info từ token
    const response = await request.get('http://localhost:3000/api/auth/me', {
      headers: {
        Authorization: `Bearer ${authToken}`,
      },
    });

    expect(response.status()).toBe(200);
    const data = (await response.json()) as AuthMeResponse;
    const userId = data.id || data.userId;

    await use(userId!);
  },

  authenticatedRequest: async ({ request, authToken }, use) => {
    // Tạo request context với auth header sẵn
    const authenticatedRequest = {
      ...request,
      async get(url: string, options?: RequestOptions) {
        return request.get(url, {
          ...options,
          headers: {
            Authorization: `Bearer ${authToken}`,
            ...options?.headers,
          },
        });
      },
      async post(url: string, options?: RequestOptions) {
        return request.post(url, {
          ...options,
          headers: {
            Authorization: `Bearer ${authToken}`,
            ...options?.headers,
          },
        });
      },
      async put(url: string, options?: RequestOptions) {
        return request.put(url, {
          ...options,
          headers: {
            Authorization: `Bearer ${authToken}`,
            ...options?.headers,
          },
        });
      },
      async delete(url: string, options?: RequestOptions) {
        return request.delete(url, {
          ...options,
          headers: {
            Authorization: `Bearer ${authToken}`,
            ...options?.headers,
          },
        });
      },
    };

    await use(authenticatedRequest as APIRequestContext);
  },
});

export { expect };
