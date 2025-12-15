import { orderApi, request } from "@/lib/axios";
import { ApiResponse, PaginatedResponse } from "@/types/common";
import { OrderResponseDto } from "./order.dto";

export const ORDER_SERVICES = {
  getOrder: async (id: string): Promise<ApiResponse<OrderResponseDto>> => {
    return await request(orderApi.orderControllerFindOne.bind(orderApi), id);
  },

  getOrders: async (page?: number, limit?: number, search?: string, orderStatus?: string, paymentStatus?: string, startDate?: string, endDate?: string): Promise<PaginatedResponse<OrderResponseDto[]>> => {
    return await request(orderApi.orderControllerFindAll.bind(orderApi), page, limit, search, orderStatus, paymentStatus, startDate, endDate ) as PaginatedResponse<OrderResponseDto[]>;
  },

  getOrdersByUser: async (page?: number, limit?: number): Promise<PaginatedResponse<OrderResponseDto[]>> => {
    return await request(orderApi.orderControllerFindAllByUser.bind(orderApi), page, limit) as PaginatedResponse<OrderResponseDto[]>;
  },

  approveReturn: async (id: string): Promise<ApiResponse<OrderResponseDto[]>> => {
    return await request(orderApi.orderControllerUpdate.bind(orderApi), id, {status: 'return_approved'} ) as ApiResponse<OrderResponseDto[]>;
  },

  updateStatus: async (id: string, status: string): Promise<ApiResponse<OrderResponseDto[]>> => {
    return await request(orderApi.orderControllerUpdate.bind(orderApi), id, {status} ) as ApiResponse<OrderResponseDto[]>;
  },
};
