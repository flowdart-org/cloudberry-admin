import { analyticsApi, request } from "@/lib/axios";
import { ApiResponse } from "@/types/common";
import { DashboardAnalyticsResponseDto } from "../client";

export const ANALYTICS_SERVICES = {
  getAnalytics: async (): Promise<ApiResponse<DashboardAnalyticsResponseDto>> => {
    return await request(analyticsApi.analyticsControllerGet.bind(analyticsApi));
  },
};
