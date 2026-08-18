export interface LoginInput {
  email: string;
  password: string;
}
export interface SignUpInput {
  firstName: string;
  lastName: string;
  email: string;
  password: string;
  phonenumber: string;
  confirmPassword: string;
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
  roleTitle?: string;
  lastLogin?: string | Date;
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

export interface ForgetPasswordInput {
  email: string;
}

export interface ResetPasswordInput {
  password: string;
  token?: string;
}

export interface VerifyAccountInput {
  token: string;
}

export interface ChangePasswordInput {
  password: string;
}
