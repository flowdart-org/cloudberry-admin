import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Search, Plus, Eye, Ban, CheckCircle, Filter } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Pagination } from '@/components/common/Pagination';
import { User } from '@/types/user.types';
import { formatDate } from '@/utils/formatDate';
import { formatCurrency } from '@/utils/currency';
import { ROUTES } from '@/config/routes.config';
import { useToast } from '@/hooks/use-toast';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';

interface ExtendedUser extends User {
  phone?: string;
  totalOrders: number;
  totalSpent: number;
  lastOrderDate?: string;
}

// Mock data with extended user information
const mockUsers: ExtendedUser[] = Array.from({ length: 47 }, (_, i) => ({
  id: `${i + 1}`,
  email: `user${i + 1}@example.com`,
  firstName: `User`,
  lastName: `${i + 1}`,
  phone: `+1 (555) ${String(Math.floor(Math.random() * 900) + 100)}-${String(Math.floor(Math.random() * 9000) + 1000)}`,
  role: ['admin', 'manager', 'customer'][Math.floor(Math.random() * 3)] as any,
  status: Math.random() > 0.15 ? 'active' : 'inactive',
  totalOrders: Math.floor(Math.random() * 50),
  totalSpent: Math.random() * 5000,
  lastOrderDate: Math.random() > 0.2 ? new Date(Date.now() - Math.random() * 90 * 24 * 60 * 60 * 1000).toISOString() : undefined,
  createdAt: new Date(Date.now() - Math.random() * 365 * 24 * 60 * 60 * 1000).toISOString(),
  updatedAt: new Date().toISOString(),
}));

