"use client";

import { useState, useEffect, useCallback, useRef } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Dialog, DialogContent } from "@/components/ui/dialog";
import { Plus, Search, Pencil, MoreVertical, Eye } from "lucide-react";
import { toast } from "sonner";
import { Product, ProductDetails } from "@/types/product.types";
import { PRODUCT_SERVICES } from "@/api/product/product.service";
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
import { TableCell, TableHead } from "@/components/ui/table";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@radix-ui/react-dropdown-menu";
import { ROUTES } from "@/config/routes.config";
import { useNavigate } from "react-router-dom";
import { Category } from "@/types/category.types";
import { useCategoryStore } from "@/store/useCategoryStore";

function useDebouncedValue<T>(value: T, delay = 400): T {
  const [debounced, setDebounced] = useState(value);

  useEffect(() => {
    const timer = setTimeout(() => setDebounced(value), delay);
    return () => clearTimeout(timer);
  }, [value, delay]);

  return debounced;
}

export default function Products() {
  const [products, setProducts] = useState<ProductDetails[]>([]);
  // const [categories, setCategories] = useState<Category[]>([]);
  const {categories} = useCategoryStore()
  const [totalItems, setTotalItems] = useState(0);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate()

  const [searchQuery, setSearchQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [categoryFilter, setCategoryFilter] = useState("all");

  // ✅ Debounced search to avoid firing API on every keystroke
  const debouncedSearchQuery = useDebouncedValue(searchQuery, 400);

  // pagination
  const [page, setPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);

  // dialogs
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  const [currentProduct, setCurrentProduct] = useState<Product | null>(null);
  const [createdProductId, setCreatedProductId] = useState<string | null>(null);
  const [showImageUpload, setShowImageUpload] = useState(false);

  // 🔹 To prevent race conditions between multiple fetches
  const fetchIdRef = useRef(0);

  const fetchCategories = useCallback(async () => {
    // try {
    //   const res = await CATEGORY_SERVICES.getCategories();
    //   setCategories(res.data || []);
    // } catch {
    //   toast.error("Failed to load categories");
    // }
  }, []);

  const fetchProducts = useCallback(async () => {
    try {
      setLoading(true);
      const fetchId = ++fetchIdRef.current;

      const response = await PRODUCT_SERVICES.getProducts(
        page,
        pageSize,
        debouncedSearchQuery,
        statusFilter !== "all" ? (statusFilter as "active" | "inactive") : undefined
      );


      if (fetchId !== fetchIdRef.current) return;

      let filteredProducts = response.data || [];
      
      // Client-side category filter since API doesn't support it yet
      if (categoryFilter !== "all") {
        filteredProducts = filteredProducts.filter(
          (product) => product.category?.id === categoryFilter
        );
      }

      // Client-side status filter as well (in case API didn't filter)
      if (statusFilter !== "all") {
        filteredProducts = filteredProducts.filter(
          (product) => product.status === statusFilter
        );
      }

      setProducts(filteredProducts);
      setTotalItems(categoryFilter !== "all" || statusFilter !== "all" ? filteredProducts.length : response.total || 0);
    } catch (error) {
      toast.error("Failed to load products");
    } finally {
      // Only end loading if this is the latest fetch
      if (fetchIdRef.current) {
        setLoading(false);
      }
    }
  }, [page, pageSize, debouncedSearchQuery, categoryFilter, statusFilter]);

  useEffect(() => {
    fetchCategories();
  }, [fetchCategories]);

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

  const handleSuccess = (product?: Product) => {
    if (product?.id) {
      setCreatedProductId(product.id);
    }
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

  const totalPages = Math.max(1, Math.ceil(totalItems / pageSize));

  return (
    <div className="min-h-screen bg-background p-8">
      <div className="mx-auto max-w-7xl space-y-6">
        {/* HEADER */}
        <div className="flex justify-between items-center gap-4">
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
          {/* Search with debounce */}
          <div className="relative">
            <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Search..."
              className="pl-10"
              value={searchQuery}
              onChange={(e) => {
                setSearchQuery(e.target.value);
                setPage(1); // reset page when search changes
              }}
            />
          </div>

          {/* Category Filter */}
          <Select
            value={categoryFilter}
            onValueChange={(v) => {
              console.log(v, 'its v')
              setCategoryFilter(v);
              setPage(1);
            }}
          >
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

          {/* Status Filter */}
          <Select
            value={statusFilter}
            onValueChange={(v) => {
              setStatusFilter(v);
              setPage(1); // reset page on status change
            }}
          >
            <SelectTrigger>
              <SelectValue placeholder="Status" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Status</SelectItem>
              <SelectItem value="active">Active</SelectItem>
              <SelectItem value="inactive">Inactive</SelectItem>
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
                <TableHead className="p-4">Stock</TableHead>
                <TableHead className="p-4">Price</TableHead>
                <TableHead className="p-4">Discount</TableHead>
                <TableHead className="p-4 text-center">Status</TableHead>
                <TableHead className="p-4 text-right">Actions</TableHead>
              </tr>
            </thead>
            <tbody>
              {loading ? (
                <tr>
                  <td colSpan={7} className="text-center p-8 text-muted-foreground">
                    Loading...
                  </td>
                </tr>
              ) : products.length === 0 ? (
                <tr>
                  <td colSpan={7} className="text-center p-8 text-muted-foreground">
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

                    <td className="px-6 py-4 text-foreground">
                      {product?.category?.name || "N/A"}
                    </td>

                    <td className="px-6 py-4">
                      <span
                        className={
                          getTotalStock(product.variants) < 10
                            ? "font-medium text-destructive"
                            : "text-foreground"
                        }
                      >
                        {getTotalStock(product.variants)}
                      </span>
                    </td>

                    <td className="px-6 py-4">
                      <div className="flex flex-col">
                        <span className="font-medium text-foreground">
                          ₹
                          {product.discountPercent > 0
                            ? (
                                (product.price / 100) *
                                (100 - product.discountPercent)
                              ).toFixed(2)
                            : product.price.toFixed(2)}
                        </span>
                        {product.discountPercent > 0 && (
                          <span className="text-xs text-muted-foreground line-through">
                            ₹{product.price.toFixed(2)}
                          </span>
                        )}
                      </div>
                    </td>

                    <td className="px-6 py-4 text-foreground">
                      {product.discountPercent || 0}%
                    </td>

                    <td className="text-center">
                      <Badge variant={product.status === "active" ? "default" : "secondary"}>
                        {product.status}
                      </Badge>
                    </td>
                    <TableCell className="text-right">

<DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button variant="ghost" size="icon">
                          <MoreVertical className="h-4 w-4" />
                        </Button>
                      </DropdownMenuTrigger>

                      <DropdownMenuContent align="end" className="bg-white flex flex-col border">

                        <DropdownMenuItem
                          onClick={() =>
                            navigate(ROUTES.PRODUCT_DETAILS.replace(':id', product.id))
                          }
                          className="flex items-center px-4 py-3 cursor-pointer"
                        >
                          <Eye className="h-4 w-4 mr-2 " /> View Details
                        </DropdownMenuItem>
                          <DropdownMenuItem 
                           className="flex items-center px-4 py-3 cursor-pointer"
                           onClick={() => openEditDialog(product as Product)}
                          >
                            <Pencil className="h-4 w-4  mr-2" /> Edit
                          </DropdownMenuItem>
                        {/* )} */}

                      </DropdownMenuContent>
                    </DropdownMenu>
                    </TableCell>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>

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

      {/* Add Product Dialog */}
      <Dialog open={isAddDialogOpen} onOpenChange={setIsAddDialogOpen}>
        <DialogContent className="sm:max-w-[600px] max-h-[90vh] overflow-y-auto p-0">
          {!createdProductId ? (
            <ProductForm
              categories={categories}
              onSuccess={handleSuccess}
              onCancel={() => setIsAddDialogOpen(false)}
            />
          ) : (
            <ProductImageUpload
              productId={createdProductId}
              onComplete={() => {
                setIsAddDialogOpen(false);
                setCreatedProductId(null);
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
              categories={categories}
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
                ...(currentProduct?.images || []),
              ]}
              onComplete={handleEditImageComplete}
            />
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
}
