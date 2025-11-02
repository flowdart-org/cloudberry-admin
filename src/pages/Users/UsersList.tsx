import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Eye, Ban, CheckCircle, MoreVertical, Search } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { Pagination } from '@/components/common/Pagination';
import { ExtendedUser } from '@/types/user.types';
import { formatDate } from '@/utils/formatDate';
import { formatCurrency } from '@/utils/currency';
import { ROUTES } from '@/config/routes.config';
import { useToast } from '@/hooks/use-toast';
import { USER_SERVICES } from '@/api/user/user.service';

const UsersList = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const [users, setUsers] = useState<ExtendedUser[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [roleFilter, setRoleFilter] = useState<string>('all');
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const [sortBy, setSortBy] = useState<string>('createdAt');
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);

  useEffect(() => {
    loadUsers();
  }, []);

  const loadUsers = async () => {
    try {
      setLoading(true);
      const response = await USER_SERVICES.fetchUsers();
      setUsers(response.data);
    } catch (error) {
      toast({
        title: 'Error',
        description: 'Failed to load users',
        variant: 'destructive',
      });
    } finally {
      setLoading(false);
    }
  };

  // Filter and sort users
  let filteredUsers = users.filter((user) => {
    const matchesSearch =
      user.name?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      user.email?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      user.phone?.toLowerCase().includes(searchQuery.toLowerCase());

    const matchesRole = roleFilter === 'all' || user.role === roleFilter;
    const matchesStatus = statusFilter === 'all' || user.status === statusFilter;

    return matchesSearch && matchesRole && matchesStatus;
  });

  // Sort users
  filteredUsers = [...filteredUsers].sort((a, b) => {
    switch (sortBy) {
      case 'name':
        return (a.name || '').localeCompare(b.name || '');
      case 'email':
        return (a.email || '').localeCompare(b.email || '');
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

  const handleBlockUser = async (userId: string, userName: string) => {
    // try {
    //   await USER_SERVICES.blockUser(userId);
    //   await loadUsers();
    //   toast({
    //     title: 'User blocked',
    //     description: `${userName} has been blocked successfully.`,
    //   });
    // } catch (error) {
    //   toast({
    //     title: 'Error',
    //     description: 'Failed to block user',
    //     variant: 'destructive',
    //   });
    // }
  };

  const handleUnblockUser = async (userId: string, userName: string) => {
    // try {
    //   await USER_SERVICES.unblockUser(userId);
    //   await loadUsers();
    //   toast({
    //     title: 'User unblocked',
    //     description: `${userName} has been unblocked successfully.`,
    //   });
    // } catch (error) {
    //   toast({
    //     title: 'Error',
    //     description: 'Failed to unblock user',
    //     variant: 'destructive',
    //   });
    // }
  };

  if (loading) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <div className="text-center">
          <div className="h-8 w-8 animate-spin rounded-full border-4 border-primary border-t-transparent"></div>
          <p className="mt-2 text-muted-foreground">Loading users...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background p-6">
      <div className="mx-auto max-w-7xl space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-foreground">Users</h1>
            <p className="mt-1 text-muted-foreground">
              Manage user accounts and permissions
            </p>
          </div>
        </div>

        <div className="flex flex-col gap-4 md:flex-row md:items-center">
          <div className="relative max-w-md flex-1">
            <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
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
                <SelectItem value="user">User</SelectItem>
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

        <div className="overflow-hidden rounded-lg border border-border bg-card">
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
                <TableRow key={user?.id} className="hover:bg-card-hover">
                  <TableCell>
                    <div>
                      <p className="font-medium">{user?.name || 'Unavailable'}</p>
                      {user?.totalSpent > 2000 && (
                        <Badge variant="secondary" className="mt-1 text-xs">
                          Top Buyer
                        </Badge>
                      )}
                    </div>
                  </TableCell>
                  <TableCell>
                    <div className="text-sm">
                      <p>{user?.email}</p>
                      <p className="text-muted-foreground">{user?.phone || 'Unavailable'}</p>
                    </div>
                  </TableCell>
                  <TableCell>
                    <Badge variant="secondary" className="capitalize">
                      user
                    </Badge>
                  </TableCell>
                  <TableCell>
                    <span className="font-medium">{user?.totalOrders || 0}</span>
                  </TableCell>
                  <TableCell>
                    <span className="font-medium">
                      {formatCurrency(user?.totalSpent || 0)}
                    </span>
                  </TableCell>
                  <TableCell>
                    <Badge
                      variant={user?.status === 'active' ? 'default' : 'destructive'}
                    >
                      {user?.status }
                    </Badge>
                  </TableCell>
                  <TableCell>{formatDate(user?.createdAt)}</TableCell>
                  <TableCell className="text-right">
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button variant="ghost" size="icon">
                          <MoreVertical className="h-4 w-4" />
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end" className="bg-popover">
                        <DropdownMenuItem
                          onClick={() =>
                            navigate(ROUTES.USER_DETAILS.replace(':id', user?.id))
                          }
                          className="cursor-pointer"
                        >
                          <Eye className="mr-2 h-4 w-4" />
                          View Details
                        </DropdownMenuItem>
                        {user?.status === 'active' ? (
                          <DropdownMenuItem
                            onClick={() =>
                              handleBlockUser(user?.id, user?.name || 'User')
                            }
                            className="cursor-pointer text-destructive"
                          >
                            <Ban className="mr-2 h-4 w-4" />
                            Block User
                          </DropdownMenuItem>
                        ) : (
                          <DropdownMenuItem
                            onClick={() =>
                              handleUnblockUser(user?.id, user?.name || 'User')
                            }
                            className="cursor-pointer"
                          >
                            <CheckCircle className="mr-2 h-4 w-4" />
                            Suspend User
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
    </div>
  );
};

export default UsersList;
