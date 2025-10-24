import { useState } from 'react';
import { Search } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { OrderTable } from '@/components/orders/OrderTable';
import { Order } from '@/types/order';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';

// Mock data
const mockOrders: Order[] = Array.from({ length: 10 }, (_, i) => ({
  id: `${i + 1}`,
  orderNumber: `${10240 - i}`,
  customerId: `${i + 1}`,
  customerName: `Customer ${i + 1}`,
  customerEmail: `customer${i + 1}@example.com`,
  items: [],
  subtotal: Math.random() * 500 + 100,
  tax: 0,
  shipping: 15,
  total: Math.random() * 500 + 115,
  status: ['pending', 'processing', 'shipped', 'delivered', 'cancelled'][
    Math.floor(Math.random() * 5)
  ] as any,
  shippingAddress: {
    street: '123 Main St',
    city: 'New York',
    state: 'NY',
    zipCode: '10001',
    country: 'USA',
  },
  createdAt: new Date(Date.now() - Math.random() * 7 * 24 * 60 * 60 * 1000).toISOString(),
  updatedAt: new Date().toISOString(),
}));

const OrdersList = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const [orders] = useState<Order[]>(mockOrders);

  const filteredOrders = orders.filter(order => {
    const matchesSearch = 
      order.orderNumber.includes(searchQuery) ||
      order.customerName.toLowerCase().includes(searchQuery.toLowerCase());
    
    const matchesStatus = statusFilter === 'all' || order.status === statusFilter;
    
    return matchesSearch && matchesStatus;
  });

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold">Orders</h1>
        <p className="text-muted-foreground mt-1">
          Track and manage customer orders
        </p>
      </div>

      <div className="flex items-center gap-4">
        <div className="relative flex-1 max-w-md">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input
            type="search"
            placeholder="Search orders..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-10"
          />
        </div>
        
        <Select value={statusFilter} onValueChange={setStatusFilter}>
          <SelectTrigger className="w-[180px]">
            <SelectValue placeholder="Filter by status" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Status</SelectItem>
            <SelectItem value="pending">Pending</SelectItem>
            <SelectItem value="processing">Processing</SelectItem>
            <SelectItem value="shipped">Shipped</SelectItem>
            <SelectItem value="delivered">Delivered</SelectItem>
            <SelectItem value="cancelled">Cancelled</SelectItem>
          </SelectContent>
        </Select>
      </div>

      <OrderTable orders={filteredOrders} />
    </div>
  );
};

export default OrdersList;
