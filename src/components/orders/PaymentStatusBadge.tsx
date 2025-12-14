import { PaymentStatus } from '@/api/order/order.dto';
import { Badge } from '@/components/ui/badge';
import { cn } from '@/utils/tailwind';

interface PaymentStatusBadgeProps {
  status:   PaymentStatus
}

const statusConfig = {
  pending: {
    label: 'Pending',
    className: 'bg-warning/10 text-warning border-warning/20',
  },
  
  failed: {
    label: 'Failed',
    className: 'bg-red-200 text-chart-2 border-chart-2/20',
  },
  paid: {
    label: 'Paid',
    className: 'bg-success/10 text-success border-success/20',
  },
  refunded: {
    label: 'Refunded',
    className: 'bg-yellow-300 text-destructive border-destructive/20',
  },
};

export const PaymentStatusBadge = ({ status }: PaymentStatusBadgeProps) => {
  const config = statusConfig[status];

  return (
    <Badge variant="outline" className={cn('border font-medium', config.className)}>
      {config.label}
    </Badge>
  );
};
