const API_URL = 'http://localhost:8000';

export const getAccessToken = (): string | null => {
  return localStorage.getItem('access');
};

export const getRefreshToken = (): string | null => {
  return localStorage.getItem('refresh');
};

export const refreshAccessToken = async (): Promise<string | null> => {
  const refresh = getRefreshToken();

  if (!refresh) {
    return null;
  }

  const response = await fetch(`${API_URL}/token/refresh/`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ refresh }),
  });

  if (response.ok) {
    const data = await response.json();
    localStorage.setItem('access', data.access);
    return data.access;
  } else {
    localStorage.removeItem('access');
    localStorage.removeItem('refresh');
    return null;
  }
};

interface FetchOptions extends RequestInit {
  headers?: Record<string, string>;
}

export const apiFetch = async (url: string, options: FetchOptions = {}): Promise<Response> => {
  let access = getAccessToken();

  if (access) {
    if (!options.headers) {
      options.headers = {};
    }
    options.headers['Authorization'] = `Bearer ${access}`;
  }

  let response = await fetch(url, options);

  if (response.status === 401) {
    access = await refreshAccessToken();

    if (access) {
      options.headers!['Authorization'] = `Bearer ${access}`;
      response = await fetch(url, options);
    }
  }

  return response;
};
