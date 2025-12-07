import { VariantDto } from "@/types/product.types";

export interface CreateProductDTO {
  name: string;
  description: string;
  actualPrice: number;
  discountPrice: number;
  discountPercent: number;
  categoryId: string;
  status: "active" | "inactive";
  tryOn: boolean;
  tags?: string[];
  images?: string[];
  thumbnail?: string;
  variants?: string[ ];
}

export interface updateProductDTO {
  name?: string;
  description?: string;
  actualPrice?: number;
  discountPrice?: number;
  discountPercent?: number;
  categoryId?: string;
  status?: "active" | "inactive";
  tryOn?: boolean;
  tags?: string[];
  variants?: VariantDto[];
  images?: string[];
  thumbnail?: string;
}
