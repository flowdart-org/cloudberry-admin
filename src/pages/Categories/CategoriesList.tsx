import { useState, useEffect } from "react";
import { Category } from "@/types/category.types";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { CategoryFormFields } from "@/components/categories/CategoryFormFields";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { Plus, Search, Pencil, Trash2 } from "lucide-react";
import { toast } from "@/hooks/use-toast";
import { CATEGORY_SERVICES } from "@/api/category/category.service";
import { ComingSoonDialog } from "@/components/common/ComingSoonDialog";

export const CategoriesList = () => {
  const [categories, setCategories] = useState<Category[]>([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState<Category | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [addStep, setAddStep] = useState<"basic" | "complete">("basic");
  const [newCategoryId, setNewCategoryId] = useState<string | null>(null);
  const [showComingSoon, setShowComingSoon] = useState(false);

  const [formData, setFormData] = useState({
    name: "",
    thumbnail: "",
    description: "",
    status: "inactive" as "active" | "inactive",
  });

  useEffect(() => {
    loadCategories();
  }, []);

  const loadCategories = async () => {
    try {
      setIsLoading(true);
      const response = await CATEGORY_SERVICES.getCategories();
      if (response.success) {
        setCategories(response.data);
      }
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to load categories",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleAddCategory = async () => {
    if (addStep === "basic") {
      if (!formData.name) {
        toast({
          title: "Error",
          description: "Please enter category name",
          variant: "destructive",
        });
        return;
      }

      try {
        setIsLoading(true);
        const categoryData = {
          name: formData.name,
          description: "",
          thumbnail: "",
          status: "inactive" as "active" | "inactive"
        };
        const response = await CATEGORY_SERVICES.addCategory(categoryData);
        setNewCategoryId(response.data.id);
        setCategories([...categories, response.data]);
        setAddStep("complete");
        toast({
          title: "Success",
          description: "Category created. Now you can add an image and set status.",
        });
      } catch (error) {
        toast({
          title: "Error",
          description: "Failed to create category",
          variant: "destructive",
        });
      } finally {
        setIsLoading(false);
      }
    }
  };

  const handleUpdateCategoryImage = async () => {
    if (!newCategoryId) return;

    try {
      setIsLoading(true);

      // Update name, image and status
      const updates: any = {
        name: formData.name,
        status: formData.status
      };

      if (formData.thumbnail) {
        await CATEGORY_SERVICES.updateCategoryImage(newCategoryId, formData.thumbnail);
      }

      await CATEGORY_SERVICES.updateCategory(newCategoryId, updates);

      // Refresh categories
      await loadCategories();

      setIsAddDialogOpen(false);
      resetForm();
      setAddStep("basic");
      setNewCategoryId(null);

      toast({
        title: "Success",
        description: "Category updated successfully",
      });
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to update category",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleEditCategory = async () => {
    if (!selectedCategory) return;

    try {
      setIsLoading(true);

      // Update image if provided
      if (formData.thumbnail && formData.thumbnail !== selectedCategory.thumbnail) {
        await CATEGORY_SERVICES.updateCategoryImage(selectedCategory.id, formData.thumbnail);
      }

      // Update name and status
      const response = await CATEGORY_SERVICES.updateCategory(
        selectedCategory.id,
        {
          name: formData.name,
          status: formData.status
        }
      );

      setCategories(
        categories.map((cat) =>
          cat.id === selectedCategory.id ? response.data : cat
        )
      );
      setIsEditDialogOpen(false);
      resetForm();
      toast({
        title: "Success",
        description: "Category updated successfully",
      });
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to update category",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleDeleteCategory = async () => {
    // Coming soon functionality
    setShowComingSoon(true);
  };

  const openEditDialog = (category: Category) => {
    setSelectedCategory(category);
    setFormData({
      name: category.name,
      thumbnail: category.thumbnail || "",
      description: category.description,
      status: category.status,
    });
    setIsEditDialogOpen(true);
  };

  const openDeleteDialog = (category: Category) => {
    setSelectedCategory(category);
    setShowComingSoon(true);
  };

  const resetForm = () => {
    setFormData({
      name: "",
      thumbnail: "",
      description: "",
      status: "inactive",
    });
    setSelectedCategory(null);
    setAddStep("basic");
    setNewCategoryId(null);
  };

  const filteredCategories = categories.filter((category) =>
    category.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    category.description.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="container mx-auto py-10 px-4">
      <div className="flex justify-between items-start mb-8">
        <div>
          <h1 className="text-4xl font-bold mb-2">Categories</h1>
          <p className="text-muted-foreground">
            Organize your products into categories
          </p>
        </div>
        <Button onClick={() => setIsAddDialogOpen(true)} size="lg">
          <Plus className="mr-2 h-4 w-4" />
          Add Category
        </Button>
      </div>

      <div className="mb-6">
        <div className="relative max-w-md">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
          <Input
            placeholder="Search categories..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-10"
          />
        </div>
      </div>

      <div className="border rounded-lg">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead className="">Image</TableHead>
              <TableHead className="">Name</TableHead>
              <TableHead className="text-center">Products</TableHead>
              <TableHead className="text-center">Status</TableHead>
              <TableHead className="text-right">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {isLoading ? (
              <TableRow>
                <TableCell colSpan={5} className="text-center py-8">
                  Loading...
                </TableCell>
              </TableRow>
            ) : filteredCategories.length === 0 ? (
              <TableRow>
                <TableCell colSpan={5} className="text-center py-8">
                  No categories found
                </TableCell>
              </TableRow>
            ) : (
              filteredCategories.map((category) => (
                <TableRow key={category.id}>
                  <TableCell>
                    {category.thumbnail ? (
                      <img
                        src={category.thumbnail}
                        alt={category.name}
                        className="w-12 h-16 object-cover rounded border shadow-sm"
                      />
                    ) : (
                      <div className="w-12 h-16 bg-muted/50 rounded flex items-center justify-center text-xs text-muted-foreground border">
                        No image
                      </div>
                    )}
                  </TableCell>
                  <TableCell className="font-medium">{category.name}</TableCell>
                  <TableCell className="text-center">{category.productCount || 0}</TableCell>
                  <TableCell className="text-center">
                    <Badge
                      variant={category.status === "active" ? "default" : "secondary"}
                      className={`inline-flex ${category.status === "active"
                        ? "bg-green-100 text-green-800"
                        : "bg-gray-200 text-gray-800"
                        }`}
                    >
                      {category.status.charAt(0).toUpperCase() + category.status.slice(1)}
                    </Badge>
                  </TableCell>


                  <TableCell className="text-right">
                    <div className="flex justify-end gap-2">
                      <Button
                        variant="ghost"
                        size="icon"
                        onClick={() => openEditDialog(category)}
                      >
                        <Pencil className="h-4 w-4" />
                      </Button>
                      <Button
                        variant="ghost"
                        size="icon"
                        onClick={() => openDeleteDialog(category)}
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                  </TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </div>

      {/* Add Category Dialog */}
      <Dialog open={isAddDialogOpen} onOpenChange={(open) => {
        if (!open) {
          resetForm();
        }
        setIsAddDialogOpen(open);
      }}>
        <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>
              {addStep === "basic" ? "Add New Category" : "Complete Category Setup"}
            </DialogTitle>
            <DialogDescription>
              {addStep === "basic"
                ? "Enter basic category information"
                : "Add category image and set status"}
            </DialogDescription>
          </DialogHeader>
          <CategoryFormFields
            formData={formData}
            setFormData={setFormData}
            step={addStep}
          />
          <DialogFooter>
            <Button
              variant="outline"
              onClick={() => {
                setIsAddDialogOpen(false);
                resetForm();
              }}
            >
              Cancel
            </Button>
            {addStep === "basic" ? (
              <Button onClick={handleAddCategory} disabled={isLoading}>
                Create Category
              </Button>
            ) : (
              <Button onClick={handleUpdateCategoryImage} disabled={isLoading}>
                Save Changes
              </Button>
            )}
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Edit Category Dialog */}
      <Dialog open={isEditDialogOpen} onOpenChange={setIsEditDialogOpen}>
        <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>Edit Category</DialogTitle>
            <DialogDescription>
              Update category information and manage status
            </DialogDescription>
          </DialogHeader>
          <CategoryFormFields
            formData={formData}
            setFormData={setFormData}
            step="complete"
          />
          <DialogFooter>
            <Button
              variant="outline"
              onClick={() => {
                setIsEditDialogOpen(false);
                resetForm();
              }}
            >
              Cancel
            </Button>
            <Button onClick={handleEditCategory} disabled={isLoading}>
              Update Category
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Delete Confirmation Dialog */}
      <AlertDialog open={isDeleteDialogOpen} onOpenChange={setIsDeleteDialogOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Are you sure?</AlertDialogTitle>
            <AlertDialogDescription>
              This will permanently delete the category "{selectedCategory?.name}".
              This action cannot be undone.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel onClick={() => setSelectedCategory(null)}>
              Cancel
            </AlertDialogCancel>
            <AlertDialogAction onClick={handleDeleteCategory} disabled={isLoading}>
              Delete
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>

      <ComingSoonDialog
              open={showComingSoon}
              onOpenChange={setShowComingSoon}
            />
    </div>
  );
};
