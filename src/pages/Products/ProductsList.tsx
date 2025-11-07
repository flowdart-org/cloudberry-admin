import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Dialog, DialogContent } from "@/components/ui/dialog";
import { Plus, Search, Pencil, Trash2 } from "lucide-react";
import { toast } from "sonner";
import { Product } from "@/types/product.types";
import { PRODUCT_SERVICES } from "@/api/product/product.service";
import { ProductForm } from "@/components/products/ProductForm";
import { ProductImageUpload } from "@/components/products/ProductImageUpload";

export default function Products() {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  const [currentProduct, setCurrentProduct] = useState<Product | null>(null);
  const [createdProductId, setCreatedProductId] = useState<string | null>(null);
  const [showImageUpload, setShowImageUpload] = useState(false);

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



  const openEditDialog = (product: Product) => {
    setCurrentProduct(product);
    setShowImageUpload(false);
    setIsEditDialogOpen(true);
  };

  const handleSuccess = async (product: Product) => {
    await fetchProducts();
    // New product created, show image upload
    setCreatedProductId(product.id || Math.random().toString());
  };

  const handleEditSuccess = async (product: Product) => {
    await fetchProducts();
    setShowImageUpload(true);
  };

  const handleCancel = () => {
    setIsAddDialogOpen(false);
    setCreatedProductId(null);
  };

  const handleImageUploadComplete = () => {
    setIsAddDialogOpen(false);
    setCreatedProductId(null);
    fetchProducts();
  };

  const handleEditImageComplete = () => {
    setShowImageUpload(false);
    setIsEditDialogOpen(false);
    setCurrentProduct(null);
    fetchProducts();
  };

  const getTotalStock = (variants: any[] = []) => {
    return variants.reduce((sum, v) => sum + (v.stock || 0), 0);
  };

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
                  <th className="px-6 py-4 text-left text-sm font-medium text-muted-foreground">Discount</th>
                  <th className="px-6 py-4 text-left text-sm font-medium text-muted-foreground">Stock</th>
                  <th className="px-6 py-4 text-left text-sm font-medium text-muted-foreground">Status</th>
                  <th className="px-6 py-4 text-left text-sm font-medium text-muted-foreground">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-border">
                {loading ? (
                  <tr>
                    <td colSpan={7} className="px-6 py-8 text-center text-muted-foreground">
                      Loading products...
                    </td>
                  </tr>
                ) : filteredProducts.length === 0 ? (
                  <tr>
                    <td colSpan={7} className="px-6 py-8 text-center text-muted-foreground">
                      No products found
                    </td>
                  </tr>
                ) : (
                  filteredProducts.map((product) => (
                    <tr key={product.id} className="transition-colors hover:bg-muted/30">
                      <td className="px-6 py-4">
                        <div className="flex items-center gap-3">
                          {product.thumbnail ? (
                            <img
                              src={product.thumbnail}
                              alt={product.name}
                              className="w-12 h-16 object-cover rounded border shadow-sm"
                            />
                          ) : (
                            <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-accent text-2xl">
                              📦
                            </div>
                          )}
                          <div>
                            <div className="font-medium text-foreground">{product.name}</div>
                            <div className="text-sm text-muted-foreground line-clamp-1">{product.description}</div>
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-4 text-foreground">{product?.category?.name || "N/A"}</td>
                      <td className="px-6 py-4">
                        <div className="flex flex-col">
                          <span className="font-medium text-foreground">
                            ${product.discountPercent > 0
                              ? ((product.price / 100) * (100 - product.discountPercent)).toFixed(2)
                              : product.price.toFixed(2)}
                          </span>
                          {product.discountPercent > 0 && (
                            <span className="text-xs text-muted-foreground line-through">
                              ${product.price.toFixed(2)}
                            </span>
                          )}
                        </div>
                      </td>
                      <td className="px-6 py-4 text-foreground">{product.discountPercent}%</td>
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
        <DialogContent className="sm:max-w-[600px] max-h-[90vh] overflow-y-auto p-0">
          {!createdProductId ? (
            <ProductForm onSuccess={handleSuccess} onCancel={handleCancel} />
          ) : (
            <ProductImageUpload
              productId={createdProductId}
              onComplete={handleImageUploadComplete}
            />
          )}
        </DialogContent>
      </Dialog>

      {/* Edit Product Dialog */}
      <Dialog open={isEditDialogOpen} onOpenChange={setIsEditDialogOpen}>
        <DialogContent className="sm:max-w-[600px] max-h-[90vh] overflow-y-auto p-0">
          {!showImageUpload ? (
            currentProduct && (
              <ProductForm
                initialData={currentProduct}
                onSuccess={handleEditSuccess}
                onCancel={() => {
                  setIsEditDialogOpen(false);
                  setCurrentProduct(null);
                }}
              />
            )
          ) : (
            <ProductImageUpload
              productId={currentProduct?.id || ""}
              existingImages={[
                ...(currentProduct?.thumbnail ? [currentProduct.thumbnail] : []),
                ...(currentProduct?.images || [])
              ]}
              onComplete={handleEditImageComplete}
            />

          )}
        </DialogContent>
      </Dialog>

    </div>
  );
}
