import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Switch } from "@/components/ui/switch";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Plus, X } from "lucide-react";
import { Category } from "@/types/category.types";
import { ProductDetails, VariantDto } from "@/types/product.types";

interface ProductFormFieldsProps {
  formData: ProductDetails;
  setFormData: React.Dispatch<React.SetStateAction<any>>;
  newTag: string;
  setNewTag: React.Dispatch<React.SetStateAction<string>>;
  newVariant: VariantDto;
  setNewVariant: React.Dispatch<React.SetStateAction<VariantDto>>;
  calculateDiscountPrice: (price: number, discount: number) => number;
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
  categories,
}: ProductFormFieldsProps) => {
  if(!formData) return <p>no form data</p>
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

  return (
    <div className="space-y-6">
      {/* Basic Information */}
      <div className="space-y-4">
        <h3 className="text-lg font-semibold">Basic Information</h3>

        <div className="space-y-2">
          <Label htmlFor="name">Product Name *</Label>
          <Input
            id="name"
            placeholder="Enter product name"
            value={formData?.name}
            onChange={(e) => setFormData({ ...formData, name: e.target.value })}
            required
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="description">Description *</Label>
          <Textarea
            id="description"
            placeholder="Enter product description"
            value={formData.description}
            onChange={(e) => setFormData({ ...formData, description: e.target.value })}
            rows={4}
            required
          />
        </div>
      </div>

      <div className="space-y-4">
        <h3 className="text-lg font-semibold">Pricing</h3>

        <div className="grid grid-cols-2 gap-4">
          <div className="space-y-2">
            <Label htmlFor="price">Price ($) *</Label>
            <Input
              id="price"
              type="number"
              min="0"
              step="0.01"
              placeholder="0.00"
              value={formData.price}
              onChange={(e) => setFormData({ ...formData, price: parseFloat(e.target.value) || 0 })}
              required
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="discount">Discount (%)</Label>
            <Input
              id="discount"
              type="number"
              min="0"
              max="100"
              placeholder="0"
              value={formData.discountPercent}
              onChange={(e) => setFormData({ ...formData, discountPercent: e.target.value })}
            />
          </div>
        </div>

        {formData.discountPercent > 0 && (
          <div className="rounded-lg bg-muted p-3">
            <p className="text-sm text-muted-foreground">
              Final Price:{" "}
              <span className="font-semibold text-foreground">
                ${calculateDiscountPrice(formData.price, formData.discountPercent).toFixed(2)}
              </span>
            </p>
          </div>
        )}
      </div>

      <div className="space-y-4">
        <h3 className="text-lg font-semibold">Category & Status</h3>

        <div className="grid grid-cols-2 gap-4">
          <div className="space-y-2">
  <Label htmlFor="category">Category *</Label>

  <Select
    value={formData.categoryId}
    onValueChange={(value) => {
      const selected = categories.find((c) => c.id === value);
      setFormData({
        ...formData,
        categoryId: value,
        category: selected || null, // optional but helpful
      });
    }}
  >
    <SelectTrigger id="category">
      <SelectValue
        placeholder="Select category"
        // 👇 Shows category name even if only ID exists in formData
        defaultValue={
          formData?.categoryId
            ? categories.find((c) => c.id === formData.categoryId)?.name
            : undefined
        }
      >
        {formData.categoryId
          ? categories.find((c) => c.id === formData.categoryId)?.name
          : "Select category"}
      </SelectValue>
    </SelectTrigger>

    <SelectContent>
      {categories.map((category) => (
        <SelectItem key={category.id} value={category.id}>
          {category.name}
        </SelectItem>
      ))}
    </SelectContent>
  </Select>
</div>


          <div className="space-y-2">
            <Label htmlFor="status">Status</Label>
            <Select
              value={formData.status}
              onValueChange={(value: "active" | "inactive") => setFormData({ ...formData, status: value })}
            >
              <SelectTrigger id="status">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="active">Active</SelectItem>
                <SelectItem value="inactive">Inactive</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>


        <div className="flex items-center space-x-2">
          <Switch
            id="tryOn"
            checked={formData.tryOn}
            onCheckedChange={(checked) => setFormData({ ...formData, tryOn: checked })}
          />
          <Label htmlFor="tryOn">Enable Virtual Try-On</Label>
        </div>
      </div>
    
    <div className="space-y-4">
        {/* <h3 className="text-lg font-semibold">Tags</h3>
        
        <div className="flex gap-2">
          <Input
            placeholder="Add a tag"
            value={newTag}
            onChange={(e) => setNewTag(e.target.value)}
            onKeyPress={(e) => e.key === "Enter" && (e.preventDefault(), addTag())}
          />
          <Button type="button" onClick={addTag} size="icon" variant="outline">
            <Plus className="h-4 w-4" />
          </Button>
        </div> */}

        {formData?.tags.length > 0 && (
          <div className="flex flex-wrap gap-2">
            {formData.tags.map((tag) => (
              <Badge key={tag} variant="secondary" className="gap-1">
                {tag}
                <button
                  type="button"
                  onClick={() => removeTag(tag)}
                  className="ml-1 hover:text-destructive"
                >
                  <X className="h-3 w-3" />
                </button>
              </Badge>
            ))}
          </div>
        )}
      </div> 

       <div className="space-y-4">
        <h3 className="text-lg font-semibold">Variants *</h3>

        <div className="flex gap-2">
          <Input
            placeholder="Size (e.g., S, M, L)"
            value={newVariant.size}
            onChange={(e) => setNewVariant({ ...newVariant, size: e.target.value })}
            className="flex-1"
          />
          <Input
            type="number"
            min="0"
            placeholder="Stock"
            value={newVariant.stock}
            onChange={(e) => setNewVariant({ ...newVariant, stock: parseInt(e.target.value) || 0 })}
            className="w-32"
          />
          <Button type="button" onClick={addVariant} size="icon" variant="outline">
            <Plus className="h-4 w-4" />
          </Button>
        </div>

        {formData.variants.length > 0 && (
          <div className="space-y-2">
            {formData.variants.map((variant, index) => (
              <div key={index} className="flex items-center justify-between rounded-lg border p-3">
                <div>
                  <span className="font-medium">{variant.size}</span>
                  <span className="ml-4 text-sm text-muted-foreground">Stock: {variant.stock}</span>
                </div>
                <Button
                  type="button"
                  variant="ghost"
                  size="icon"
                  onClick={() => removeVariant(index)}
                  className="h-8 w-8"
                >
                  <Trash2 className="h-4 w-4 text-destructive" />
                </Button>
              </div>
            ))}
          </div>
        )}
      </div> 
    </div>
  );
};

const Trash2 = ({ className }: { className?: string }) => (
  <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}>
    <path d="M3 6h18" />
    <path d="M19 6v14c0 1-1 2-2 2H7c-1 0-2-1-2-2V6" />
    <path d="M8 6V4c0-1 1-2 2-2h4c1 0 2 1 2 2v2" />
    <line x1="10" x2="10" y1="11" y2="17" />
    <line x1="14" x2="14" y1="11" y2="17" />
  </svg>
);
