import { TrendingUp, TrendingDown, DollarSign, ShoppingCart, Package, Users } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { cn } from '@/utils/tailwind';
import { formatCurrency } from '@/utils/currency';

interface StatCardProps {
  title: string;
  value: string;
  change: number;
  icon: React.ReactNode;
}

const StatCard = ({ title, value, change, icon }: StatCardProps) => {
  const isPositive = change >= 0;

  return (
    <Card className="hover:shadow-md transition-shadow">
      <CardHeader className="flex flex-row items-center justify-between pb-2">
        <CardTitle className="text-sm font-medium text-muted-foreground">
          {title}
        </CardTitle>
        <div className="p-2 bg-secondary rounded-lg">
          {icon}
        </div>
      </CardHeader>
      <CardContent>
        <div className="text-2xl font-bold">{value}</div>
        <div className="flex items-center gap-1 mt-1">
          {isPositive ? (
            <TrendingUp className="h-4 w-4 text-success" />
          ) : (
            <TrendingDown className="h-4 w-4 text-destructive" />
          )}
          <span
            className={cn(
              'text-sm font-medium',
              isPositive ? 'text-success' : 'text-destructive'
            )}
          >
            {isPositive ? '+' : ''}{change}%
          </span>
          <span className="text-sm text-muted-foreground ml-1">vs last month</span>
        </div>
      </CardContent>
    </Card>
  );
};

export const DashboardStats = () => {
  const stats = [
    {
      title: 'Total Revenue',
      value: formatCurrency(45231.89),
      change: 12.5,
      icon: <DollarSign className="h-4 w-4" />,
    },
    {
      title: 'Orders',
      value: '1,234',
      change: 8.2,
      icon: <ShoppingCart className="h-4 w-4" />,
    },
    {
      title: 'Products',
      value: '567',
      change: -2.4,
      icon: <Package className="h-4 w-4" />,
    },
    {
      title: 'Customers',
      value: '8,492',
      change: 15.3,
      icon: <Users className="h-4 w-4" />,
    },
  ];

  return (
    <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
      {stats.map((stat) => (
        <StatCard key={stat.title} {...stat} />
      ))}
    </div>
  );
};
