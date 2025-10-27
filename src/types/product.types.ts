export interface Product {
  id: string;
  name: string;
  description: string;
  actualPrice: number;
  variants: VariantDto[];
  discountPrice: number;
  discountPercent: number;
  categoryId: number;
  status: "active" | "inactive";
  tryOn: boolean;
  tags?: string[];
  images?: ProductImage[]
  thumbnail?: string;
}

export interface VariantDto {
  size: string;
  stock: number;
}

export interface ProductImage {
  id: string;
  url: string;
  isThumbnail: boolean;
}

