import { api, mediaApi, request } from "@/lib/axios";
import { ApiResponse } from "@/types/common";

export const MEDIA_SERVICES = {
  getCategoryUploadUrl: async (id: string, file: File): Promise<ApiResponse<{uploadUrl: string, readUrl: string}>> => {
    return await request(mediaApi.mediaControllerGetCategoryUploadUrl.bind(mediaApi), id, file.type);
  },

  getProductUploadUrl: async (id: string, orderId: number, file: File): Promise<ApiResponse<{uploadUrl: string, readUrl: string}>> => {
    return await request(mediaApi.mediaControllerGetProductUploadUrl.bind(mediaApi), id, orderId, file.type);
  },

  getProductThumbnailUploadUrl: async (id: string, file: File): Promise<ApiResponse<{uploadUrl: string, readUrl: string}>> => {
    return await request(mediaApi.mediaControllerGetProductThumbnailUploadUrl.bind(mediaApi), id, file.type);
  },

  getHeroImageUploadUrl: async (): Promise<ApiResponse<{uploadUrl: string, readUrl: string}>> => {
    return await request(mediaApi.mediaControllerGetHeroImageUploadUrl.bind(mediaApi));
  },

  uploadImage: async (url: string, image: File): Promise<ApiResponse<void>> => {
    return await api.put(url, image, { headers: { 'x-ms-blob-type': "BlockBlob", 'Content-Type': 'image/jpg'}})
  },
};
