import { VariantDto, ProductImage } from "@/types/product.types";

export interface CreateProductDTO {
  name: string;
  description: string;
  actualPrice: number;
  discountPercent: number;
  categoryId: number;
  status: "active" | "inactive";
  tryOn: boolean;
  tags?: string[];
  images?: ProductImage[];
  thumbnail?: string;
}

export interface updateProductDTO {
  name?: string;
  description?: string;
  actualPrice?: number;
  discountPercent?: number;
  categoryId?: number;
  status?: "active" | "inactive";
  tryOn?: boolean;
  tags?: string[];
  variants?: VariantDto[];
  images?: ProductImage[];
  thumbnail?: string;
}
