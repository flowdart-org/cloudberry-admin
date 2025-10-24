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
import { Order } from '@/types/order';
import { OrderStatusBadge } from './OrderStatusBadge';
import { formatCurrency } from '@/utils/currency';
import { formatDate } from '@/utils/formatDate';
import { ROUTES } from '@/config/routes.config';

interface OrderTableProps {
  orders: Order[];
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
            <TableHead>Status</TableHead>
            <TableHead className="text-right">Actions</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {orders.map((order) => (
            <TableRow key={order.id} className="hover:bg-card-hover">
              <TableCell className="font-medium">#{order.orderNumber}</TableCell>
              <TableCell>{order.customerName}</TableCell>
              <TableCell>{formatDate(order.createdAt)}</TableCell>
              <TableCell>{formatCurrency(order.total)}</TableCell>
              <TableCell>
                <OrderStatusBadge status={order.status} />
              </TableCell>
              <TableCell className="text-right">
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={() => navigate(ROUTES.ORDER_DETAILS.replace(':id', order.id))}
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
