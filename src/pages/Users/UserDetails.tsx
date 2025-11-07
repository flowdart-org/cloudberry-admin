import { useParams, useNavigate } from 'react-router-dom';
import { ArrowLeft, Mail, Phone, Calendar, ShoppingBag, DollarSign, Package, Ban, CheckCircle } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { formatDate, formatDateTime } from '@/utils/formatDate';
import { formatCurrency } from '@/utils/currency';
import { OrderStatusBadge } from '@/components/orders/OrderStatusBadge';
import { useToast } from '@/hooks/use-toast';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from '@/components/ui/alert-dialog';
import { ExtendedUser } from '@/types/user.types';
import { useEffect, useState } from 'react';
import { USER_SERVICES } from '@/api/user/user.service';

// Mock user data
const mockUser = {
  id: '1',
  email: 'john.doe@example.com',
  firstName: 'John',
  lastName: 'Doe',
  phone: '+1 (555) 123-4567',
  role: 'customer' as const,
  status: 'active' as const,
  createdAt: '2024-01-15T10:30:00Z',
  updatedAt: '2024-11-20T15:45:00Z',
  totalOrders: 0,
  totalSpent: 0,
  averageOrderValue: 0,
  lastOrderDate: '2024-11-18T09:20:00Z',
};

const mockOrders = [
  {
    id: '1',
    orderNumber: '10234',
    date: '2024-11-18T09:20:00Z',
    total: 290.00,
    status: 'delivered' as const,
    items: 3,
  },
  // {
  //   id: '2',
  //   orderNumber: '10180',
  //   date: '2024-11-10T14:30:00Z',
  //   total: 158.50,
  //   status: 'delivered' as const,
  //   items: 2,
  // },
  // {
  //   id: '3',
  //   orderNumber: '10125',
  //   date: '2024-10-28T11:15:00Z',
  //   total: 445.99,
  //   status: 'delivered' as const,
  //   items: 5,
  // },
];

const mockActivity = [
  { id: '1', action: 'Order placed', details: 'Order #10234', timestamp: '2024-11-18T09:20:00Z' },
  // { id: '2', action: 'Profile updated', details: 'Changed phone number', timestamp: '2024-11-15T16:45:00Z' },
  // { id: '3', action: 'Order placed', details: 'Order #10180', timestamp: '2024-11-10T14:30:00Z' },
  // { id: '4', action: 'Password changed', details: 'Security update', timestamp: '2024-11-05T10:20:00Z' },
  // { id: '5', action: 'Order placed', details: 'Order #10125', timestamp: '2024-10-28T11:15:00Z' },
];

