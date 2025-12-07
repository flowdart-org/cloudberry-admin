"use client";

import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { ArrowLeft } from "lucide-react";
import { OrderResponseDto } from "@/api/order/order.dto";
import { formatCurrency } from "@/utils/currency";
import { formatDate } from "@/utils/formatDate";
import { OrderStatusBadge } from "./OrderStatusBadge";
import { PaymentStatusBadge } from "./PaymentStatusBadge";
import { ORDER_SERVICES } from "@/api/order/order.service";

const ORDER_STATUS_OPTIONS = [
  "pending",
  "processing",
  "shipped",
  "delivered",
  "cancelled",
];

export default function OrderDetailsPage() {
  const { id } = useParams();
  const navigate = useNavigate();

  const [order, setOrder] = useState<OrderResponseDto | null>(null);
  const [updatingStatus, setUpdatingStatus] = useState(false);

  // ---- Fetch Order Data ----
  useEffect(() => {
    // replace with your API service
    const fetchOrder = async () => {
      const res = await ORDER_SERVICES.getOrder(id!);
      setOrder(res.data);
      // MOCK for now:
//       setOrder({
//   id: "ord_91f2ab9d8f",
//   orderNumber: "ORD-2025-00012",
//   customer: {
//     id: "cus_91482ghs",
//     name: "Ajmal T A",
//     email: "ajmal@example.com",
//     phone: "+91 9876543210",
//     address: {
//       street: "23/144 A, Skyline Apartments",
//       city: "Kochi",
//       state: "Kerala",
//       postalCode: "682304",
//       country: "India"
//     }
//   },
//   placedAt: "2025-11-27T10:15:00.000Z",
//   updatedAt: "2025-11-28T14:22:00.000Z",
//   deliveredAt: null,
//   cancelledAt: null,

//   subtotal: 1680,
//   shippingCharge: 50,
//   discount: 200,
//   total: 1530,

//   paymentMethod: {
//     method: "ONLINE",
//     provider: "Razorpay",
//     transactionId: "txn_88421dd93",
//     amountPaid: 1530
//   },

//   paymentStatus: "paid", // other options: UNPAID | FAILED | REFUNDED
//   orderStatus: "processing", // other options: SHIPPED | DELIVERED | CANCELLED | PENDING
//   isDeleted: false,

//   items: [
//     {
//       productId: "P10021",
//       name: "Zinger Burger",
//       quantity: 2,
//       price: 260, // single item price
//       thumbnail: "https://picsum.photos/100/100?random=1",
//     },
//     {
//       productId: "P10090",
//       name: "BBQ Chicken Pizza",
//       quantity: 1,
//       price: 780,
//       thumbnail: "https://picsum.photos/100/100?random=2",
//     },
//     {
//       productId: "P10034",
//       name: "Cold Coffee",
//       quantity: 3,
//       price: 140,
//       thumbnail: "https://picsum.photos/100/100?random=3",
//     },
//   ]
// });
    };
    fetchOrder();
  }, [id]);

  const handleStatusUpdate = async (status: string) => {
    setUpdatingStatus(true);

    try {
      // await ORDER_SERVICE.updateStatus(id!, status);
      setOrder((prev) => prev ? { ...prev, orderStatus: status } : prev);
    } catch (err) {
      console.error(err);
    } finally {
      setUpdatingStatus(false);
    }
  };

  if (!order) return <p className="text-center py-10 text-muted-foreground">Loading order...</p>;

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center gap-4">
        <Button variant="ghost" onClick={() => navigate(-1)}>
          <ArrowLeft className="mr-2 h-4 w-4" /> Back
        </Button>
        <h1 className="text-xl font-semibold">Order #{order.orderNumber}</h1>
      </div>

      {/* Summary Section */}
      <Card>
        <CardHeader>
          <CardTitle>Order Summary</CardTitle>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="grid gap-4 md:grid-cols-3">
            <div className="space-y-1">
              <p className="text-sm text-muted-foreground">Placed On</p>
              <p>{formatDate(order.placedAt)}</p>
            </div>
            <div className="space-y-1">
              <p className="text-sm text-muted-foreground">Order Status</p>
              <OrderStatusBadge status={order.orderStatus} />
            </div>
            <div className="space-y-1">
              <p className="text-sm text-muted-foreground">Payment Status</p>
              <PaymentStatusBadge status={order.paymentStatus} />
            </div>
          </div>

          <Separator />

          {/* Customer Details */}
          <div>
            <h2 className="font-semibold mb-3">Customer</h2>
            <p>{order.customer?.name || "Unknown"}</p>
            <p className="text-sm text-muted-foreground">{order.customer?.email}</p>
          </div>

          <Separator />

          {/* Order Items */}
          <h2 className="font-semibold mb-3">Items</h2>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Item</TableHead>
                <TableHead>Qty</TableHead>
                <TableHead>Price</TableHead>
                <TableHead className="text-right">Total</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {order.items.map((item) => (
                <TableRow key={item.productId}>
                  <TableCell className="font-medium">{item.name}</TableCell>
                  <TableCell>{item.quantity}</TableCell>
                  <TableCell>{formatCurrency(item.price)}</TableCell>
                  <TableCell className="text-right">
                    {formatCurrency(item.quantity * item.price)}
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>

          {/* Totals */}
          <div className="ml-auto w-full md:w-1/3 space-y-2 pt-4">
            <div className="flex justify-between">
              <span className="text-sm text-muted-foreground">Subtotal</span>
              <span>{formatCurrency(order.subtotal)}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-sm text-muted-foreground">Shipping</span>
              <span>{formatCurrency(order.shippingCharge)}</span>
            </div>
            {order.discount > 0 && (
              <div className="flex justify-between">
                <span className="text-sm text-muted-foreground">Discount</span>
                <span>-{formatCurrency(order.discount)}</span>
              </div>
            )}
            <Separator />
            <div className="flex justify-between font-semibold text-lg">
              <span>Total</span>
              <span>{formatCurrency(order.total)}</span>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Status Update Section */}
      <Card>
        <CardHeader>
          <CardTitle>Update Order Status</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex items-center gap-3 flex-wrap">
            {ORDER_STATUS_OPTIONS.map((status) => (
              <Button
                key={status}
                variant={order.orderStatus === status ? "default" : "outline"}
                disabled={updatingStatus}
                onClick={() => handleStatusUpdate(status)}
              >
                {status}
              </Button>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
