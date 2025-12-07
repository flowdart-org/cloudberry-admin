"use client";

import { useState, useEffect, useCallback, useRef } from "react";
import { Category } from "@/types/category.types";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { CategoryFormFields } from "@/components/categories/CategoryFormFields";
import {
  Table, TableBody, TableCell, TableHead, TableHeader, TableRow,
} from "@/components/ui/table";
import {
  Dialog, DialogContent, DialogDescription, DialogFooter,
  DialogHeader, DialogTitle,
} from "@/components/ui/dialog";
import { Plus, Search, Pencil, Loader2 } from "lucide-react";
import { toast } from "sonner";
import { CATEGORY_SERVICES } from "@/api/category/category.service";
import { Pagination } from "@/components/common/Pagination";

/* --------------------------------
   🔹 Debounce Hook (shared pattern)
-------------------------------- */
function useDebouncedValue<T>(value: T, delay = 400): T {
  const [debounced, setDebounced] = useState(value);

  useEffect(() => {
    const timer = setTimeout(() => setDebounced(value), delay);
    return () => clearTimeout(timer);
  }, [value, delay]);

  return debounced;
}

const CategoriesList = () => {
  /* ---------- State ---------- */
  const [categories, setCategories] = useState<Category[]>([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState<"active" | "inactive" | "">("");

  // Debounced Search
  const debouncedSearch = useDebouncedValue(searchQuery, 400);

  // Pagination
  const [page, setPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);
  const [totalItems, setTotalItems] = useState(0);

  // UI state
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState<Category | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [addStep, setAddStep] = useState<"basic" | "complete">("basic");
  const [newCategoryId, setNewCategoryId] = useState<string | null>(null);

  const [formData, setFormData] = useState({
    id: "",
    name: "",
    thumbnail: "",
    status: "inactive" as "active" | "inactive",
  });

  // Prevents outdated API response updating UI
  const requestRef = useRef(0);

  /* --------------------------------
     🔹 Fetch Categories (Optimized)
  -------------------------------- */
  const loadCategories = useCallback(async () => {
    setIsLoading(true);
    const requestId = ++requestRef.current;

    try {
      const response = await CATEGORY_SERVICES.getCategories(
        page,
        pageSize,
        debouncedSearch,
        statusFilter || undefined
      );

      if (requestId !== requestRef.current) return; 

      if (response.success) {
        setCategories(response.data ?? []);
        setTotalItems(response.total ?? 0);
      }
    } catch {
      toast.error("Failed to load categories");
    } finally {
      if (requestId === requestRef.current) {
        setIsLoading(false);
      }
    }
  }, [page, pageSize, debouncedSearch, statusFilter]);

  useEffect(() => {
    loadCategories();
  }, [loadCategories]);

  /* --------------------------------
     🔹 Add Category (Step 1)
  -------------------------------- */
  const handleAddCategory = async () => {
    if (!formData.name.trim()) {
      toast.error("Category name required");
      return;
    }

    setIsLoading(true);
    try {
      const res = await CATEGORY_SERVICES.addCategory({
        name: formData.name,
        thumbnail: "",
        status: "inactive",
      });

      if (res.success) {
        setNewCategoryId(res.data.id);
        setFormData(prev => ({ ...prev, id: res.data.id }));
        setAddStep("complete");
        toast.success("Category created. Continue setup.");
      }
    } finally {
      setIsLoading(false);
      loadCategories();
    }
  };

  /* --------------------------------
     🔹 Add Category (Step 2)
  -------------------------------- */
  const handleCompleteCategory = async () => {
    if (!newCategoryId) return;
    setIsLoading(true);

    try {
      await CATEGORY_SERVICES.updateCategory(newCategoryId, formData);
      toast.success("Category completed");
      closeAddDialog();
      loadCategories();
    } finally {
      setIsLoading(false);
    }
  };

  /* --------------------------------
     🔹 Edit Category
  -------------------------------- */
  const handleEditCategory = async () => {
    if (!selectedCategory) return;

    setIsLoading(true);
    try {
      await CATEGORY_SERVICES.updateCategory(selectedCategory.id, formData);
      toast.success("Updated successfully");
      closeEditDialog();
      loadCategories();
    } finally {
      setIsLoading(false);
    }
  };

  /* ---------- Utility ---------- */
  const resetForm = () => {
    setSelectedCategory(null);
    setFormData({ id: "", name: "", thumbnail: "", status: "inactive" });
    setAddStep("basic");
    setNewCategoryId(null);
  };

  const closeAddDialog = () => {
    resetForm();
    setIsAddDialogOpen(false);
  };

  const closeEditDialog = () => {
    resetForm();
    setIsEditDialogOpen(false);
  };

  const openEditDialog = (category: Category) => {
    setSelectedCategory(category);
    setFormData({
      id: category.id,
      name: category.name,
      thumbnail: category.thumbnail || "",
      status: category.status,
    });
    setIsEditDialogOpen(true);
  };

  const noResults = !isLoading && categories.length === 0;
  const totalPages = Math.max(1, Math.ceil(totalItems / pageSize));

  /* --------------------------------
             🔹 UI
  -------------------------------- */
  return (
    <div className="container mx-auto py-10 px-4 max-w-6xl">
      {/* Header */}
      <div className="flex justify-between mb-8">
        <h1 className="text-4xl font-bold">Categories</h1>
        <Button size="lg" onClick={() => setIsAddDialogOpen(true)}>
          <Plus className="mr-2 h-4 w-4" /> Add Category
        </Button>
      </div>

      {/* Search + Filters */}
      <div className="flex gap-4 mb-6">
        <div className="relative flex-1 max-w-md">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground h-4 w-4" />
          <Input
            placeholder="Search categories..."
            value={searchQuery}
            onChange={(e) => {
              setSearchQuery(e.target.value);
              setPage(1); // reset when searching
            }}
            className="pl-10"
          />
        </div>

        <select
          className="border rounded px-3 py-2"
          value={statusFilter}
          onChange={(e) => {
            setStatusFilter(e.target.value as any);
            setPage(1);
          }}
        >
          <option value="">All</option>
          <option value="active">Active</option>
          <option value="inactive">Inactive</option>
        </select>
      </div>

      {/* Table */}
      <Table className="">
        <TableHeader>
          <TableRow>
            <TableHead>Image</TableHead>
            <TableHead>Name</TableHead>
            <TableHead className="text-center">Status</TableHead>
            <TableHead className="text-right">Actions</TableHead>
          </TableRow>
        </TableHeader>

        <TableBody>
          {isLoading && (
            <TableRow className="w-full flex items-center justify-center">
              <TableCell colSpan={5} className="text-center py-8">
                <Loader2 className="animate-spin h-5 w-5" />
              </TableCell>
            </TableRow>
          )}

          {noResults && (
            <TableRow>
              <TableCell colSpan={5} className="text-center py-8 text-muted-foreground">
                No categories found.
              </TableCell>
            </TableRow>
          )}

          {!isLoading &&
            categories.map((category) => (
              <TableRow key={category.id}>
                <TableCell>
                  {category.thumbnail ? (
                    <img src={category.thumbnail} className="w-12 h-16 rounded object-cover" />
                  ) : (
                    <div className="w-12 h-16 bg-muted/40 rounded flex items-center justify-center text-xs">
                      No Image
                    </div>
                  )}
                </TableCell>

                <TableCell>{category.name}</TableCell>

                <TableCell className="text-center">
                  <Badge variant={category.status === "active" ? "default" : "outline"}>
                    {category.status}
                  </Badge>
                </TableCell>

                <TableCell className="text-right">
                  <Button size="icon" variant="ghost" onClick={() => openEditDialog(category)}>
                    <Pencil className="h-4 w-4" />
                  </Button>
                </TableCell>
              </TableRow>
            ))}
        </TableBody>
      </Table>

      {/* Pagination */}
      <div className="mt-6 flex justify-center">
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

      {/* Add Category Dialog */}
      <Dialog open={isAddDialogOpen} onOpenChange={(o) => !o && closeAddDialog()}>
        <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>
              {addStep === "basic" ? "Add New Category" : "Complete Category Setup"}
            </DialogTitle>
            <DialogDescription>
              {addStep === "basic"
                ? "Enter category details"
                : "Upload image & set status"}
            </DialogDescription>
          </DialogHeader>

          <CategoryFormFields formData={formData} setFormData={setFormData} step={addStep} />

          <DialogFooter>
            <Button variant="outline" onClick={closeAddDialog}>
              Cancel
            </Button>
            {addStep === "basic" ? (
              <Button onClick={handleAddCategory} disabled={isLoading}>
                Create
              </Button>
            ) : (
              <Button onClick={handleCompleteCategory} disabled={isLoading}>
                Complete
              </Button>
            )}
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Edit Category Dialog */}
      <Dialog open={isEditDialogOpen} onOpenChange={(o) => !o && closeEditDialog()}>
        <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>Edit Category</DialogTitle>
            <DialogDescription>Update category details</DialogDescription>
          </DialogHeader>

          <CategoryFormFields formData={formData} setFormData={setFormData} step="complete" />

          <DialogFooter>
            <Button variant="outline" onClick={closeEditDialog}>
              Cancel
            </Button>
            <Button onClick={handleEditCategory} disabled={isLoading}>
              Update
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default CategoriesList;
