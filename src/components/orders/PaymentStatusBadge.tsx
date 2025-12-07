import { Badge } from '@/components/ui/badge';
import { cn } from '@/utils/tailwind';

interface PaymentStatusBadgeProps {
  status:   'pending' | 'paid' | 'failed' | 'refunded' 
}

const statusConfig = {
  pending: {
    label: 'Pending',
    className: 'bg-warning/10 text-warning border-warning/20',
  },
  ship: {
    label: 'Processing',
    className: 'bg-info/10 text-info border-info/20',
  },
  shipped: {
    label: 'Shipped',
    className: 'bg-chart-2/10 text-chart-2 border-chart-2/20',
  },
  paid: {
    label: 'Paid',
    className: 'bg-success/10 text-success border-success/20',
  },
  cancelled: {
    label: 'Cancelled',
    className: 'bg-destructive/10 text-destructive border-destructive/20',
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
