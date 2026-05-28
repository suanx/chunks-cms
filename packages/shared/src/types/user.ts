export interface UserInfo {
  id: number;
  username: string;
  email?: string;
  phone?: string;
  nickname?: string;
  avatar?: string;
  bio?: string;
  status: number;
  roles: string[];
  createdAt: string;
  lastLoginAt?: string;
}

export interface LoginParams {
  username: string;
  password: string;
}

export interface RegisterParams {
  username: string;
  password: string;
  email?: string;
  phone?: string;
  nickname?: string;
}

export interface TokenPair {
  accessToken: string;
  refreshToken: string;
}
