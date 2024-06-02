export interface LoginInput {
  email: string;
  password: string;
}
export interface SignUpInput {
  firstName?: string;
  lastName?: string;
  email: string;
  password: string;
  fullname: string;
  phonenumber: string;
  confirmPassword: string,
}

export interface User {
  _id: string;
  firstname: string;
  lastname: string;
  slug: string;
  phoneNumber: string;
  email: string;
  isSuperAdmin: boolean;
  isAdmin: boolean;
  is_verified: boolean;
  createdAt: Date;
  updatedAt: Date;
  token?: string;
}

export interface LoginResponse {
  _id: string;
  email: string;
  token: string;
  is_verified: boolean;
  isSuperAdmin: boolean;
}

export interface EmailInput {
  email: string;
}

export interface ChangePasswordInput {
  password: string;
}