const UserDetails = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { toast } = useToast();
  const [user, setUser] = useState<ExtendedUser | null>(null)

  useEffect(() => {
    fetchUser()
  }, [])

  const fetchUser = async () =>  {
    const data = await USER_SERVICES.fetchUser(id)
    setUser(data)
  }

  const handleBlockUser = () => {
    toast({
      title: 'User blocked',
      description: 'User has been blocked successfully.',
    });
  };

  const handleUnblockUser = () => {
    toast({
      title: 'User unblocked',
      description: 'User has been unblocked successfully.',
    });
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <Button variant="ghost" size="icon" onClick={() => navigate('/users')}>
            <ArrowLeft className="h-4 w-4" />
          </Button>
          <div>
            <h1 className="text-3xl font-bold">User Details</h1>
            <p className="text-muted-foreground mt-1">
              View and manage user information
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2">
          {mockUser.status === 'active' ? (
            <AlertDialog>
              <AlertDialogTrigger asChild>
                <Button variant="destructive">
                  <Ban className="mr-2 h-4 w-4" />
                  Block User
                </Button>
              </AlertDialogTrigger>
              <AlertDialogContent>
                <AlertDialogHeader>
                  <AlertDialogTitle>Block User?</AlertDialogTitle>
                  <AlertDialogDescription>
                    This will prevent the user from accessing their account. They won't be able to place orders or sign in.
                  </AlertDialogDescription>
                </AlertDialogHeader>
                <AlertDialogFooter>
                  <AlertDialogCancel>Cancel</AlertDialogCancel>
                  <AlertDialogAction onClick={handleBlockUser}>
                    Suspend User
                  </AlertDialogAction>
                </AlertDialogFooter>
              </AlertDialogContent>
            </AlertDialog>
          ) : (
            <Button onClick={handleUnblockUser}>
              <CheckCircle className="mr-2 h-4 w-4" />
              Active User
            </Button>
          )}
        </div>
      </div>

      <div className="grid gap-6 md:grid-cols-3">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">
              Total Orders
            </CardTitle>
            <ShoppingBag className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{mockUser.totalOrders}</div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">
              Total Spent
            </CardTitle>
            <DollarSign className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{formatCurrency(mockUser.totalSpent)}</div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">
              Avg. Order Value
            </CardTitle>
            <Package className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{formatCurrency(mockUser.averageOrderValue)}</div>
          </CardContent>
        </Card>
      </div>

      <div className="grid gap-6 md:grid-cols-3">
        <Card className="md:col-span-1">
          <CardHeader>
            <CardTitle>Profile Information</CardTitle>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="flex items-center gap-4">
              <div className='flex justify-between w-full'>
                <h3 className="text-xl font-semibold">
                  {user?.name || 'Unavailable'}
                </h3>
                <Badge variant={user?.status === 'active' ? 'active' : 'destructive'}>
                  {user?.status || 'active'}
                </Badge>
              </div>
            </div>

            <div className="space-y-4">
              <div className="flex items-center gap-3 text-sm">
                <Mail className="h-4 w-4 text-muted-foreground" />
                <span>{user?.email || 'Unavailable'}</span>
              </div>
              
              <div className="flex items-center gap-3 text-sm">
                <Phone className="h-4 w-4 text-muted-foreground" />
                <span>{user?.phone || 'Unavailable'}</span>
              </div>
              
              <div className="flex items-center gap-3 text-sm">
                <Calendar className="h-4 w-4 text-muted-foreground" />
                <span>Joined {formatDate(user?.createdAt, 'long')}</span>
              </div>

              <div className="pt-4 border-t border-border">
                <div className="text-sm text-muted-foreground mb-1">Role</div>
                <Badge variant="secondary" className="capitalize">
                  {user?.role || 'user'}
                </Badge>
              </div>

              <div>
                <div className="text-sm text-muted-foreground mb-1">Last Order</div>
                <div className="text-sm">{formatDate(mockUser.lastOrderDate, 'long')}</div>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="md:col-span-2">
          <CardHeader>
            <CardTitle>Activity & Orders</CardTitle>
          </CardHeader>
          <CardContent>
            <Tabs defaultValue="orders">
              <TabsList className="grid w-full grid-cols-2">
                <TabsTrigger value="orders">Order History</TabsTrigger>
                <TabsTrigger value="activity">Activity Log</TabsTrigger>
              </TabsList>

              <TabsContent value="orders" className="mt-4">
                <div className="rounded-lg border border-border">
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>Order ID</TableHead>
                        <TableHead>Date</TableHead>
                        <TableHead>Items</TableHead>
                        <TableHead>Total</TableHead>
                        <TableHead>Status</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {mockOrders.map((order) => (
                        <TableRow key={order.id}>
                          <TableCell className="font-medium">#{order.orderNumber}</TableCell>
                          <TableCell>{formatDate(order.date)}</TableCell>
                          <TableCell>{order.items}</TableCell>
                          <TableCell>{formatCurrency(order.total)}</TableCell>
                          <TableCell>
                            <OrderStatusBadge status={order.status} />
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </div>
              </TabsContent>

              <TabsContent value="activity" className="mt-4">
                <div className="space-y-4">
                  {mockActivity.map((activity) => (
                    <div
                      key={activity.id}
                      className="flex items-start gap-4 pb-4 border-b border-border last:border-0"
                    >
                      <div className="flex-1">
                        <p className="font-medium">{activity.action}</p>
                        <p className="text-sm text-muted-foreground">{activity.details}</p>
                      </div>
                      <div className="text-sm text-muted-foreground">
                        {formatDateTime(activity.timestamp)}
                      </div>
                    </div>
                  ))}
                </div>
              </TabsContent>
            </Tabs>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default UserDetails;
