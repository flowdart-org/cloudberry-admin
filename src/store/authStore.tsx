import { USER_SERVICES } from "@/api/user/user.service";
import { logoutApi, refreshTokenApi } from "@/lib/functions/auth";
import { AuthState } from "@/types/auth.types";
import { create } from "zustand";
import { persist } from "zustand/middleware";


export const useAuthStore = create<AuthState>()(
    persist(
        (set, get) => ({
            isAuthenticated: false,
            isLoading: true,
            user: null,

            login: async () => {
                set({ isAuthenticated: true })
                get().fetchUser()
            },

            fetchUser: async () => {
                try {
                    if (get().isAuthenticated) {
                        const { success, data: user } = await USER_SERVICES.me()
                        if (success && user) {
                            set({ user, isAuthenticated: true })
                        } else {
                            get().logout()
                        }
                    }
                } catch (error: any) {
                    if (error?.response?.data?.error?.code === 'ForbiddenException') {
                        get().logout()
                    }
                }
                set({ isLoading: false })
            },

            refreshToken: async () => {
                set({ isLoading: true })
                const { success } = await refreshTokenApi()
                if (!success) {
                    get().logout()
                    set({ isLoading: false, isAuthenticated: false })
                    return false
                }
                set({ isLoading: false })
                return true
            },

            logout: async () => {
                set({ isLoading: true })
                await logoutApi()
                set({ user: null, isAuthenticated: false, isLoading: false  })
            },

            setUser: (userUpdate) =>
                set((state) => ({
                    user: state.user ? { ...state.user, ...userUpdate } : null,
                })),
        }),
        {
            name: "auth-storage",
            partialize: (state) => ({
                isAuthenticated: state.isAuthenticated,
            }),
        }
    )
);
