export type UserRole = 'super_admin' | 'editor' | 'client';

export interface AuthUser {
  id: string;
  email: string;
  name: string;
  role: UserRole;
  company?: string;
  avatar?: string;
  authProvider?: string;
  createdAt?: string;
}

export type AuthMode = 'php' | 'static';
