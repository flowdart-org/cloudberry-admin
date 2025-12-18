import { Badge } from '@/components/ui/badge';
import type { MouseEventHandler } from 'react';
import { OrderStatus } from '@/types/order';
import { cn } from '@/utils/tailwind';
interface OrderStatusBadgeProps {
  status: OrderStatus;
  onClick?: MouseEventHandler<HTMLDivElement>;
}

const statusConfig = {
  pending: {
    label: 'Pending',
    className: 'bg-warning/10 text-warning border-warning/20',
  },
  processing: {
    label: 'Processing',
    className: 'bg-info/10 text-info border-info/20',
  },
  shipping: {
    label: 'Shipping',
    className: 'bg-chart-2/10 text-chart-2 border-chart-2/20',
  },
  delivered: {
    label: 'Delivered',
    className: 'bg-success/10 text-success border-success/20',
  },
  canceled: {
    label: 'Canceled',
    className: 'bg-destructive/10 text-destructive border-destructive/20',
  },
  'return_requested': {
    label: 'Return Requested',
    className: 'bg-red-300 text-destructive border-destructive/20 rounded-none text-center cursor-pointer',
  },
  'return_approved' : {
    label: 'Return Approved',
    className: 'bg-purple-300 text-purple-800 text-center border-purple-800',
  },
  returned: {
    label: 'Returned',
    className: 'bg-warning/10 text-warning border-warning/20',
  },
};

export const OrderStatusBadge = ({ status, onClick }: OrderStatusBadgeProps) => {
  const config = statusConfig[status];

  return (
    <Badge variant="outline" className={cn('border font-medium', config.className)} onClick={onClick}>
      {config.label}
    </Badge>
  );
};

