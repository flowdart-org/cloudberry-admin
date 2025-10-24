export interface Category {
  id: string;
  name: string;
  description?: string;
  slug: string;
  productCount: number;
  status: 'active' | 'inactive';
  createdAt: string;
  updatedAt: string;
}

export interface CategoryFormData {
  name: string;
  description?: string;
  slug: string;
  status: 'active' | 'inactive';
}
