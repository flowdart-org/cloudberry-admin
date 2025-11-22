import { productApi, request } from "@/lib/axios";
import { Product, ProductDetails } from "@/types/product.types";
import { updateProductDTO } from "./product.dto";
import { ApiResponse } from "@/types/common";
import { CreateProductDto } from "../client/api";


export const PRODUCT_SERVICES = {
  addProduct: async (data: CreateProductDto): Promise<ApiResponse<Product>> => {
    const response: any = await productApi.productControllerCreate(data);
    return response.data;
  },

  getProduct: async (id: string): Promise<ApiResponse<Product>> => {
    const response: any = await productApi.productControllerFindOne(id);
    return response.data;
  },

  getProducts: async (page?: number, limit?: number, search?: string, status?: 'active' | 'inactive'): Promise<ApiResponse<ProductDetails[]>> => {
    const response = await productApi.productControllerFind( page, limit, search, status);
    return response.data;
  },


  updateProduct: async (
    id: string,
    data: updateProductDTO
  ): Promise<ApiResponse<Product>> => {
    const response: any = await productApi.productControllerUpdate(id, data)
    return response.data;
  },
};
