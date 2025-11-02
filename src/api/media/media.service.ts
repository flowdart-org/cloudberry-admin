import { api, mediaApi, request } from "@/lib/axios";
import { ApiResponse } from "@/types/common";

export const MEDIA_SERVICES = {
  getCategoryUploadUrl: async (id: string, file: File): Promise<ApiResponse<string>> => {
    return await request(mediaApi.mediaControllerGetCategoryUploadUrl.bind(mediaApi), id, file.name, file.type);
  },

  getProductUploadUrl: async (id: string, file: File): Promise<ApiResponse<string>> => {
    return await request(mediaApi.mediaControllerGetProductUploadUrl.bind(mediaApi), id, file.name, file.type);
  },

  uploadImage: async (url: string, image: File): Promise<ApiResponse<void>> => {
    return await api.put(url, image, { headers: { 'x-ms-blob-type': "BlockBlob"}})
  },
};
