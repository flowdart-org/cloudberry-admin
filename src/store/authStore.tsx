import { AUTH_SERVICES } from "@/api/auth/auth.service";
import { USER_SERVICES } from "@/api/user/user.service";
import { AuthState } from "@/types/auth";
import { create } from "zustand";
import { persist } from "zustand/middleware";


export const useAuthStore = create<AuthState>()(
    persist(
        (set, get) => ({
            isAuthenticated: false,
            isLoading: true,
            user: null,

            login: () => {
                set({ isAuthenticated: true })
                get().fetchUser()
            },

            fetchUser: async () => {
                if (get().isAuthenticated) {
                    const { success, data: user } = await USER_SERVICES.me()
                    if (success) {
                        set({ user, isAuthenticated: true })
                    }
                } else {
                    set({ user: null })
                }
                set({ isLoading: false })
            },

            logout: async () => {
                set({ isLoading: true })
                const { success } = await AUTH_SERVICES.logout()
                if (success) {
                    set({ user: null, isAuthenticated: false })
                }
                set({isLoading: false})
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
