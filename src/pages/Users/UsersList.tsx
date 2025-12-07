"use client";

import { useState, useEffect, useCallback, useRef } from "react";
import { useNavigate } from "react-router-dom";
import { Eye, Ban, CheckCircle, MoreVertical, Search, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import {
  Select, SelectContent, SelectItem, SelectTrigger, SelectValue,
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
import { ROUTES } from "@/config/routes.config";
import { useToast } from "@/hooks/use-toast";
import { USER_SERVICES } from "@/api/user/user.service";

/* ----------------------------------------------------------
   🔹 Debounced value hook (shared pattern across your pages)
---------------------------------------------------------- */
function useDebouncedValue<T>(value: T, delay = 400): T {
  const [debounced, setDebounced] = useState(value);

  useEffect(() => {
    const timer = setTimeout(() => setDebounced(value), delay);
    return () => clearTimeout(timer);
  }, [value, delay]);

  return debounced;
}

export default function UsersList() {
  const navigate = useNavigate();
  const { toast } = useToast();

  const [users, setUsers] = useState<ExtendedUser[]>([]);
  const [loading, setLoading] = useState(true);

  // Filters
  const [search, setSearch] = useState("");
  const [role, setRole] = useState<"all" | "user">("all");
  const [status, setStatus] = useState<"all" | "active" | "suspended">("all");

  // Debounced Search (prevents spam API calls)
  const debouncedSearch = useDebouncedValue(search, 400);

  // Pagination
  const [page, setPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);
  const [totalItems, setTotalItems] = useState(0);

  // Prevent stale request overwriting latest state
  const fetchIdRef = useRef(0);

  /* ----------------------------------------------
     🔹 Fetch Users (Optimized with debounce + guard)
  ---------------------------------------------- */
  const loadUsers = useCallback(async () => {
    setLoading(true);

    const fetchId = ++fetchIdRef.current;

    try {
      const response = await USER_SERVICES.fetchUsers(
        page,
        pageSize,
        debouncedSearch,
        status !== "all" ? status : undefined,
      );

      if (fetchId !== fetchIdRef.current) return; // skip stale response

      setUsers(response.data || []);
      setTotalItems(response.total || 0);
    } catch {
      toast({
        title: "Error",
        description: "Failed to load users.",
        variant: "destructive",
      });
    } finally {
      if (fetchId === fetchIdRef.current) setLoading(false);
    }
  }, [page, pageSize, debouncedSearch, status]);

  useEffect(() => {
    loadUsers();
  }, [loadUsers]);

  /* ----------------------------------------------
     🔹 User Actions
  ---------------------------------------------- */
  const blockUser = async (id: string) => {
    toast({ title: "User Blocked" });
    loadUsers();
  };

  const unblockUser = async (id: string) => {
    toast({ title: "User Unblocked" });
    loadUsers();
  };

  const totalPages = Math.max(1, Math.ceil(totalItems / pageSize));

  return (
    <div className="container py-10 space-y-6 max-w-7xl">
      
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

        {/* Role Filter */}
        <Select value={role} onValueChange={(v) => {
          setRole(v as any);
          setPage(1);
        }}>
          <SelectTrigger className="w-[140px]">
            <SelectValue placeholder="Role" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Roles</SelectItem>
            <SelectItem value="user">User</SelectItem>
          </SelectContent>
        </Select>

        {/* Status Filter */}
        <Select value={status} onValueChange={(v) => {
          setStatus(v as any);
          setPage(1);
        }}>
          <SelectTrigger className="w-[140px]">
            <SelectValue placeholder="Status" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Status</SelectItem>
            <SelectItem value="active">Active</SelectItem>
            <SelectItem value="suspended">Suspended</SelectItem>
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
              <TableHead>Status</TableHead>
              <TableHead>Joined</TableHead>
              <TableHead className="text-right">Actions</TableHead>
            </TableRow>
          </TableHeader>

          <TableBody>

            {/* Loading */}
            {loading && (
              <TableRow>
                <TableCell colSpan={6} className="py-10 text-center">
                  <Loader2 className="w-6 h-6 animate-spin mx-auto" />
                </TableCell>
              </TableRow>
            )}

            {/* Empty State */}
            {!loading && users.length === 0 && (
              <TableRow>
                <TableCell colSpan={6} className="py-10 text-center text-muted-foreground">
                  No users found.
                </TableCell>
              </TableRow>
            )}

            {/* Users */}
            {!loading &&
              users.map((user) => (
                <TableRow key={user.id}>
                  
                  <TableCell className="font-medium">{user.name || "N/A"}</TableCell>

                  <TableCell>
                    {user.email}
                    <p className="text-sm text-muted-foreground">{user.phone}</p>
                  </TableCell>

                  <TableCell>
                    <Badge variant="outline">user</Badge>
                  </TableCell>

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

                        <DropdownMenuItem
                          onClick={() =>
                            navigate(ROUTES.USER_DETAILS.replace(":id", user.id))
                          }
                        >
                          <Eye className="h-4 w-4 mr-2" /> View Details
                        </DropdownMenuItem>

                        {user.status === "active" ? (
                          <DropdownMenuItem
                            className="text-destructive"
                            onClick={() => blockUser(user.id)}
                          >
                            <Ban className="h-4 w-4 mr-2" /> Block
                          </DropdownMenuItem>
                        ) : (
                          <DropdownMenuItem onClick={() => unblockUser(user.id)}>
                            <CheckCircle className="h-4 w-4 mr-2" /> Unblock
                          </DropdownMenuItem>
                        )}

                      </DropdownMenuContent>
                    </DropdownMenu>
                  </TableCell>
                </TableRow>
              ))}
          </TableBody>
        </Table>

        {/* Pagination */}
        <Pagination
          currentPage={page}
          totalPages={totalPages}
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
