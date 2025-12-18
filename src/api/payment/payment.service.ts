import { paymentApi, request } from "@/lib/axios";
import { ApiResponse } from "@/types/common";
import { PaymentStatus } from "../order/order.dto";


export const PAYMENT_SERVICES = {
  updateStatus: async (id: string, status: string): Promise<ApiResponse<PaymentStatus>> => {
    return await request(paymentApi.paymentControllerVerifyPayment.bind(paymentApi), id, {status} ) as ApiResponse<PaymentStatus>;
  },
};
