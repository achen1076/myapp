import axios, { AxiosError, AxiosInstance } from "axios";
import { ApiUser } from './types/user';

const ACCESS_TOKEN = "access_token";
const REFRESH_TOKEN = "refresh_token";

interface TokenResponse {
  access: string;
  refresh: string;
}

interface LoginResponse {
  token: TokenResponse;
  user: ApiUser;
}

interface RegisterResponse extends LoginResponse {}

interface LoginData {
  username: string;
  password: string;
}

interface RegisterData {
  name: string;
  username: string;
  email: string;
  password: string;
}

// Use environment variable for API URL, fallback to localhost
const API_BASE = `http://localhost:8000/api`;

const api = axios.create({
  baseURL: API_BASE,
}) as AxiosInstance & {
  login: (data: LoginData) => Promise<LoginResponse>;
  register: (data: RegisterData) => Promise<RegisterResponse>;
  logout: () => Promise<void>;
};

api.interceptors.request.use(
  async (config) => {
    const token = localStorage.getItem(ACCESS_TOKEN);
    if (token && config.headers) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

api.login = async (data: LoginData): Promise<LoginResponse> => {
  try {
    const response = await api.post<{ access: string; refresh: string; user: ApiUser }>("/users/login/", data);
    const { access, refresh, user } = response.data;

    if (access && refresh) {
      localStorage.setItem(ACCESS_TOKEN, access);
      localStorage.setItem(REFRESH_TOKEN, refresh);
    }

    return {
      token: { access, refresh },
      user,
    };
  } catch (error) {
    if (error instanceof AxiosError) {
      throw new Error(error.response?.data?.detail || "Login failed");
    }
    throw error;
  }
};

api.register = async (data: RegisterData): Promise<RegisterResponse> => {
  try {
    const response = await api.post<{ access: string; refresh: string; user: ApiUser }>("/users/register/", data);
    const { access, refresh, user } = response.data;

    if (access && refresh) {
      localStorage.setItem(ACCESS_TOKEN, access);
      localStorage.setItem(REFRESH_TOKEN, refresh);
    }

    return {
      token: { access, refresh },
      user,
    };
  } catch (error) {
    if (error instanceof AxiosError) {
      throw new Error(error.response?.data?.detail || "Registration failed");
    }
    throw error;
  }
};

api.logout = async (): Promise<void> => {
  try {
    // Blacklist token if needed
    const token = localStorage.getItem(ACCESS_TOKEN);
    if (token) {
      await api.post("/users/logout/", null, {
        headers: { Authorization: `Bearer ${token}` },
      });
    }
  } catch (error) {
    console.error("Error during logout:", error);
  } finally {
    localStorage.removeItem(ACCESS_TOKEN);
    localStorage.removeItem(REFRESH_TOKEN);
  }
};

// Export the API instance with its methods
export const { login, register, logout } = api;

export default api;
