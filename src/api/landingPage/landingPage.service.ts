import { landingPageApi, request } from "@/lib/axios";
import { ApiResponse } from "@/types/common";
import { LandingPageResponseDto } from "../client";

export const LANDING_PAGE_SERVICES = {
  getLandingPageDetails: async (): Promise<ApiResponse<LandingPageResponseDto>> => {
    return await request(landingPageApi.landingPageControllerGet.bind(landingPageApi)) as ApiResponse<LandingPageResponseDto>;
  },

  updateLandingPageDetails: async (heroTitle, heroSubtitle, topCategoryIds, topProductIds): Promise<ApiResponse<LandingPageResponseDto>> => {
    return await request(landingPageApi.landingPageControllerUpdate.bind(landingPageApi),{ heroTitle, heroSubtitle, topCategoryIds, topProductIds}) as ApiResponse<LandingPageResponseDto>;
  },
};
