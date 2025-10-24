import { DashboardStats } from '@/components/dashboard/DashboardStats';
import { SalesChart } from '@/components/dashboard/SalesChart';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { OrderTable } from '@/components/orders/OrderTable';
import { Order } from '@/types/order';

// Mock data for recent orders
const recentOrders: Order[] = [
  {
    id: '1',
    orderNumber: '10234',
    customerId: '1',
    customerName: 'John Doe',
    customerEmail: 'john@example.com',
    items: [],
    subtotal: 250.00,
    tax: 25.00,
    shipping: 15.00,
    total: 290.00,
    status: 'processing',
    shippingAddress: {
      street: '123 Main St',
      city: 'New York',
      state: 'NY',
      zipCode: '10001',
      country: 'USA',
    },
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  },
  {
    id: '2',
    orderNumber: '10233',
    customerId: '2',
    customerName: 'Jane Smith',
    customerEmail: 'jane@example.com',
    items: [],
    subtotal: 180.00,
    tax: 18.00,
    shipping: 10.00,
    total: 208.00,
    status: 'delivered',
    shippingAddress: {
      street: '456 Oak Ave',
      city: 'Los Angeles',
      state: 'CA',
      zipCode: '90001',
      country: 'USA',
    },
    createdAt: new Date(Date.now() - 86400000).toISOString(),
    updatedAt: new Date(Date.now() - 86400000).toISOString(),
  },
  {
    id: '3',
    orderNumber: '10232',
    customerId: '3',
    customerName: 'Bob Johnson',
    customerEmail: 'bob@example.com',
    items: [],
    subtotal: 420.00,
    tax: 42.00,
    shipping: 20.00,
    total: 482.00,
    status: 'shipped',
    shippingAddress: {
      street: '789 Pine St',
      city: 'Chicago',
      state: 'IL',
      zipCode: '60601',
      country: 'USA',
    },
    createdAt: new Date(Date.now() - 172800000).toISOString(),
    updatedAt: new Date(Date.now() - 172800000).toISOString(),
  },
];

const DashboardPage = () => {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold">Dashboard</h1>
        <p className="text-muted-foreground mt-1">
          Welcome back! Here's what's happening with your store.
        </p>
      </div>

      <DashboardStats />

      <div className="grid gap-6 md:grid-cols-2">
        <SalesChart />
        
        <Card>
          <CardHeader>
            <CardTitle>Top Selling Products</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {[
                { name: 'Wireless Headphones', sales: 234, revenue: '$23,400' },
                { name: 'Smart Watch', sales: 189, revenue: '$18,900' },
                { name: 'Laptop Stand', sales: 156, revenue: '$7,800' },
                { name: 'USB-C Cable', sales: 145, revenue: '$2,900' },
              ].map((product, index) => (
                <div key={index} className="flex items-center justify-between">
                  <div>
                    <p className="font-medium">{product.name}</p>
                    <p className="text-sm text-muted-foreground">{product.sales} sold</p>
                  </div>
                  <p className="font-semibold">{product.revenue}</p>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Recent Orders</CardTitle>
        </CardHeader>
        <CardContent>
          <OrderTable orders={recentOrders} />
        </CardContent>
      </Card>
    </div>
  );
};

export default DashboardPage;
