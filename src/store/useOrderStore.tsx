"use client";

import { create } from "zustand";
import { ORDER_SERVICES } from "@/api/order/order.service";
import { OrderResponseDto } from "@/api/order/order.dto";

interface OrderState {
  orders: OrderResponseDto[];

  page: number;
  pageSize: number;

  search: string;
  orderStatus: string;
  paymentStatus: string;
  startDate: string | null;
  endDate: string | null;

  totalItems: number;
  totalPages: number;

  loading: boolean;

  // debounce timer
  searchDebounce: any;

  setSearch: (q: string) => void;

  setPage: (p: number) => void;
  setPageSize: (s: number) => void;

  setOrderStatus: (s: string) => void;
  setPaymentStatus: (s: string) => void;

  setDateRange: (start: string | null, end: string | null) => void;

  fetchOrders: () => Promise<void>;
}

export const useOrderStore = create<OrderState>((set, get) => ({
  orders: [],

  page: 1,
  pageSize: 10,

  search: "",
  orderStatus: "all",
  paymentStatus: "all",
  startDate: null,
  endDate: null,

  totalItems: 0,
  totalPages: 1,

  loading: false,

  searchDebounce: null,

  // ---------------------------------------------------
  // 🔥 ONLY DEBOUNCING SEARCH
  // ---------------------------------------------------
  setSearch: (q: string) => {
    const { searchDebounce } = get();

    set({ search: q, page: 1 });

    if (searchDebounce) clearTimeout(searchDebounce);

    const timer = setTimeout(() => {
      get().fetchOrders();
    }, 300);

    set({ searchDebounce: timer });
  },

  setPage: (p) => {
    set({ page: p });
    get().fetchOrders();
  },

  setPageSize: (s) => {
    set({ pageSize: s, page: 1 });
    get().fetchOrders();
  },

  setOrderStatus: (s) => {
    set({ orderStatus: s, page: 1 });
    get().fetchOrders();
  },

  setPaymentStatus: (s) => {
    set({ paymentStatus: s, page: 1 });
    get().fetchOrders();
  },

  setDateRange: (start, end) => {
    set({ startDate: start, endDate: end, page: 1 });
    get().fetchOrders();
  },

  // ---------------------------------------------------
  // MAIN FETCH
  // ---------------------------------------------------
  fetchOrders: async () => {
    const {
      page,
      pageSize,
      search,
      orderStatus,
      paymentStatus,
      startDate,
      endDate,
    } = get();

    set({ loading: true });

    try {
      const res = await ORDER_SERVICES.getOrders(
        page,
        pageSize,
        search,
        orderStatus !== 'all' ? orderStatus : undefined,
        paymentStatus !== 'all' ? paymentStatus : undefined,
        startDate,
        endDate
      );

      set({
        orders: res.data,
        totalItems: res.total,
        totalPages: Math.ceil(res.total/res.limit),
      });
    } finally {
      set({ loading: false });
    }
  },
}));
