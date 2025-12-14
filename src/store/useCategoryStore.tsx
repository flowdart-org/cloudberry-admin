import { create } from "zustand";
import { CATEGORY_SERVICES } from "@/api/category/category.service";
import { Category } from "@/types/category.types";

interface CategoryStore {
  categories: Category[];
  loading: boolean;
  error: string | null;
  fetchAll: () => Promise<void>;
  setCategories: (categories: Category[]) => void;
  reset: () => void;
}

export const useCategoryStore = create<CategoryStore>((set) => ({
  categories: [],
  loading: false,
  error: null,

  fetchAll: async () => {
    set({ loading: true, error: null });
    try {
      const resp = await CATEGORY_SERVICES.getCategories();

      let categories: Category[] = resp.data;
      set({ categories, loading: false });
    } catch (err: any) {
      set({ error: err?.message ?? "Failed to fetch categories", loading: false });
    }
  },

  setCategories: (categories) => set({ categories }),

  reset: () => set({ categories: [], loading: false, error: null }),
}));
