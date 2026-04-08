import axios, { AxiosError, InternalAxiosRequestConfig } from "axios";

const API_BASE_URL =
  process.env.NEXT_PUBLIC_API_BASE_URL || "http://localhost:8000/api/v1";

if (!API_BASE_URL) {
  throw new Error(
    "NEXT_PUBLIC_API_BASE_URL is missing. Check your frontend/.env.local file."
  );
}

type RefreshResponse = {
  data: {
    access_token: string;
    refresh_token?: string;
  };
};

const ACCESS_TOKEN_KEY = "access_token";
const REFRESH_TOKEN_KEY = "refresh_token";

export const apiClient = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    "Content-Type": "application/json",
  },
});

export function getAccessToken() {
  if (typeof window === "undefined") return null;
  return localStorage.getItem(ACCESS_TOKEN_KEY);
}

export function getRefreshToken() {
  if (typeof window === "undefined") return null;
  return localStorage.getItem(REFRESH_TOKEN_KEY);
}

export function setAuthTokens({
  accessToken,
  refreshToken,
}: {
  accessToken: string;
  refreshToken?: string | null;
}) {
  if (typeof window === "undefined") return;

  localStorage.setItem(ACCESS_TOKEN_KEY, accessToken);
  if (refreshToken) {
    localStorage.setItem(REFRESH_TOKEN_KEY, refreshToken);
  }

  apiClient.defaults.headers.common.Authorization = `Bearer ${accessToken}`;
}

export function clearAuthTokens() {
  if (typeof window !== "undefined") {
    localStorage.removeItem(ACCESS_TOKEN_KEY);
    localStorage.removeItem(REFRESH_TOKEN_KEY);
    localStorage.removeItem("auth_user");
  }

  delete apiClient.defaults.headers.common.Authorization;
}

export function setAuthToken(token?: string | null) {
  if (token) {
    if (typeof window !== "undefined") {
      localStorage.setItem(ACCESS_TOKEN_KEY, token);
    }
    apiClient.defaults.headers.common.Authorization = `Bearer ${token}`;
  } else {
    clearAuthTokens();
  }
}

let isRefreshing = false;
let failedQueue: Array<{
  resolve: (token: string) => void;
  reject: (error: unknown) => void;
}> = [];

function processQueue(error: unknown, token: string | null = null) {
  failedQueue.forEach((promise) => {
    if (error) {
      promise.reject(error);
    } else if (token) {
      promise.resolve(token);
    }
  });

  failedQueue = [];
}

async function refreshAccessToken() {
  const refreshToken = getRefreshToken();

  if (!refreshToken) {
    throw new Error("No refresh token available.");
  }

  const response = await axios.post<RefreshResponse>(
    `${API_BASE_URL}/auth/refresh`,
    {
      refresh_token: refreshToken,
    },
    {
      headers: {
        "Content-Type": "application/json",
      },
    }
  );

  const newAccessToken = response.data.data.access_token;
  const newRefreshToken = response.data.data.refresh_token;

  setAuthTokens({
    accessToken: newAccessToken,
    refreshToken: newRefreshToken ?? refreshToken,
  });

  return newAccessToken;
}

apiClient.interceptors.request.use(
  (config: InternalAxiosRequestConfig) => {
    const token = getAccessToken();
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

apiClient.interceptors.response.use(
  (response) => response,
  async (error: AxiosError) => {
    const originalRequest = error.config as InternalAxiosRequestConfig & {
      _retry?: boolean;
    };

    if (!error.response || error.response.status !== 401 || !originalRequest) {
      return Promise.reject(error);
    }

    // Prevent infinite loop on refresh endpoint itself
    if (originalRequest.url?.includes("/auth/refresh")) {
      clearAuthTokens();
      if (typeof window !== "undefined") {
        window.location.href = "/login";
      }
      return Promise.reject(error);
    }

    if (originalRequest._retry) {
      clearAuthTokens();
      if (typeof window !== "undefined") {
        window.location.href = "/login";
      }
      return Promise.reject(error);
    }

    originalRequest._retry = true;

    if (isRefreshing) {
      return new Promise((resolve, reject) => {
        failedQueue.push({
          resolve: (token: string) => {
            originalRequest.headers.Authorization = `Bearer ${token}`;
            resolve(apiClient(originalRequest));
          },
          reject,
        });
      });
    }

    isRefreshing = true;

    try {
      const newToken = await refreshAccessToken();
      processQueue(null, newToken);

      originalRequest.headers.Authorization = `Bearer ${newToken}`;
      return apiClient(originalRequest);
    } catch (refreshError) {
      processQueue(refreshError, null);
      clearAuthTokens();

      if (typeof window !== "undefined") {
        window.location.href = "/login";
      }

      return Promise.reject(refreshError);
    } finally {
      isRefreshing = false;
    }
  }
);





























// import axios from "axios";

// const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL || "http://localhost:8000/api/v1";
// // const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL //|| "http://localhost:8000/api/v1"

// if (!API_BASE_URL) {
//   throw new Error(
//     "NEXT_PUBLIC_API_BASE_URL is missing. Check your frontend/.env.local file."
//   );
// }

// export const apiClient = axios.create({
//   baseURL: API_BASE_URL,
//   headers: {
//     "Content-Type": "application/json",
//   },
// });

// export function setAuthToken(token?: string | null) {
//   if (token) {
//     apiClient.defaults.headers.common.Authorization = `Bearer ${token}`;
//   } else {
//     delete apiClient.defaults.headers.common.Authorization;
//   }
// }