const UsersList = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const [searchQuery, setSearchQuery] = useState('');
  const [roleFilter, setRoleFilter] = useState<string>('all');
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const [sortBy, setSortBy] = useState<string>('createdAt');
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);

  // Filter and sort users
  let filteredUsers = mockUsers.filter(user => {
    const matchesSearch = 
      `${user.firstName} ${user.lastName}`.toLowerCase().includes(searchQuery.toLowerCase()) ||
      user.email.toLowerCase().includes(searchQuery.toLowerCase()) ||
      user.phone?.toLowerCase().includes(searchQuery.toLowerCase());
    
    const matchesRole = roleFilter === 'all' || user.role === roleFilter;
    const matchesStatus = statusFilter === 'all' || user.status === statusFilter;
    
    return matchesSearch && matchesRole && matchesStatus;
  });

  // Sort users
  filteredUsers = [...filteredUsers].sort((a, b) => {
    switch (sortBy) {
      case 'name':
        return `${a.firstName} ${a.lastName}`.localeCompare(`${b.firstName} ${b.lastName}`);
      case 'email':
        return a.email.localeCompare(b.email);
      case 'createdAt':
        return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();
      case 'totalSpent':
        return b.totalSpent - a.totalSpent;
      case 'totalOrders':
        return b.totalOrders - a.totalOrders;
      default:
        return 0;
    }
  });

  // Pagination
  const totalPages = Math.ceil(filteredUsers.length / pageSize);
  const paginatedUsers = filteredUsers.slice(
    (currentPage - 1) * pageSize,
    currentPage * pageSize
  );

  const handleBlockUser = (userId: string, userName: string) => {
    toast({
      title: 'User blocked',
      description: `${userName} has been blocked successfully.`,
    });
  };

  const handleUnblockUser = (userId: string, userName: string) => {
    toast({
      title: 'User unblocked',
      description: `${userName} has been unblocked successfully.`,
    });
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">Users</h1>
          <p className="text-muted-foreground mt-1">
            Manage user accounts and permissions
          </p>
        </div>
        <Button>
          <Plus className="mr-2 h-4 w-4" />
          Add User
        </Button>
      </div>

      <div className="flex flex-col gap-4 md:flex-row md:items-center">
        <div className="relative flex-1 max-w-md">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input
            type="search"
            placeholder="Search by name, email, or phone..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-10"
          />
        </div>

        <div className="flex gap-2">
          <Select value={roleFilter} onValueChange={setRoleFilter}>
            <SelectTrigger className="w-[140px]">
              <SelectValue placeholder="Role" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Roles</SelectItem>
              <SelectItem value="admin">Admin</SelectItem>
              <SelectItem value="manager">Manager</SelectItem>
              <SelectItem value="customer">Customer</SelectItem>
            </SelectContent>
          </Select>

          <Select value={statusFilter} onValueChange={setStatusFilter}>
            <SelectTrigger className="w-[140px]">
              <SelectValue placeholder="Status" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Status</SelectItem>
              <SelectItem value="active">Active</SelectItem>
              <SelectItem value="inactive">Inactive</SelectItem>
            </SelectContent>
          </Select>

          <Select value={sortBy} onValueChange={setSortBy}>
            <SelectTrigger className="w-[160px]">
              <SelectValue placeholder="Sort by" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="createdAt">Newest First</SelectItem>
              <SelectItem value="name">Name (A-Z)</SelectItem>
              <SelectItem value="email">Email (A-Z)</SelectItem>
              <SelectItem value="totalSpent">Top Buyers</SelectItem>
              <SelectItem value="totalOrders">Most Orders</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>

      <div className="rounded-lg border border-border bg-card">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>User</TableHead>
              <TableHead>Contact</TableHead>
              <TableHead>Role</TableHead>
              <TableHead>Orders</TableHead>
              <TableHead>Total Spent</TableHead>
              <TableHead>Status</TableHead>
              <TableHead>Joined</TableHead>
              <TableHead className="text-right">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {paginatedUsers.map((user) => (
              <TableRow key={user.id} className="hover:bg-card-hover">
                <TableCell>
                  <div>
                    <p className="font-medium">
                      {user.firstName} {user.lastName}
                    </p>
                    {user.totalSpent > 2000 && (
                      <Badge variant="secondary" className="mt-1 text-xs">
                        Top Buyer
                      </Badge>
                    )}
                  </div>
                </TableCell>
                <TableCell>
                  <div className="text-sm">
                    <p>{user.email}</p>
                    <p className="text-muted-foreground">{user.phone}</p>
                  </div>
                </TableCell>
                <TableCell>
                  <Badge variant="secondary" className="capitalize">
                    {user.role}
                  </Badge>
                </TableCell>
                <TableCell>
                  <span className="font-medium">{user.totalOrders}</span>
                </TableCell>
                <TableCell>
                  <span className="font-medium">{formatCurrency(user.totalSpent)}</span>
                </TableCell>
                <TableCell>
                  <Badge
                    variant={user.status === 'active' ? 'default' : 'destructive'}
                  >
                    {user.status}
                  </Badge>
                </TableCell>
                <TableCell>{formatDate(user.createdAt)}</TableCell>
                <TableCell className="text-right">
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button variant="ghost" size="icon">
                        <Filter className="h-4 w-4" />
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end" className="bg-popover">
                      <DropdownMenuItem
                        onClick={() => navigate(ROUTES.USER_DETAILS.replace(':id', user.id))}
                        className="cursor-pointer"
                      >
                        <Eye className="mr-2 h-4 w-4" />
                        View Details
                      </DropdownMenuItem>
                      {user.status === 'active' ? (
                        <DropdownMenuItem
                          onClick={() => handleBlockUser(user.id, `${user.firstName} ${user.lastName}`)}
                          className="cursor-pointer text-destructive"
                        >
                          <Ban className="mr-2 h-4 w-4" />
                          Block User
                        </DropdownMenuItem>
                      ) : (
                        <DropdownMenuItem
                          onClick={() => handleUnblockUser(user.id, `${user.firstName} ${user.lastName}`)}
                          className="cursor-pointer"
                        >
                          <CheckCircle className="mr-2 h-4 w-4" />
                          Unblock User
                        </DropdownMenuItem>
                      )}
                    </DropdownMenuContent>
                  </DropdownMenu>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>

        <Pagination
          currentPage={currentPage}
          totalPages={totalPages}
          pageSize={pageSize}
          totalItems={filteredUsers.length}
          onPageChange={setCurrentPage}
          onPageSizeChange={(size) => {
            setPageSize(size);
            setCurrentPage(1);
          }}
        />
      </div>
    </div>
  );
};

export default UsersList;
