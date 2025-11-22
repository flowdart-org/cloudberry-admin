import { useState, useEffect } from "react";
import { ProductFormFields } from "./ProductFormFields";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Product, ProductDetails, VariantDto } from "@/types/product.types";
import { toast } from "sonner";
import { Loader2 } from "lucide-react";
import { CATEGORY_SERVICES } from "@/api/category/category.service";
import { PRODUCT_SERVICES } from "@/api/product/product.service";
import { Category } from "@/types/category.types";

interface ProductFormProps {
  initialData?: ProductDetails;
  onSuccess?: (product: Product) => void;
  onCancel?: () => void;
}

export const ProductForm = ({ initialData, onSuccess, onCancel }: ProductFormProps) => {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [categories, setCategories] = useState<Category[]>([]);

  const [formData, setFormData] = useState({
    name: initialData?.name || "",
    description: initialData?.description || "",
    price: initialData?.price || 0,
    discountPercent: initialData?.discountPercent || 0,
    categoryId: initialData?.category?.id?.toString() || "",
    status: (initialData?.status || "active") as "active" | "inactive",
    tryOn: initialData?.tryOn || false,
    tags: initialData?.tags || [],
    variants: initialData?.variants || [],
  });
  console.log(formData, 'from product form')

  const [newTag, setNewTag] = useState("");
  const [newVariant, setNewVariant] = useState<VariantDto>({ size: "", stock: 0 });

  useEffect(() => {
    const loadCategories = async () => {
      try {
        const response = await CATEGORY_SERVICES.getCategories();
        setCategories(response.data);
      } catch (error) {
        toast.error("Failed to load categories");
      }
    };
    loadCategories();
  }, []);

  const calculateDiscountPrice = (actualPrice: number, discountPercent: number): number => {
    if (discountPercent < 0 || discountPercent > 100) return actualPrice;
    return actualPrice - (actualPrice * discountPercent) / 100;
  };

  const validateForm = (): boolean => {
    if (!formData.name.trim()) {
      toast.error("Product name is required");
      return false;
    }

    if (!formData.description.trim()) {
      toast.error("Product description is required");
      return false;
    }

    if (!formData.price || isNaN(formData.price) || formData.price <= 0) {
      toast.error("Please enter a valid price greater than 0");
      return false;
    }

    if (isNaN(formData.discountPercent) || formData.discountPercent < 0 || formData.discountPercent > 100) {
      toast.error("Discount must be between 0 and 100");
      return false;
    }

    if (!formData.categoryId) {
      toast.error("Please select a category");
      return false;
    }

    if (formData.variants.length === 0) {
      toast.error("Please add at least one variant");
      return false;
    }

    return true;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!validateForm()) {
      return;
    }

    setIsSubmitting(true);

    try {
      const productData: Partial<Product> = {
        name: formData.name.trim(),
        description: formData.description.trim(),
        price: Number(formData.price),
        discountPercent: Number(formData.discountPercent),
        categoryId: formData.categoryId,
        status: formData.status,
        tryOn: formData.tryOn,
        tags: formData.tags,
        variants: formData.variants,
        images: initialData?.images || [],
        thumbnail: initialData?.thumbnail || "",
      };

      let result;

      if (initialData?.id) {
        // Update existing product
        result = await PRODUCT_SERVICES.updateProduct(initialData.id, productData);
        toast.success("Product updated successfully");
      } else {
        // Create new product
        result = await PRODUCT_SERVICES.addProduct(productData as Omit<Product, "id">);
        toast.success("Product created successfully");
      }

      onSuccess?.(result.data);
    } catch (error) {
      toast.error(`Failed to ${initialData ? "update" : "create"} product`);
      console.error("Product submission error:", error);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Card className="w-full border-0 shadow-none">
      <CardHeader>
        <CardTitle>{initialData ? "Edit Product" : "Create New Product"}</CardTitle>
        <CardDescription>
          {initialData
            ? "Update product information and save changes."
            : "Fill in the details to add a new product to your inventory."}
        </CardDescription>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit}>
          <ProductFormFields
            formData={formData}
            setFormData={setFormData}
            newTag={newTag}
            setNewTag={setNewTag}
            newVariant={newVariant}
            setNewVariant={setNewVariant}
            calculateDiscountPrice={calculateDiscountPrice}
            categories={categories}
          />

          <div className="flex gap-3 justify-end mt-6">
            {onCancel && (
              <Button type="button" variant="outline" onClick={onCancel} disabled={isSubmitting}>
                Cancel
              </Button>
            )}
            <Button type="submit" disabled={isSubmitting}>
              {isSubmitting && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
              {initialData ? "Update Product" : "Create Product"}
            </Button>
          </div>
        </form>
      </CardContent>
    </Card>
  );
};
