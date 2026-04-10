const API_BASE = '/api';

class ApiError extends Error {
  constructor(
    public status: number,
    message: string,
    public code?: string,
  ) {
    super(message);
    this.name = 'ApiError';
  }
}

function getToken(): string | null {
  return localStorage.getItem('mealprep_token');
}

async function request<T>(
  endpoint: string,
  options: RequestInit = {},
): Promise<T> {
  const token = getToken();

  const headers: Record<string, string> = {
    'Content-Type': 'application/json',
    ...((options.headers as Record<string, string>) || {}),
  };

  if (token) {
    headers['Authorization'] = `Bearer ${token}`;
  }

  const response = await fetch(`${API_BASE}${endpoint}`, {
    ...options,
    headers,
  });

  if (!response.ok) {
    const body = await response.json().catch(() => ({ error: { message: 'Request failed' } }));
    throw new ApiError(
      response.status,
      body.error?.message || 'An error occurred',
      body.error?.code,
    );
  }

  // Handle 204 No Content
  if (response.status === 204) {
    return undefined as T;
  }

  const contentType = response.headers.get('content-type');
  if (contentType?.includes('text/plain')) {
    return (await response.text()) as T;
  }

  return response.json();
}

// Auth
export const authApi = {
  register: (data: { email: string; password: string; name: string }) =>
    request('/auth/register', { method: 'POST', body: JSON.stringify(data) }),

  login: (data: { email: string; password: string }) =>
    request('/auth/login', { method: 'POST', body: JSON.stringify(data) }),

  me: () => request('/auth/me'),
};

// Recipes
export const recipesApi = {
  list: (params?: Record<string, string>) => {
    const query = params ? '?' + new URLSearchParams(params).toString() : '';
    return request(`/recipes${query}`);
  },

  get: (id: string) => request(`/recipes/${id}`),

  create: (data: unknown) =>
    request('/recipes', { method: 'POST', body: JSON.stringify(data) }),

  update: (id: string, data: unknown) =>
    request(`/recipes/${id}`, { method: 'PUT', body: JSON.stringify(data) }),

  delete: (id: string) =>
    request(`/recipes/${id}`, { method: 'DELETE' }),
};

// Meal Plans
export const mealPlansApi = {
  getCurrent: () => request('/meal-plans/current'),

  getByWeek: (weekStart: string) => request(`/meal-plans/week/${weekStart}`),

  create: (data: unknown) =>
    request('/meal-plans', { method: 'POST', body: JSON.stringify(data) }),

  update: (id: string, data: unknown) =>
    request(`/meal-plans/${id}`, { method: 'PUT', body: JSON.stringify(data) }),

  autoGenerate: (id: string, preferences?: unknown) =>
    request(`/meal-plans/${id}/auto-generate`, {
      method: 'POST',
      body: JSON.stringify(preferences ? { preferences } : {}),
    }),
};

// Shopping Lists
export const shoppingListsApi = {
  generate: (mealPlanId: string) =>
    request('/shopping-lists/generate', {
      method: 'POST',
      body: JSON.stringify({ mealPlanId }),
    }),

  get: (mealPlanId: string) => request(`/shopping-lists/${mealPlanId}`),

  toggleItem: (listId: string, itemId: string, isChecked: boolean) =>
    request(`/shopping-lists/${listId}/items/${itemId}`, {
      method: 'PATCH',
      body: JSON.stringify({ isChecked }),
    }),

  export: (mealPlanId: string) =>
    request<string>(`/shopping-lists/${mealPlanId}/export`),
};

// Dashboard
export const dashboardApi = {
  getStats: () => request('/dashboard/stats'),
};

export { ApiError };
