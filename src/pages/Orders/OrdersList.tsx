"use client";

import { useEffect } from "react";
import { Search } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Select, SelectTrigger, SelectContent, SelectItem, SelectValue } from "@/components/ui/select";
import { Pagination } from "@/components/common/Pagination";
import { OrderTable } from "@/components/orders/OrderTable";
import { useOrderStore } from "@/store/useOrderStore";

const OrdersList = () => {
  const {
    orders,
    search,
    orderStatus,
    paymentStatus,
    page,
    pageSize,
    totalItems,
    totalPages,
    loading,

    setSearch,
    setOrderStatus,
    setPaymentStatus,
    setPage,
    setPageSize,
    fetchOrders,
  } = useOrderStore();

  useEffect(() => {
    fetchOrders();
  }, []);

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold">Orders</h1>
        <p className="text-muted-foreground mt-1">Track and manage customer orders</p>
      </div>

      <div className="flex items-center gap-4">

        {/* SEARCH */}
        <div className="relative flex-1 max-w-md">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground"/>
          <Input
            type="search"
            placeholder="Search orders..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="pl-10"
          />
        </div>

        {/* ORDER STATUS */}
        <Select value={orderStatus} onValueChange={setOrderStatus}>
          <SelectTrigger className="w-[180px]">
            <SelectValue placeholder="Order Status" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All</SelectItem>
            <SelectItem value="pending">Pending</SelectItem>
            <SelectItem value="shipping">Shipping</SelectItem>
            <SelectItem value="delivered">Delivered</SelectItem>
            <SelectItem value="canceled">Canceled</SelectItem>
            <SelectItem value="return-request">Return Requests</SelectItem>
            <SelectItem value="returned">Returned</SelectItem>
          </SelectContent>
        </Select>

        {/* PAYMENT STATUS */}
        <Select value={paymentStatus} onValueChange={setPaymentStatus}>
          <SelectTrigger className="w-[180px]">
            <SelectValue placeholder="Payment Status" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All</SelectItem>
            <SelectItem value="paid">Paid</SelectItem>
            <SelectItem value="pending">Pending</SelectItem>
            <SelectItem value="failed">Failed</SelectItem>
          </SelectContent>
        </Select>
      </div>

      {/* TABLE */}
      {loading ? (
        <div className="text-center py-10">Loading...</div>
      ) : (
        <OrderTable orders={orders} />
      )}

      {/* PAGINATION */}
      <Pagination
        currentPage={page}
        totalPages={totalPages}
        totalItems={totalItems}
        pageSize={pageSize}
        onPageChange={setPage}
        onPageSizeChange={(size) => setPageSize(size)}
      />
    </div>
  );
};

export default OrdersList;
