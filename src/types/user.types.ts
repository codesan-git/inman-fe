export interface User {
  id: string;
  name: string;
  email?: string;
  phone_number?: string;
  avatar_url?: string;
  role: string;
  created_at: string;
}

export interface NewUser {
  name: string;
}

export interface UpdateUser {
  name?: string;
  email?: string;
  phone_number?: string;
  avatar_url?: string;
  role?: string;
  password?: string;
  from_login?: boolean;
}