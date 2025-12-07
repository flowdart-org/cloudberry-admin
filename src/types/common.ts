export interface PaginationParams {
  page: number;
  limit: number;
  sortBy?: string;
  sortOrder?: 'asc' | 'desc';
}

export interface PaginatedResponse<T> {
  message: string;
  success: boolean;
  data: T;
  total: number;
  page: number;
  limit: number;
  // totalPages: number;
}

export interface ApiResponse<T> {
  message: string;
  success: boolean;
  data: T;
  error?: string;
}


export interface SelectOption {
  label: string;
  value: string | number;
}

export type Status = 'active' | 'inactive' | 'pending';
