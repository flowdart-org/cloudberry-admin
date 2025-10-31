export interface Category {
  id: string;
  name: string;
  thumbnail: string;
  productCount: number;
  status: "active" | "inactive"
}
