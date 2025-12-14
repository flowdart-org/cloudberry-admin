"use client";

import { create } from "zustand";
import { PRODUCT_SERVICES } from "@/api/product/product.service";
import { LANDING_PAGE_SERVICES } from "@/api/landingPage/landingPage.service";
import { Product } from "@/types/product.types";

type HomeSectionState = {
  // data
  products: Product[];
  selectedCategories: string[];
  selectedProducts: string[];
  title: string;
  subtitle: string;
  bannerImage: string | null;

  // ui / meta
  loading: boolean;
  initialized: boolean;
  visibleProducts: number;
  visibleCategories: number;

  // actions
  init: () => Promise<void>;
  setTitle: (title: string) => void;
  setSubtitle: (subtitle: string) => void;
  setBannerImage: (url: string | null) => void;
  toggleProduct: (id: string, limit?: number) => void;
  toggleCategory: (id: string, limit?: number) => void;
  loadMoreProducts: (step?: number) => void;
  saveLandingPage: () => Promise<void>;
};

export const useHomeSectionStore = create<HomeSectionState>((set, get) => ({
  categories: [],
  products: [],
  selectedCategories: [],
  selectedProducts: [],
  title: "",
  subtitle: "",
  bannerImage: null,

  loading: false,
  initialized: false,
  visibleProducts: 8,
  visibleCategories: 8,

  init: async () => {
    if (get().initialized) return;

    set({ loading: true });
    try {
      const [ prodRes, landingRes] = await Promise.all([
        PRODUCT_SERVICES.getProducts(),
        LANDING_PAGE_SERVICES.getLandingPageDetails(),
      ]);

      const products: Product[] = prodRes.data || [];
      const landing = landingRes.data;

      
      set({
        products,
        selectedCategories: landing?.topCategories?.map((c: any) => c.id) || [],
        selectedProducts: landing?.topProducts?.map((p: any) => p.id) || [],
        title: landing?.hero?.title || "",
        subtitle: landing?.hero?.subtitle || "",
        bannerImage: landing?.hero?.image || null,
        visibleProducts: Math.min(8, products.length),
        visibleCategories: Infinity,
        initialized: true,
      });

    } catch (error) {
      console.error("Failed to init home section store", error);
    } finally {
      set({ loading: false });
    }
  },

  setTitle: (title) => set({ title }),
  setSubtitle: (subtitle) => set({ subtitle }),
  setBannerImage: (url) => set({ bannerImage: url }),

  toggleProduct: (id: string, limit = 10) => {
    const { selectedProducts } = get();
    if (selectedProducts.includes(id)) {
      set({ selectedProducts: selectedProducts.filter((p) => p !== id) });
    } else {
      if (selectedProducts.length >= limit) return;
      set({ selectedProducts: [...selectedProducts, id] });
    }
  },

  toggleCategory: (id: string, limit = 10) => {
    const { selectedCategories } = get();
    if (selectedCategories.includes(id)) {
      set({ selectedCategories: selectedCategories.filter((c) => c !== id) });
    } else {
      if (selectedCategories.length >= limit) return;
      set({ selectedCategories: [...selectedCategories, id] });
    }
  },

  loadMoreProducts: (step = 8) => {
    const { visibleProducts, products } = get();
    const next = Math.min(visibleProducts + step, products.length);
    set({ visibleProducts: next });
  },

  

  saveLandingPage: async () => {
    const { title, subtitle, selectedCategories, selectedProducts } = get();
    try {
      await LANDING_PAGE_SERVICES.updateLandingPageDetails(
        title,
        subtitle,
        selectedCategories,
        selectedProducts
      );
    } catch (error) {
      console.error("Failed to save landing page", error);
    }
  },
}));
