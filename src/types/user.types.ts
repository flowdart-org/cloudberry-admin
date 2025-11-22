export interface AdminUser {
  id: string;
  email?: string;
  name?: string;
  createdAt: string;
  updatedAt: string;
}


export interface User {
  id: string;
  email?: string;
  name?: string;
  phone?: string;
  dob?: string;
  gender?: string;
  role?: string;
  status?: 'active' | 'suspend';
  joined: string;
  updatedAt: string;
}

export interface ExtendedUser extends User {
  totalOrders: number;
  totalSpent: number;

}