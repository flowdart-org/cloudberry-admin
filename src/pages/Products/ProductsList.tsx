import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle } from "@/components/ui/alert-dialog";
import { Textarea } from "@/components/ui/textarea";
import { Switch } from "@/components/ui/switch";
import { Plus, Search, Pencil, Trash2, X } from "lucide-react";
import { toast } from "sonner";
import { Product, VariantDto } from "@/types/product.types";
import { PRODUCT_SERVICES } from "@/api/product/mock.product.service";
import { CreateProductDTO, updateProductDTO } from "@/api/product/product.dto";

export default function ProductsList() {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  const [deleteProductId, setDeleteProductId] = useState<string | null>(null);
  const [currentProduct, setCurrentProduct] = useState<Product | null>(null);
  const [formData, setFormData] = useState<{
    name: string;
    description: string;
    actualPrice: string;
    discountPercent: string;
    categoryId: string;
    status: "active" | "inactive";
    tryOn: boolean;
    tags: string[];
    variants: VariantDto[];
  }>({
    name: "",
    description: "",
    actualPrice: "",
    discountPercent: "",
    categoryId: "",
    status: "active",
    tryOn: false,
    tags: [],
    variants: [],
  });
  const [newTag, setNewTag] = useState("");
  const [newVariant, setNewVariant] = useState<VariantDto>({ size: "", stock: 0 });

  useEffect(() => {
    fetchProducts();
  }, []);

  const fetchProducts = async () => {
    try {
      setLoading(true);
      const response = await PRODUCT_SERVICES.getProducts();
      setProducts(response.data || []);
    } catch (error) {
      toast.error("Failed to fetch products");
      console.error("Error fetching products:", error);
    } finally {
      setLoading(false);
    }
  };

  const filteredProducts = products.filter((product) =>
    product.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    product.description.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const calculateDiscountPrice = (actualPrice: number, discountPercent: number) => {
    return actualPrice - (actualPrice * discountPercent / 100);
  };

  const getTotalStock = (variants: VariantDto[]) => {
    return variants.reduce((sum, variant) => sum + variant.stock, 0);
  };

  const handleAddProduct = async () => {
    if (!formData.name || !formData.description || !formData.actualPrice || !formData.categoryId) {
      toast.error("Please fill in all required fields");
      return;
    }

    if (formData.variants.length === 0) {
      toast.error("Please add at least one variant");
      return;
    }

    try {
      const productData: CreateProductDTO = {
        name: formData.name,
        description: formData.description,
        actualPrice: parseFloat(formData.actualPrice),
        discountPercent: parseFloat(formData.discountPercent) || 0,
        categoryId: parseInt(formData.categoryId),
        status: formData.status,
        tryOn: formData.tryOn,
        tags: formData.tags.length > 0 ? formData.tags : undefined,
      };

      const response = await PRODUCT_SERVICES.addProduct(productData);
      
      if (response.data) {
        // Update the product with variants
        await PRODUCT_SERVICES.updateProducts(response.data.id!, {
          variants: formData.variants,
        });
        await fetchProducts();
        setIsAddDialogOpen(false);
        resetForm();
        toast.success("Product added successfully");
      }
    } catch (error) {
      toast.error("Failed to add product");
      console.error("Error adding product:", error);
    }
  };

  const handleEditProduct = async () => {
    if (!currentProduct || !formData.name || !formData.description || !formData.actualPrice || !formData.categoryId) {
      toast.error("Please fill in all required fields");
      return;
    }

    if (formData.variants.length === 0) {
      toast.error("Please add at least one variant");
      return;
    }

    try {
      const updateData: updateProductDTO = {
        name: formData.name,
        description: formData.description,
        actualPrice: parseFloat(formData.actualPrice),
        discountPercent: parseFloat(formData.discountPercent) || 0,
        categoryId: parseInt(formData.categoryId),
        status: formData.status,
        tryOn: formData.tryOn,
        tags: formData.tags.length > 0 ? formData.tags : undefined,
        variants: formData.variants,
      };

      await PRODUCT_SERVICES.updateProducts(currentProduct.id!, updateData);
      await fetchProducts();
      setIsEditDialogOpen(false);
      setCurrentProduct(null);
      resetForm();
      toast.success("Product updated successfully");
    } catch (error) {
      toast.error("Failed to update product");
      console.error("Error updating product:", error);
    }
  };

  const handleDeleteProduct = async () => {
    if (deleteProductId) {
      try {
        await PRODUCT_SERVICES.deleteProduct(deleteProductId);
        await fetchProducts();
        setDeleteProductId(null);
        toast.success("Product deleted successfully");
      } catch (error) {
        toast.error("Failed to delete product");
        console.error("Error deleting product:", error);
      }
    }
  };

  const openEditDialog = (product: Product) => {
    setCurrentProduct(product);
    setFormData({
      name: product.name,
      description: product.description,
      actualPrice: product.actualPrice.toString(),
      discountPercent: product.discountPercent.toString(),
      categoryId: product.categoryId.toString(),
      status: product.status,
      tryOn: product.tryOn,
      tags: product.tags || [],
      variants: product.variants || [],
    });
    setIsEditDialogOpen(true);
  };

  const resetForm = () => {
    setFormData({
      name: "",
      description: "",
      actualPrice: "",
      discountPercent: "",
      categoryId: "",
      status: "active" as "active" | "inactive",
      tryOn: false,
      tags: [],
      variants: [],
    });
    setNewTag("");
    setNewVariant({ size: "", stock: 0 });
  };

  const addTag = () => {
    if (newTag.trim() && !formData.tags.includes(newTag.trim())) {
      setFormData({ ...formData, tags: [...formData.tags, newTag.trim()] });
      setNewTag("");
    }
  };

  const removeTag = (tag: string) => {
    setFormData({ ...formData, tags: formData.tags.filter((t) => t !== tag) });
  };

  const addVariant = () => {
    if (newVariant.size.trim() && newVariant.stock >= 0) {
      setFormData({ ...formData, variants: [...formData.variants, { ...newVariant }] });
      setNewVariant({ size: "", stock: 0 });
    }
  };

  const removeVariant = (index: number) => {
    setFormData({ ...formData, variants: formData.variants.filter((_, i) => i !== index) });
  };

  const ProductFormFields = () => (
    <div className="grid gap-4 py-4">
      <div className="grid gap-2">
        <Label htmlFor="name">Product Name *</Label>
        <Input
          id="name"
          value={formData.name}
          onChange={(e) => setFormData({ ...formData, name: e.target.value })}
          placeholder="Enter product name"
        />
      </div>

      <div className="grid gap-2">
        <Label htmlFor="description">Description *</Label>
        <Textarea
          id="description"
          value={formData.description}
          onChange={(e) => setFormData({ ...formData, description: e.target.value })}
          placeholder="Enter product description"
          rows={3}
        />
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div className="grid gap-2">
          <Label htmlFor="actualPrice">Actual Price *</Label>
          <Input
            id="actualPrice"
            type="number"
            step="0.01"
            value={formData.actualPrice}
            onChange={(e) => setFormData({ ...formData, actualPrice: e.target.value })}
            placeholder="0.00"
          />
        </div>
        <div className="grid gap-2">
          <Label htmlFor="discountPercent">Discount %</Label>
          <Input
            id="discountPercent"
            type="number"
            step="0.01"
            value={formData.discountPercent}
            onChange={(e) => setFormData({ ...formData, discountPercent: e.target.value })}
            placeholder="0"
          />
        </div>
      </div>

      {formData.actualPrice && formData.discountPercent && (
        <div className="rounded-md bg-muted p-3">
          <p className="text-sm text-muted-foreground">
            Discount Price: ${calculateDiscountPrice(parseFloat(formData.actualPrice), parseFloat(formData.discountPercent)).toFixed(2)}
          </p>
        </div>
      )}

      <div className="grid gap-2">
        <Label htmlFor="categoryId">Category ID *</Label>
        <Input
          id="categoryId"
          type="number"
          value={formData.categoryId}
          onChange={(e) => setFormData({ ...formData, categoryId: e.target.value })}
          placeholder="Enter category ID"
        />
      </div>

      <div className="grid gap-2">
        <Label htmlFor="status">Status</Label>
        <Select value={formData.status} onValueChange={(value: "active" | "inactive") => setFormData({ ...formData, status: value })}>
          <SelectTrigger>
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="active">Active</SelectItem>
            <SelectItem value="inactive">Inactive</SelectItem>
          </SelectContent>
        </Select>
      </div>

      <div className="flex items-center justify-between rounded-md border border-border p-3">
        <Label htmlFor="tryOn" className="cursor-pointer">Virtual Try-On</Label>
        <Switch
          id="tryOn"
          checked={formData.tryOn}
          onCheckedChange={(checked) => setFormData({ ...formData, tryOn: checked })}
        />
      </div>

      <div className="grid gap-2">
        <Label>Tags</Label>
        <div className="flex gap-2">
          <Input
            value={newTag}
            onChange={(e) => setNewTag(e.target.value)}
            onKeyPress={(e) => e.key === "Enter" && (e.preventDefault(), addTag())}
            placeholder="Add a tag"
          />
          <Button type="button" onClick={addTag} variant="outline">
            Add
          </Button>
        </div>
        {formData.tags.length > 0 && (
          <div className="flex flex-wrap gap-2 mt-2">
            {formData.tags.map((tag, index) => (
              <Badge key={index} variant="secondary" className="gap-1">
                {tag}
                <X className="h-3 w-3 cursor-pointer" onClick={() => removeTag(tag)} />
              </Badge>
            ))}
          </div>
        )}
      </div>

      <div className="grid gap-2">
        <Label>Variants *</Label>
        <div className="flex gap-2">
          <Input
            value={newVariant.size}
            onChange={(e) => setNewVariant({ ...newVariant, size: e.target.value })}
            placeholder="Size (e.g., S, M, L)"
            className="flex-1"
          />
          <Input
            type="number"
            value={newVariant.stock}
            onChange={(e) => setNewVariant({ ...newVariant, stock: parseInt(e.target.value) || 0 })}
            placeholder="Stock"
            className="w-24"
          />
          <Button type="button" onClick={addVariant} variant="outline">
            Add
          </Button>
        </div>
        {formData.variants.length > 0 && (
          <div className="mt-2 space-y-2">
            {formData.variants.map((variant, index) => (
              <div key={index} className="flex items-center justify-between rounded-md border border-border p-2">
                <span className="text-sm">
                  Size: <strong>{variant.size}</strong> - Stock: <strong>{variant.stock}</strong>
                </span>
                <Button
                  type="button"
                  variant="ghost"
                  size="sm"
                  onClick={() => removeVariant(index)}
                  className="h-6 w-6 p-0"
                >
                  <X className="h-4 w-4" />
                </Button>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );

  return (
    <div className="min-h-screen bg-background p-8">
      <div className="mx-auto max-w-7xl">
        {/* Header */}
        <div className="mb-8 flex items-start justify-between">
          <div>
            <h1 className="text-4xl font-bold text-foreground">Products</h1>
            <p className="mt-2 text-muted-foreground">Manage your product inventory</p>
          </div>
          <Button onClick={() => setIsAddDialogOpen(true)} className="bg-primary text-primary-foreground hover:bg-primary/90">
            <Plus className="mr-2 h-4 w-4" />
            Add Product
          </Button>
        </div>

        {/* Search */}
        <div className="mb-6">
          <div className="relative max-w-md">
            <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
            <Input
              placeholder="Search products..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-10"
            />
          </div>
        </div>

        {/* Table */}
        <div className="overflow-hidden rounded-lg border border-border bg-card">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="border-b border-border bg-muted/50">
                <tr>
                  <th className="px-6 py-4 text-left text-sm font-medium text-muted-foreground">Product</th>
                  <th className="px-6 py-4 text-left text-sm font-medium text-muted-foreground">Category</th>
                  <th className="px-6 py-4 text-left text-sm font-medium text-muted-foreground">Price</th>
                  <th className="px-6 py-4 text-left text-sm font-medium text-muted-foreground">Stock</th>
                  <th className="px-6 py-4 text-left text-sm font-medium text-muted-foreground">Status</th>
                  <th className="px-6 py-4 text-left text-sm font-medium text-muted-foreground">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-border">
                {loading ? (
                  <tr>
                    <td colSpan={6} className="px-6 py-8 text-center text-muted-foreground">
                      Loading products...
                    </td>
                  </tr>
                ) : filteredProducts.length === 0 ? (
                  <tr>
                    <td colSpan={6} className="px-6 py-8 text-center text-muted-foreground">
                      No products found
                    </td>
                  </tr>
                ) : (
                  filteredProducts.map((product) => (
                    <tr key={product.id} className="transition-colors hover:bg-muted/30">
                      <td className="px-6 py-4">
                        <div className="flex items-center gap-3">
                          <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-accent text-2xl">
                            📦
                          </div>
                          <div>
                            <div className="font-medium text-foreground">{product.name}</div>
                            <div className="text-sm text-muted-foreground line-clamp-1">{product.description}</div>
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-4 text-foreground">Category #{product.categoryId}</td>
                      <td className="px-6 py-4">
                        <div className="flex flex-col">
                          <span className="font-medium text-foreground">
                            ${product.discountPrice.toFixed(2)}
                          </span>
                          {product.discountPercent > 0 && (
                            <span className="text-xs text-muted-foreground line-through">
                              ${product.actualPrice.toFixed(2)}
                            </span>
                          )}
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <span className={getTotalStock(product.variants) < 10 ? "font-medium text-destructive" : "text-foreground"}>
                          {getTotalStock(product.variants)}
                        </span>
                      </td>
                      <td className="px-6 py-4">
                        <Badge variant={product.status === "active" ? "default" : "secondary"}>
                          {product.status}
                        </Badge>
                      </td>
                      <td className="px-6 py-4">
                        <div className="flex items-center gap-2">
                          <Button
                            variant="ghost"
                            size="icon"
                            onClick={() => openEditDialog(product)}
                            className="h-8 w-8"
                          >
                            <Pencil className="h-4 w-4" />
                          </Button>
                          <Button
                            variant="ghost"
                            size="icon"
                            onClick={() => setDeleteProductId(product.id!)}
                            className="h-8 w-8 text-destructive hover:text-destructive"
                          >
                            <Trash2 className="h-4 w-4" />
                          </Button>
                        </div>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>

      {/* Add Product Dialog */}
      <Dialog open={isAddDialogOpen} onOpenChange={setIsAddDialogOpen}>
        <DialogContent className="sm:max-w-[600px] max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>Add Product</DialogTitle>
            <DialogDescription>Add a new product to your inventory</DialogDescription>
          </DialogHeader>
          <ProductFormFields />
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsAddDialogOpen(false)}>
              Cancel
            </Button>
            <Button onClick={handleAddProduct}>Add Product</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Edit Product Dialog */}
      <Dialog open={isEditDialogOpen} onOpenChange={setIsEditDialogOpen}>
        <DialogContent className="sm:max-w-[600px] max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>Edit Product</DialogTitle>
            <DialogDescription>Update product information</DialogDescription>
          </DialogHeader>
          <ProductFormFields />
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsEditDialogOpen(false)}>
              Cancel
            </Button>
            <Button onClick={handleEditProduct}>Save Changes</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Delete Confirmation Dialog */}
      <AlertDialog open={deleteProductId !== null} onOpenChange={() => setDeleteProductId(null)}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Are you sure?</AlertDialogTitle>
            <AlertDialogDescription>
              This action cannot be undone. This will permanently delete the product from your inventory.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction onClick={handleDeleteProduct} className="bg-destructive text-destructive-foreground hover:bg-destructive/90">
              Delete
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}
