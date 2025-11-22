import { create } from "zustand";

interface CategoryFilters {
  page: number;
  limit: number;
  search: string;
  status: "all" | "active" | "inactive";
}

interface CategoryStore extends CategoryFilters {
  setPage: (page: number) => void;
  setLimit: (limit: number) => void;
  setSearch: (value: string) => void;
  setStatus: (value: "all" | "active" | "inactive") => void;
  reset: () => void;
}

export const useCategoryStore = create<CategoryStore>((set) => ({
  page: 1,
  limit: 10,
  search: "",
  status: "all",

  setPage: (page) => set({ page }),
  setLimit: (limit) => set({ limit }),
  setSearch: (search) => set({ search, page: 1 }),
  setStatus: (status) => set({ status, page: 1 }),

  reset: () =>
    set({
      page: 1,
      limit: 10,
      search: "",
      status: "all",
    }),
}));
