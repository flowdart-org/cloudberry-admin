export interface Product {
  id: string;
  name: string;
  description: string;
  price: number;
  variants: VariantDto[];
  discountPercent: number;
  categoryId: string;
  status: "active" | "inactive";
  tryOn: boolean;
  tags?: string[];
  images?: ProductImage[]
  thumbnail?: string;
}

export interface ProductDetails {
  id: string;
  name: string;
  description: string;
  price: number;
  variants: VariantDto[];
  discountPercent: number;
  category: {
    name: string;
    id: string
  };
  status: "active" | "inactive";
  tryOn: boolean;
  tags?: string[];
  images?: string[]
  thumbnail?: string;
}

export interface VariantDto {
  size: string;
  stock: number;
}


