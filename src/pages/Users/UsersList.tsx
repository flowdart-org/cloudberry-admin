"use client";

import { useState, useEffect, useMemo } from "react";
import { useNavigate } from "react-router-dom";
import { Eye, Ban, CheckCircle, MoreVertical, Search } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Table, TableBody, TableCell, TableHead, TableHeader, TableRow,
} from "@/components/ui/table";
import {
  DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Pagination } from "@/components/common/Pagination";
import { ExtendedUser } from "@/types/user.types";
import { formatDate } from "@/utils/formatDate";
import { formatCurrency } from "@/utils/currency";
import { ROUTES } from "@/config/routes.config";
import { useToast } from "@/hooks/use-toast";
import { USER_SERVICES } from "@/api/user/user.service";
import { Loader2 } from "lucide-react";

export default function UsersList() {
  const navigate = useNavigate();
  const { toast } = useToast();

  const [users, setUsers] = useState<ExtendedUser[]>([]);
  const [loading, setLoading] = useState(true);

  // Filters & sorting
  const [search, setSearch] = useState("");
  const [role, setRole] = useState<"all" | "admin" | "manager" | "user">("all");
  const [status, setStatus] = useState<"all" | "active" | "suspended">("all");
  const [sortBy, setSortBy] = useState("createdAt");

  // Pagination
  const [page, setPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);
  const [totalItems, setTotalItems] = useState(0);

  // API: Load Users
  const loadUsers = async () => {
    setLoading(true);
    try {
      const response = await USER_SERVICES.fetchUsers(
        page,
        pageSize,
        search,
        status !== "all" ? status : undefined,
        sortBy
      );

      setUsers(response.data.items ?? response.data);
      setTotalItems(response.data.total ?? response.data.length);
    } catch (error) {
      toast({
        title: "Error loading users",
        description: "Could not fetch users.",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  // Fetch when dependencies change
  useEffect(() => {
    loadUsers();
  }, [page, pageSize, search, role, status, sortBy]);

  // User actions
  const blockUser = async (userId: string) => {
    // await USER_SERVICES.block(userId);
    toast({ title: "User Blocked" });
    loadUsers();
  };

  const unblockUser = async (userId: string) => {
    // await USER_SERVICES.unblock(userId);
    toast({ title: "User unblocked" });
    loadUsers();
  };

  return (
    <div className="container py-10 space-y-6">
      {/* Header */}
      <div className="flex justify-between">
        <div>
          <h1 className="text-3xl font-bold">Users</h1>
          <p className="text-muted-foreground">Manage all registered users</p>
        </div>
      </div>

      {/* Filters */}
      <div className="flex flex-col gap-4 md:flex-row">

        {/* Search */}
        <div className="relative max-w-md flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground w-4 h-4" />
          <Input
            placeholder="Search users..."
            value={search}
            onChange={(e) => {
              setSearch(e.target.value);
              setPage(1);
            }}
            className="pl-10"
          />
        </div>

        {/* Role */}
        <Select value={role} onValueChange={(v) => { setRole(v as any); setPage(1); }}>
          <SelectTrigger className="w-[140px]"><SelectValue placeholder="Role" /></SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Roles</SelectItem>
            <SelectItem value="admin">Admin</SelectItem>
            <SelectItem value="manager">Manager</SelectItem>
            <SelectItem value="user">User</SelectItem>
          </SelectContent>
        </Select>

        {/* Status */}
        <Select value={status} onValueChange={(v) => { setStatus(v as any); setPage(1); }}>
          <SelectTrigger className="w-[140px]"><SelectValue placeholder="Status" /></SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Status</SelectItem>
            <SelectItem value="active">Active</SelectItem>
            <SelectItem value="suspended">Suspend</SelectItem>
          </SelectContent>
        </Select>

        {/* Sorting */}
        <Select value={sortBy} onValueChange={(v) => setSortBy(v)}>
          <SelectTrigger className="w-[160px]"><SelectValue placeholder="Sort by" /></SelectTrigger>
          <SelectContent>
            <SelectItem value="createdAt">Newest First</SelectItem>
            <SelectItem value="name">Name (A-Z)</SelectItem>
            <SelectItem value="email">Email</SelectItem>
            <SelectItem value="totalSpent">Top Spenders</SelectItem>
            <SelectItem value="totalOrders">Most Orders</SelectItem>
          </SelectContent>
        </Select>

      </div>

      {/* Table */}
      <div className="border rounded-lg bg-card overflow-hidden">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>User</TableHead>
              <TableHead>Contact</TableHead>
              <TableHead>Role</TableHead>
              <TableHead>Orders</TableHead>
              <TableHead>Spent</TableHead>
              <TableHead>Status</TableHead>
              <TableHead>Joined</TableHead>
              <TableHead className="text-right">Actions</TableHead>
            </TableRow>
          </TableHeader>

          <TableBody>
            
            {loading ? (
              <TableRow>
                <TableCell colSpan={8} className="text-center py-10">
                  <Loader2 className="w-6 h-6 animate-spin mx-auto" />
                </TableCell>
              </TableRow>
            ) : users.length === 0 ? (
              <TableRow>
                <TableCell colSpan={8} className="text-center py-10 text-muted-foreground">
                  No users found.
                </TableCell>
              </TableRow>
            ) : (
              users.map(user => (
                <TableRow key={user.id}>
                  <TableCell className="font-medium">{user.name || "N/A"}</TableCell>
                  <TableCell>
                    <p>{user.email}</p>
                    <p className="text-muted-foreground text-sm">{user.phone}</p>
                  </TableCell>
                  <TableCell><Badge variant="outline">user</Badge></TableCell>
                  <TableCell>{user.totalOrders || 0}</TableCell>
                  <TableCell>{formatCurrency(user.totalSpent || 0)}</TableCell>
                  <TableCell>
                    <Badge variant={user.status === "active" ? "default" : "destructive"}>
                      {user.status}
                    </Badge>
                  </TableCell>
                  <TableCell>{formatDate(user.joined)}</TableCell>

                  <TableCell className="text-right">
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button variant="ghost" size="icon">
                          <MoreVertical className="h-4 w-4" />
                        </Button>
                      </DropdownMenuTrigger>

                      <DropdownMenuContent align="end">

                        <DropdownMenuItem onClick={() => navigate(ROUTES.USER_DETAILS.replace(":id", user.id))}>
                          <Eye className="h-4 w-4 mr-2" /> View Details
                        </DropdownMenuItem>

                        {user.status === "active" ? (
                          <DropdownMenuItem className="text-destructive" onClick={() => blockUser(user.id)}>
                            <Ban className="h-4 w-4 mr-2" /> Block User
                          </DropdownMenuItem>
                        ) : (
                          <DropdownMenuItem onClick={() => unblockUser(user.id)}>
                            <CheckCircle className="h-4 w-4 mr-2" /> Unblock User
                          </DropdownMenuItem>
                        )}
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </TableCell>
                </TableRow>
              ))
            )}

          </TableBody>
        </Table>

        {/* Pagination */}
        <Pagination
          currentPage={page}
          totalPages={Math.ceil(totalItems / pageSize)}
          totalItems={totalItems}
          pageSize={pageSize}
          onPageChange={setPage}
          onPageSizeChange={(size) => {
            setPageSize(size);
            setPage(1);
          }}
        />
      </div>
    </div>
  );
}
