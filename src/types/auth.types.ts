export interface CheckUserResponse {
  id: string;
  name: string;
  password_exists: boolean;
}

export interface LoginResponse {
  token: string;
  user_id: string;
  username: string;
}
