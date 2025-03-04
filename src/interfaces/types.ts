import { User } from "./auth.interface";

export interface ErrorResponse {
  message: string;
  [key: string]: any;
}

export interface ApiResponse<T> {
  success: boolean;
  data: T;
  message: string;
}

interface LoginData {
  user: User;
}

export type LoginApiResponse = ApiResponse<LoginData>;
