"use client";

import { useState, useEffect, useMemo } from "react";
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
import { toast } from "@/hooks/use-toast";
import { CATEGORY_SERVICES } from "@/api/category/category.service";
import { Pagination } from "@/components/common/Pagination";

export const CategoriesList = () => {
  const [categories, setCategories] = useState<Category[]>([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState<"active" | "inactive" | "">("");

  const [page, setPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);
  const [totalItems, setTotalItems] = useState(0);

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

  /* -------------------- Fetch Categories -------------------- */
  const loadCategories = async () => {
    setIsLoading(true);
    try {
      const response = await CATEGORY_SERVICES.getCategories(
        page,
        pageSize,
        searchQuery,
        statusFilter || undefined
      );

      if (response.success) {
        setCategories(response.data.items ?? response.data);
        setTotalItems(response.data.total ?? response.data.length);
      }
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to load categories.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  // Fetch whenever filters change:
  useEffect(() => {
    loadCategories();
  }, [page, pageSize, searchQuery, statusFilter]);

  /* -------------------- Add Category Step 1 -------------------- */
  const handleAddCategory = async () => {
    if (!formData.name.trim()) {
      toast({ title: "Missing Name", description: "Enter category name", variant: "destructive" });
      return;
    }

    setIsLoading(true);
    try {
      const response = await CATEGORY_SERVICES.addCategory({
        name: formData.name,
        thumbnail: "",
        status: "inactive",
      });

      if (response.success) {
        setNewCategoryId(response.data.id);
        setFormData(prev => ({ ...prev, id: response.data.id }));
        setAddStep("complete");

        toast({
          title: "Category Created",
          description: "Now upload image and set status",
        });
      }
    } catch {
      toast({ title: "Error", description: "Could not create category", variant: "destructive" });
    } finally {
      setIsLoading(false);
      loadCategories();
    }
  };

  /* -------------------- Add Category Step 2 -------------------- */
  const handleCompleteCategory = async () => {
    if (!newCategoryId) return;
    setIsLoading(true);

    try {
      const response = await CATEGORY_SERVICES.updateCategory(newCategoryId, formData);

      if (response.success) {
        toast({ title: "Success", description: "Category updated." });
        closeAddDialog();
        loadCategories();
      }
    } finally {
      setIsLoading(false);
    }
  };

  /* -------------------- Edit Category -------------------- */
  const handleEditCategory = async () => {
    if (!selectedCategory) return;

    setIsLoading(true);
    try {
      const response = await CATEGORY_SERVICES.updateCategory(selectedCategory.id, formData);

      if (response.success) {
        toast({ title: "Updated Successfully", description: "Category updated" });
        closeEditDialog();
        loadCategories();
      }
    } finally {
      setIsLoading(false);
    }
  };

  /* -------------------- Helpers -------------------- */
  const closeAddDialog = () => {
    resetForm();
    setIsAddDialogOpen(false);
  };

  const closeEditDialog = () => {
    resetForm();
    setIsEditDialogOpen(false);
  };

  const resetForm = () => {
    setFormData({ id: "", name: "", thumbnail: "", status: "inactive" });
    setSelectedCategory(null);
    setAddStep("basic");
    setNewCategoryId(null);
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


  /* -------------------- Table UI -------------------- */
  const noResults = !isLoading && categories.length === 0;

  return (
    <div className="container mx-auto py-10 px-4">
      {/* Header */}
      <div className="flex justify-between mb-8">
        <h1 className="text-4xl font-bold">Categories</h1>
        <Button onClick={() => setIsAddDialogOpen(true)} size="lg">
          <Plus className="mr-2 h-4 w-4" /> Add Category
        </Button>
      </div>

      {/* Search + Filter */}
      <div className="flex gap-4 mb-6">
        <div className="relative flex-1 max-w-md">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
          <Input
            placeholder="Search categories..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-10"
          />
        </div>
        {/* <div className="relative max-w-md">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
          <Input
            placeholder="Search categories..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-10"
          />
        </div> */}

        <select
          className="border rounded px-3 py-2"
          value={statusFilter}
          onChange={(e) => setStatusFilter(e.target.value as any)}
        >
          <option value="">All</option>
          <option value="active">Active</option>
          <option value="inactive">Inactive</option>
        </select>
      </div>

      {/* Table */}
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Image</TableHead>
            <TableHead>Name</TableHead>
            <TableHead className="text-center">Products</TableHead>
            <TableHead className="text-center">Status</TableHead>
            <TableHead className="text-right">Actions</TableHead>
          </TableRow>
        </TableHeader>

        <TableBody>
          {isLoading && (
            <TableRow>
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

                <TableCell className="text-center">{category.productCount ?? 0}</TableCell>

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

      {/* PAGINATION */}
      <div className="mt-6 flex justify-center">
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

      <Dialog open={isAddDialogOpen} onOpenChange={(open) => !open && closeAddDialog()}>
        <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>
              {addStep === "basic" ? "Add New Category" : "Complete Category Setup"}
            </DialogTitle>
            <DialogDescription>
              {addStep === "basic"
                ? "Enter basic category information"
                : "Upload category image and set status"}
            </DialogDescription>
          </DialogHeader>

          <CategoryFormFields
            formData={formData}
            setFormData={setFormData}
            step={addStep}
          />

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
                Complete Setup
              </Button>
            )}
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* EDIT CATEGORY DIALOG */}
      <Dialog open={isEditDialogOpen} onOpenChange={(open) => !open && closeEditDialog()}>
        <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>Edit Category</DialogTitle>
            <DialogDescription>Update category details</DialogDescription>
          </DialogHeader>

          <CategoryFormFields
            formData={formData}
            setFormData={setFormData}
            step="complete"
          />

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

      {/* Add + Edit Dialogs remain unchanged */}
      {/* ---- SAME AS YOUR CODE ---- */}
    </div>
  );
};
