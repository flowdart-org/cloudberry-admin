import { Configuration } from "@/api";
import { AdminApi, AuthApi, ProductApi } from "@/api";

const basePath = process.env.VITE_PUBLIC_API_BASE_URL;

const config = new Configuration({
    basePath,
    baseOptions: {
        withCredentials: true,
        headers: {
            'Content-Type': 'application/json',
        }
    }
});

export const authApi = new AuthApi(config);
export const adminApi = new AdminApi(config);
export const productApi = new ProductApi(config);
