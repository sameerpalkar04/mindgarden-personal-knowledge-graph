import api from "./api";

interface LoginData {
  email: string;
  password: string;
}

interface RegisterData {
  username: string;
  email: string;
  password: string;
}

export function login(data: LoginData) {
  return api.post("/auth/login", data);
}

export function register(data: RegisterData) {
  return api.post("/auth/register", data);
}