import { AdminUser } from "./user.types";

export interface LoginDTO { email: string; password: string }

export interface AuthState {
    isAuthenticated: boolean;
    isLoading: boolean;
    user: AdminUser | null;
    login: () => void;
    logout: () => void;
    setUser: (user: Partial<AdminUser>) => void;
    refreshToken: () => Promise<boolean>;
    fetchUser: () => Promise<void>;
}

