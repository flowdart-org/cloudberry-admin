import { api, mediaApi, request } from "@/lib/axios";
import { ApiResponse } from "@/types/common";

export const MEDIA_SERVICES = {
  getUploadURL: async (file: File): Promise<ApiResponse<string>> => {
    return await request(mediaApi.mediaControllerGetUploadUrl.bind(mediaApi), file.name, file.type);
  },

  uploadImage: async (url: string, image: File): Promise<ApiResponse<string>> => {
    return await api.put(url, image, { headers: { 'x-ms-blob-type': "BlockBlob"}})
  },
};
