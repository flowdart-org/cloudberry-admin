import { useNavigate } from 'react-router-dom';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { Button } from '@/components/ui/button';
import { Eye } from 'lucide-react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from '@/components/ui/dialog';
import { toast } from 'sonner';
import { useState } from 'react';
import { ORDER_SERVICES } from '@/api/order/order.service';
import { OrderStatusBadge } from './OrderStatusBadge';
import { formatCurrency } from '@/utils/currency';
import { formatDate } from '@/utils/formatDate';
import { ROUTES } from '@/config/routes.config';
import { PaymentStatusBadge } from './PaymentStatusBadge';
import { OrderResponseDto } from '@/api/order/order.dto';

interface OrderTableProps {
  orders: OrderResponseDto[];
}
export const OrderTable = ({ orders }: OrderTableProps) => {
  const navigate = useNavigate();
  const [showReturnModal, setShowReturnModal] = useState(false);
  const [returnOrderId, setReturnOrderId] = useState<string | null>(null);
  const [returnLoading, setReturnLoading] = useState(false);

  const handleReturnClick = (orderId: string) => {
    setReturnOrderId(orderId);
    setShowReturnModal(true);
  };

  const handleApproveReturn = async () => {
    if (!returnOrderId) return;
    setReturnLoading(true);
    try {
      await ORDER_SERVICES.approveReturn(returnOrderId);
      toast.success('Return approved');
      setShowReturnModal(false);
    } catch (err: any) {
      toast.error(err?.message || 'Failed to approve return');
    } finally {
      setReturnLoading(false);
    }
  };

  return (
    <div className="rounded-lg border border-border bg-card">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Order ID</TableHead>
            <TableHead>Customer</TableHead>
            <TableHead>Date</TableHead>
            <TableHead>Total</TableHead>
            <TableHead>Order Status</TableHead>
            <TableHead>Payment Status</TableHead>
            <TableHead className="text-right">Actions</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {orders?.length > 0 && orders.map((order) => (
            <TableRow key={order?.id} className="hover:bg-card-hover">
              <TableCell className="font-medium">#{order?.orderNumber}</TableCell>
              <TableCell>
                <div><p>{order?.customer.phone}</p> <p>{order?.customer.email}</p> </div></TableCell>
              <TableCell>{formatDate(order?.placedAt)}</TableCell>
              <TableCell>{formatCurrency(order?.total)}</TableCell>
              <TableCell>
                <OrderStatusBadge status={order?.orderStatus} onClick={order.orderStatus === 'return-request' ? () => handleReturnClick(order.id) : undefined} />
              </TableCell>
              <TableCell>
                <PaymentStatusBadge status={order?.paymentStatus} />
              </TableCell>
              <TableCell className="text-right">
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={() => navigate(ROUTES.ORDER_DETAILS.replace(':id', order?.id))}
                >
                  <Eye className="h-4 w-4" />
                </Button>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>

      {/* Return Modal */}
      <Dialog open={showReturnModal} onOpenChange={setShowReturnModal}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Approve Return Request?</DialogTitle>
          </DialogHeader>
          <div className="py-4">Do you want to approve this return request?</div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setShowReturnModal(false)} disabled={returnLoading}>No</Button>
            <Button onClick={handleApproveReturn} variant='default' disabled={returnLoading}  >Yes</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}; 
