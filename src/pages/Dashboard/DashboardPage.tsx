import { DashboardStats } from '@/components/dashboard/DashboardStats';
import { SalesChart } from '@/components/dashboard/SalesChart';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { OrderTable } from '@/components/orders/OrderTable';
import { Order } from '@/types/order';
import { useEffect, useState } from 'react';
import { ANALYTICS_SERVICES } from '@/api/analytics/analytics.service';
import { DashboardAnalyticsResponseDto } from '@/api/client';
import { Loader } from 'lucide-react';


const DashboardPage = () => {
  const [analytics, setAnalytics] = useState<null | DashboardAnalyticsResponseDto>(null)

  useEffect(() => {
    const fetchDashboard = async () => {
      const response = await ANALYTICS_SERVICES.getAnalytics()
      setAnalytics(response.data)
    }
    fetchDashboard()
  }, [])


  if (!analytics) return <div>
    <Loader />
  </div>
  if (analytics) return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold">Dashboard</h1>
        <p className="text-muted-foreground mt-1">
          Welcome back! Here's what's happening with your store.
        </p>
      </div>

       <DashboardStats revenue={analytics.totalRevenue} orders={analytics.totalOrders} customers={analytics.totalCustomers} products={analytics.totalProducts} />

      <div className="grid gap-6 md:grid-cols-2">
        <SalesChart data={analytics.salesOverview}/>
        
        <Card>
          <CardHeader>
            <CardTitle>Top Selling Products</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {analytics.topSellingProducts.map((product, index) => (
                <div key={index} className="flex items-center justify-between">
                  <div>
                    <p className="font-medium">{product.name}</p>
                    <p className="text-sm text-muted-foreground">{product.sold} sold</p>
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
          <OrderTable orders={analytics.recentOrders} />
        </CardContent>
      </Card>
    </div>
  );
};

export default DashboardPage;
