export interface LoginInput {
  email: string;
  password: string;
}
export interface SignUpInput {
  email: string;
  password: string;
  fullname: string;
  phonenumber: string;
}

export interface User {
  _id: string;
  firstname: string;
  lastname: string;
  slug: string;
  phoneNumber: string;
  email: string;
  isSuperAdmin: boolean;
  is_verified: boolean;
  createdAt: Date;
  updatedAt: Date;
}

export interface loginResponse {
  _id: string;
  email: string;
  token: string;
  is_verified: boolean;
  isSuperAdmin: boolean;
}
