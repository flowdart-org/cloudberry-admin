import { productApi, request } from "@/lib/axios";
import { Product } from "@/types/product.types";
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

  getProducts: async (): Promise<ApiResponse<Product[]>> => {
    const response: any = await productApi.productControllerFindAll();
    return response.data;
  },

  updateProduct: async (
    id: string,
    data: updateProductDTO
  ): Promise<ApiResponse<Product>> => {
    const response: any = await productApi.productControllerUpdate(id, data);
    return response.data;
  },
};
