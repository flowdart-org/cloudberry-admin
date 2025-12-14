import { productApi, request } from "@/lib/axios";
import { Product, ProductDetails } from "@/types/product.types";
import { updateProductDTO } from "./product.dto";
import { ApiResponse, PaginatedResponse } from "@/types/common";
import { CreateProductDto } from "../client/api";


export const PRODUCT_SERVICES = {
  addProduct: async (data: CreateProductDto): Promise<ApiResponse<Product>> => {
    const response: any = await productApi.productControllerCreate(data);
    return response.data;
  },

  getProduct: async (id: string): Promise<ApiResponse<ProductDetails>> => {
    const response: any = await productApi.productControllerFindOne(id);
    return response.data;
  },

  getProducts: async (page?: number, limit?: number, search?: string, status?: 'active' | 'inactive', category?: string): Promise<PaginatedResponse<Product[]>> => {
    console.log(category)
    return await request(productApi.productControllerFind.bind(productApi), page, limit, search, status, category) as PaginatedResponse<Product[]>;
  },


  updateProduct: async (
    id: string,
    data: updateProductDTO
  ): Promise<ApiResponse<Product>> => {
    const response: any = await productApi.productControllerUpdate(id, data)
    return response.data;
  },
};
