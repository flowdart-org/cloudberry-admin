export type UserRole = 'admin' | 'manager' | 'customer';

export interface User {
  id: string;
  email: string;
  firstName: string;
  lastName: string;
  role: UserRole;
  avatar?: string;
  phone?: string;
  status: 'active' | 'inactive';
  createdAt: string;
  updatedAt: string;
}

export interface UserFormData {
  email: string;
  firstName: string;
  lastName: string;
  role: UserRole;
  phone?: string;
  password?: string;
}
