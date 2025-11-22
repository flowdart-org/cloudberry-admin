"use client";

import { useState, useEffect, useCallback } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Dialog, DialogContent } from "@/components/ui/dialog";
import { Plus, Search, Pencil } from "lucide-react";
import { toast } from "sonner";
import { Product } from "@/types/product.types";
import { PRODUCT_SERVICES } from "@/api/product/product.service";
import { CATEGORY_SERVICES } from "@/api/category/category.service";
import { ProductForm } from "@/components/products/ProductForm";
import { ProductImageUpload } from "@/components/products/ProductImageUpload";
import { Pagination } from "@/components/common/Pagination";
import {
  Select,
  SelectTrigger,
  SelectValue,
  SelectContent,
  SelectItem,
} from "@/components/ui/select";
import { TableHead } from "@/components/ui/table";

export default function Products() {
  const [products, setProducts] = useState<Product[]>([]);
  const [categories, setCategories] = useState<{ id: string; name: string }[]>([]);
  const [totalItems, setTotalItems] = useState(0);
  const [loading, setLoading] = useState(true);

  // filters
  const [searchQuery, setSearchQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [categoryFilter, setCategoryFilter] = useState("all");
  const [sortBy, setSortBy] = useState("newest");

  // pagination
  const [page, setPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);

  // dialogs
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  const [currentProduct, setCurrentProduct] = useState<Product | null>(null);
  const [createdProductId, setCreatedProductId] = useState<string | null>(null);
  const [showImageUpload, setShowImageUpload] = useState(false);

  // Fetch categories for the filter dropdown
  const fetchCategories = async () => {
    try {
      const res = await CATEGORY_SERVICES.getCategories( 1);
      setCategories(res.data || []);
    } catch {
      toast.error("Failed to load categories");
    }
  };

  const fetchProducts = useCallback(async () => {
    try {
      setLoading(true);

      const response = await PRODUCT_SERVICES.getProducts(
        page,
        pageSize,
        searchQuery,
        statusFilter !== "all" ? statusFilter : undefined,
        categoryFilter !== "all" ? categoryFilter : undefined,
        sortBy
      );

      setProducts(response.data || []);
      setTotalItems(response.total || 0);
    } catch (error) {
      toast.error("Failed to load products");
    } finally {
      setLoading(false);
    }
  }, [page, pageSize, searchQuery, categoryFilter, statusFilter, sortBy]);

  
  useEffect(() => {
    fetchCategories();
  }, [])

  useEffect(() => {
    fetchProducts();
  }, [fetchProducts]);

  const getTotalStock = (variants: any[] = []) =>
    variants.reduce((sum, v) => sum + (v.stock || 0), 0);

  const openEditDialog = (product: Product) => {
    setCurrentProduct(product);
    setShowImageUpload(false);
    setIsEditDialogOpen(true);
  };

  const handleSuccess = (product: Product) => {
    setCreatedProductId(product.id);
    fetchProducts();
  };

  const handleEditSuccess = () => {
    setShowImageUpload(true);
    fetchProducts();
  };

  const handleEditImageComplete = () => {
    setShowImageUpload(false);
    setIsEditDialogOpen(false);
    setCurrentProduct(null);
    fetchProducts();
  };

  return (
    <div className="min-h-screen bg-background p-8">
      <div className="mx-auto max-w-7xl space-y-6">

        {/* HEADER */}
        <div className="flex justify-between">
          <div>
            <h1 className="text-3xl font-bold">Products</h1>
            <p className="text-muted-foreground">Manage your inventory</p>
          </div>
          <Button onClick={() => setIsAddDialogOpen(true)}>
            <Plus className="mr-2 h-4 w-4" /> Add Product
          </Button>
        </div>

        {/* FILTER BAR */}
        <div className="grid gap-4 grid-cols-1 sm:grid-cols-4">
          
          <div className="relative">
            <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Search..."
              className="pl-10"
              value={searchQuery}
              onChange={(e) => {
                setSearchQuery(e.target.value);
                setPage(1);
              }}
            />
          </div>

          <Select value={categoryFilter} onValueChange={(v) => setCategoryFilter(v)}>
            <SelectTrigger>
              <SelectValue placeholder="Category" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Categories</SelectItem>
              {categories.map((c) => (
                <SelectItem key={c.id} value={c.id}>
                  {c.name}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>

          <Select value={statusFilter} onValueChange={setStatusFilter}>
            <SelectTrigger>
              <SelectValue placeholder="Status" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Status</SelectItem>
              <SelectItem value="active">Active</SelectItem>
              <SelectItem value="inactive">Inactive</SelectItem>
            </SelectContent>
          </Select>

          <Select value={sortBy} onValueChange={setSortBy}>
            <SelectTrigger>
              <SelectValue placeholder="Sort by" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="newest">Newest</SelectItem>
              <SelectItem value="price_low">Price: Low → High</SelectItem>
              <SelectItem value="price_high">Price: High → Low</SelectItem>
              <SelectItem value="stock">Stock Level</SelectItem>
            </SelectContent>
          </Select>
        </div>

        {/* TABLE */}
        <div className="overflow-hidden border rounded-lg">
          <table className="w-full">
            <thead className="bg-muted/50">
              <tr>
                <TableHead className="p-4">Product</TableHead>
                <TableHead className="p-4">Category</TableHead>
                <TableHead className="p-4">Price</TableHead>
                <TableHead className="p-4">Stock</TableHead>
                <TableHead className="p-4">Discount</TableHead>
                <TableHead className="p-4">Status</TableHead>
                <TableHead className="p-4 text-right">Actions</TableHead>
              </tr>
            </thead>
            <tbody>
              {loading ? (
                <tr>
                  <td colSpan={6} className="text-center p-8 text-muted-foreground">
                    Loading...
                  </td>
                </tr>
              ) : products.length === 0 ? (
                <tr>
                  <td colSpan={6} className="text-center p-8 text-muted-foreground">
                    No products found
                  </td>
                </tr>
              ) : (
                products.map((product) => (
                  <tr key={product.id} className="border-t hover:bg-muted/20">
                    <td className="p-4 flex items-center gap-3">
                      <img
                        src={product.thumbnail}
                        alt={product.name}
                        className="w-12 h-16 object-cover rounded border"
                      />
                      <div>
                        <p className="font-medium">{product.name}</p>
                        <p className="text-xs text-muted-foreground line-clamp-1">
                          {product.description}
                        </p>
                      </div>
                    </td>

                   <td className="px-6 py-4 text-foreground">{product?.category?.name || "N/A"}</td>
                      <td className="px-6 py-4">
                        <span className={getTotalStock(product.variants) < 10 ? "font-medium text-destructive" : "text-foreground"}>
                          {getTotalStock(product.variants)}
                        </span>
                      </td>
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
                      <td className="px-6 py-4 text-foreground">{product.discountPercent || 0}%</td>

                    <td className="text-center">
                      <Badge variant={product.status === "active" ? "default" : "secondary"}>
                        {product.status}
                      </Badge>
                    </td>

                    <td className="text-right p-4">
                      <Button variant="ghost" size="icon" onClick={() => openEditDialog(product)}>
                        <Pencil className="h-4 w-4" />
                      </Button>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>

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

      {/* Add Product Dialog */}
      <Dialog open={isAddDialogOpen} onOpenChange={setIsAddDialogOpen}>
        <DialogContent className="sm:max-w-[600px] max-h-[90vh] overflow-y-auto p-0">
          {!createdProductId ? (
            <ProductForm onSuccess={handleSuccess} onCancel={() => setIsAddDialogOpen(false)}/>
          ) : (
            <ProductImageUpload
              productId={createdProductId}
              onComplete={() => {
              setIsAddDialogOpen(false);
              fetchProducts();
            }}
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
