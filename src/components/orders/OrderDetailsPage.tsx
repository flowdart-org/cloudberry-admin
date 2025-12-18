"use client";

import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { Separator } from "@/components/ui/separator";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { ArrowLeft } from "lucide-react";
import { OrderResponseDto } from "@/api/order/order.dto";
import { formatCurrency } from "@/utils/currency";
import { formatDate } from "@/utils/formatDate";
import { OrderStatusBadge } from "./OrderStatusBadge";
import { PaymentStatusBadge } from "./PaymentStatusBadge";
import { ORDER_SERVICES } from "@/api/order/order.service";
import { toast } from "@/hooks/use-toast";
import { PAYMENT_SERVICES } from "@/api/payment/payment.service";

const ORDER_STATUS_OPTIONS = [
  "pending",
  "processing",
  "shipping",
  "delivered",
  "cancelled",
];

const PAYMENT_STATUS_OPTIONS = [
  "pending",
  "paid",
  "failed",
  "refunded",
];

export default function OrderDetailsPage() {
  const { id } = useParams();
  const navigate = useNavigate();

  const [order, setOrder] = useState<OrderResponseDto | null>(null);
  const [updatingStatus, setUpdatingStatus] = useState(false);
  const [updatingPayment, setUpdatingPayment] = useState(false);
  const [showRefundModal, setShowRefundModal] = useState(false);
  const [refundLoading, setRefundLoading] = useState(false);

  // ---- Fetch Order Data ----
  useEffect(() => {
    // replace with your API service
    const fetchOrder = async () => {
      const res = await ORDER_SERVICES.getOrder(id!);
      setOrder(res.data);
      };
    fetchOrder();
  }, [id]);

  const handleStatusUpdate = async (orderId: string, status: string) => {
    setUpdatingStatus(true);

    try {
      const response = await ORDER_SERVICES.updateStatus(orderId, status);
      console.log(response)
      if(response.success) {
        setOrder((prev) => prev ? { ...prev, orderStatus: status } as OrderResponseDto : prev);
      } else {
        toast({title: "Unable to update status!", description: "Something went wrong"})
      }
    } catch (err) {
      console.error(err);
    } finally {
      setUpdatingStatus(false);
    }
  };

  if (!order) return <p className="text-center py-10 text-muted-foreground">Loading order...</p>;

  const changePaymentStatus = async (paymentIdOrOrderId: string, status: string) => {
    setUpdatingPayment(true);
    try {
      const res = await PAYMENT_SERVICES.updateStatus(paymentIdOrOrderId, status);
      if (res && res.success) {
        setOrder((prev) => (prev ? { ...prev, paymentStatus: status } as OrderResponseDto : prev));
        toast({ title: "Payment status updated" });
      } else {
        toast({ title: "Failed to update payment status" });
      }
    } catch (err) {
      console.error(err);
      toast({ title: "Failed to update payment status" });
    } finally {
      setUpdatingPayment(false);
    }
  };

  const refundOrder = async () => {
    setRefundLoading(true);
    try {
      const res = await ORDER_SERVICES.refundPayment(id!);
      if (res && (res as any).success) {
        toast({ title: "Refund processed" });
        // Update local payment status if backend returns success
        setOrder((prev) => (prev ? { ...prev, paymentStatus: 'refunded' } as OrderResponseDto : prev));
        setShowRefundModal(false);
      } else {
        toast({ title: "Refund failed" });
      }
    } catch (err) {
      console.error(err);
      toast({ title: "Refund failed" });
    } finally {
      setRefundLoading(false);
    }
  }

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
          <div className="grid gap-4 md:grid-cols-4">
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
            {(order.paymentStatus === 'pending' || order.paymentStatus === 'refunded') && <div className="space-y-1">
              <Button type="button" onClick={() => setShowRefundModal(true)}>Refund</Button>
            </div>}
          </div>

          <Separator />

          {/* Customer Details */}
          <div>
            <h2 className="font-semibold mb-3">Customer</h2>
            <p>{order.customer?.name || "N/A"}</p>
            <p className="text-sm text-muted-foreground">{order.customer?.email}</p>
            <p className="text-sm text-muted-foreground">{order.customer?.phone}</p>
          </div>

          <Separator />

          {/* Shipping Address */}
          <div>
            <h2 className="font-semibold mb-3">Shipping Address</h2>
            {order.shippingAddress ? (
              <div className="text-sm text-muted-foreground space-y-1">
                <p>{order.shippingAddress.houseNo ? `${order.shippingAddress.houseNo}, ${order.shippingAddress.street}` : order.shippingAddress.street}</p>
                <p>{order.shippingAddress.city}{order.shippingAddress.state ? `, ${order.shippingAddress.state}` : ''}</p>
                <p>{order.shippingAddress.pincode}</p>
                <p>{order.shippingAddress.country}</p>
              </div>
            ) : (
              <p className="text-sm text-muted-foreground">No shipping address provided</p>
            )}
          </div>

          <Separator />

          {/* Order Items */}
          <h2 className="font-semibold mb-3">Items</h2>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Item</TableHead>
                <TableHead>Variant</TableHead>
                <TableHead>Qty</TableHead>
                <TableHead>Price</TableHead>
                <TableHead className="text-right">Total</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {order.items.map((item) => (
                <TableRow key={item.product.id}>
                  <TableCell className="font-medium">{item.product.name}</TableCell>
                  <TableCell>{item.variant.size}</TableCell>
                  <TableCell>{item.quantity}</TableCell>
                  <TableCell>{formatCurrency(item.product.discountPrice)}</TableCell>
                  <TableCell className="text-right">
                    {formatCurrency(item.quantity * item.product.discountPrice)}
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
                disabled={ status === 'pending' || updatingStatus}
                onClick={() => handleStatusUpdate(order.id, status)}
              >
                {status}
              </Button>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Payment Update Section */}
      {/* Refund Confirmation Modal */}
      <Dialog open={showRefundModal} onOpenChange={setShowRefundModal}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Confirm Refund</DialogTitle>
          </DialogHeader>
          <div className="py-4">Are you sure you want to refund this order? This action cannot be undone.</div>
          <DialogFooter>
            <Button type="button" variant="outline" onClick={() => setShowRefundModal(false)} disabled={refundLoading}>Cancel</Button>
            <Button type="button" onClick={refundOrder} disabled={refundLoading}>{refundLoading ? 'Processing...' : 'Confirm Refund'}</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
