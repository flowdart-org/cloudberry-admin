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
                <div><p>{order?.customer.name}</p> <p>{order?.customer.email}</p> </div></TableCell>
              <TableCell>{formatDate(order?.placedAt)}</TableCell>
              <TableCell>{formatCurrency(order?.total)}</TableCell>
              <TableCell>
                <OrderStatusBadge status={order?.orderStatus} />
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
    </div>
  );
};
