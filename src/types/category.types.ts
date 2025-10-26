export interface Category {
  id: string;
  name: string;
  thumbnail: string;
  description: string;
  productCount: number;
  status: "active" | "inactive"
}
