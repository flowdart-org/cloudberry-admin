import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Switch } from "@/components/ui/switch";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { X, Loader2 } from "lucide-react";
import { VariantDto } from "@/types/product.types";
import { useEffect, useState } from "react";
import { useToast } from "@/hooks/use-toast";
import { Category } from "@/types/category.types";
import { CATEGORY_SERVICES } from "@/api/category/category.service";

interface ProductFormFieldsProps {
  formData: {
    name: string;
    description: string;
    actualPrice: string;
    discountPercent: string;
    categoryId: string;
    status: "active" | "inactive";
    tryOn: boolean;
    tags: string[];
    variants: VariantDto[];
  };
  setFormData: React.Dispatch<React.SetStateAction<any>>;
  newTag: string;
  setNewTag: React.Dispatch<React.SetStateAction<string>>;
  newVariant: VariantDto;
  setNewVariant: React.Dispatch<React.SetStateAction<VariantDto>>;
  calculateDiscountPrice: (actualPrice: number, discountPercent: number) => number;
  categories: Category[];
}

export const ProductFormFields = ({
  formData,
  setFormData,
  newTag,
  setNewTag,
  newVariant,
  setNewVariant,
  calculateDiscountPrice,
  categories: categoriesProp,
}: ProductFormFieldsProps) => {
  const [categories, setCategories] = useState<Category[]>([]);
  const [loadingCategories, setLoadingCategories] = useState(true);
  const { toast } = useToast();

  useEffect(() => {
    if (categoriesProp && categoriesProp.length > 0) {
      setCategories(categoriesProp);
      setLoadingCategories(false);
    } else {
      loadCategories();
    }
  }, [categoriesProp]);

  const loadCategories = async () => {
    try {
      setLoadingCategories(true);
      const fetchedCategories = await CATEGORY_SERVICES.getCategories();
      setCategories(fetchedCategories.data);
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to load categories. Please try again.",
        variant: "destructive",
      });
    } finally {
      setLoadingCategories(false);
    }
  };

  const addTag = () => {
    const trimmedTag = newTag.trim();
    if (!trimmedTag) {
      return;
    }
    if (formData.tags.includes(trimmedTag)) {
      toast({
        title: "Duplicate Tag",
        description: "This tag already exists.",
        variant: "destructive",
      });
      return;
    }
    setFormData({ ...formData, tags: [...formData.tags, trimmedTag] });
    setNewTag("");
  };

  const removeTag = (tag: string) => {
    setFormData({ ...formData, tags: formData.tags.filter((t) => t !== tag) });
  };

  const addVariant = () => {
    const trimmedSize = newVariant.size.trim();
    
    if (!trimmedSize) {
      toast({
        title: "Invalid Variant",
        description: "Size cannot be empty.",
        variant: "destructive",
      });
      return;
    }

    if (newVariant.stock < 0) {
      toast({
        title: "Invalid Stock",
        description: "Stock cannot be negative.",
        variant: "destructive",
      });
      return;
    }

    // Check for duplicate size
    if (formData.variants.some((v) => v.size.toLowerCase() === trimmedSize.toLowerCase())) {
      toast({
        title: "Duplicate Variant",
        description: "A variant with this size already exists.",
        variant: "destructive",
      });
      return;
    }

    setFormData({ 
      ...formData, 
      variants: [...formData.variants, { size: trimmedSize, stock: newVariant.stock }] 
    });
    setNewVariant({ size: "", stock: 0 });
  };

  const removeVariant = (index: number) => {
    setFormData({ ...formData, variants: formData.variants.filter((_, i) => i !== index) });
  };

  const handlePriceChange = (value: string, field: "actualPrice" | "discountPercent") => {
    // Only allow positive numbers and decimals
    const numValue = parseFloat(value);
    if (value === "" || (!isNaN(numValue) && numValue >= 0)) {
      setFormData({ ...formData, [field]: value });
    }
  };

  return (
    <div className="grid gap-4 py-4">
      <div className="grid gap-2">
        <Label htmlFor="name">Product Name *</Label>
        <Input
          id="name"
          value={formData.name}
          onChange={(e) => setFormData({ ...formData, name: e.target.value })}
          placeholder="Enter product name"
          maxLength={200}
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
          maxLength={1000}
        />
        <p className="text-xs text-muted-foreground text-right">
          {formData.description.length}/1000
        </p>
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div className="grid gap-2">
          <Label htmlFor="actualPrice">Actual Price *</Label>
          <Input
            id="actualPrice"
            type="number"
            step="0.01"
            min="0"
            value={formData.actualPrice}
            onChange={(e) => handlePriceChange(e.target.value, "actualPrice")}
            placeholder="0.00"
          />
        </div>
        <div className="grid gap-2">
          <Label htmlFor="discountPercent">Discount %</Label>
          <Input
            id="discountPercent"
            type="number"
            step="1"
            min="0"
            max="100"
            value={formData.discountPercent}
            onChange={(e) => handlePriceChange(e.target.value, "discountPercent")}
            placeholder="0"
          />
        </div>
      </div>

      {formData.actualPrice && parseFloat(formData.actualPrice) > 0 && formData.discountPercent && parseFloat(formData.discountPercent) > 0 && (
        <div className="rounded-md bg-muted p-3">
          <p className="text-sm font-medium">
            Final Price: ${calculateDiscountPrice(parseFloat(formData.actualPrice), parseFloat(formData.discountPercent)).toFixed(2)}
          </p>
          <p className="text-xs text-muted-foreground">
            Savings: ${(parseFloat(formData.actualPrice) - calculateDiscountPrice(parseFloat(formData.actualPrice), parseFloat(formData.discountPercent))).toFixed(2)} ({formData.discountPercent}% off)
          </p>
        </div>
      )}

      <div className="grid gap-2">
        <Label htmlFor="categoryId">Category *</Label>
        {loadingCategories ? (
          <div className="flex items-center justify-center p-4 border rounded-md">
            <Loader2 className="h-5 w-5 animate-spin text-muted-foreground" />
            <span className="ml-2 text-sm text-muted-foreground">Loading categories...</span>
          </div>
        ) : (
          <Select 
            value={formData.categoryId} 
            onValueChange={(value) => setFormData({ ...formData, categoryId: value })}
          >
            <SelectTrigger>
              <SelectValue placeholder="Select a category" />
            </SelectTrigger>
            <SelectContent>
              {categories.map((category) => (
                <SelectItem key={category.id} value={category.id}>
                  {category.name}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        )}
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
            onKeyPress={(e) => {
              if (e.key === "Enter") {
                e.preventDefault();
                addTag();
              }
            }}
            placeholder="Add a tag"
            maxLength={50}
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
        <Label>Variants (Size & Stock) *</Label>
        <div className="flex gap-2">
          <Input
            value={newVariant.size}
            onChange={(e) => setNewVariant({ ...newVariant, size: e.target.value })}
            placeholder="Size (e.g., S, M, L)"
            className="flex-1"
            maxLength={20}
          />
          <Input
            type="number"
            min="0"
            value={newVariant.stock}
            onChange={(e) => setNewVariant({ ...newVariant, stock: parseInt(e.target.value) || 0 })}
            placeholder="Stock"
            className="w-32"
          />
          <Button type="button" onClick={addVariant} variant="outline">
            Add
          </Button>
        </div>
        {formData.variants.length > 0 && (
          <div className="mt-2 space-y-2">
            {formData.variants.map((variant, index) => (
              <div key={index} className="flex items-center justify-between rounded-md border border-border p-3">
                <span className="text-sm">
                  Size: <strong>{variant.size}</strong> - Stock: <strong>{variant.stock}</strong>
                </span>
                <Button
                  type="button"
                  variant="ghost"
                  size="sm"
                  onClick={() => removeVariant(index)}
                  className="h-8 w-8 p-0"
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
};
