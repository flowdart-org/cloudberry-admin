import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Switch } from "@/components/ui/switch";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { AspectRatio } from "@/components/ui/aspect-ratio";
import { Upload, X, Check } from "lucide-react";
import { VariantDto, ProductImage } from "@/types/product.types";

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
    images: ProductImage[];
    thumbnail: string;
  };
  setFormData: React.Dispatch<React.SetStateAction<any>>;
  newTag: string;
  setNewTag: React.Dispatch<React.SetStateAction<string>>;
  newVariant: VariantDto;
  setNewVariant: React.Dispatch<React.SetStateAction<VariantDto>>;
  onImageUpload: (e: React.ChangeEvent<HTMLInputElement>) => void;
  onRemoveImage: (imageId: string) => void;
  onSetThumbnail: (imageUrl: string) => void;
  calculateDiscountPrice: (actualPrice: number, discountPercent: number) => number;
}

export const ProductFormFields = ({
  formData,
  setFormData,
  newTag,
  setNewTag,
  newVariant,
  setNewVariant,
  onImageUpload,
  onRemoveImage,
  onSetThumbnail,
  calculateDiscountPrice,
}: ProductFormFieldsProps) => {
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
    <div className="grid gap-4 py-4">
      {/* Image Upload Section */}
      <div className="grid gap-2">
        <Label>Product Images *</Label>
        <div className="grid gap-4">
          <div className="flex items-center justify-center w-full">
            <label className="flex flex-col items-center justify-center w-full h-32 border-2 border-dashed rounded-lg cursor-pointer bg-muted/50 hover:bg-muted transition-colors">
              <div className="flex flex-col items-center justify-center pt-5 pb-6">
                <Upload className="w-8 h-8 mb-2 text-muted-foreground" />
                <p className="mb-2 text-sm text-muted-foreground">
                  <span className="font-semibold">Click to upload</span> and crop images
                </p>
                <p className="text-xs text-muted-foreground">Images will be cropped to 3:4 ratio</p>
              </div>
              <input
                type="file"
                className="hidden"
                accept="image/*"
                onChange={onImageUpload}
              />
            </label>
          </div>

          {formData.images.length > 0 && (
            <div className="grid grid-cols-3 gap-4">
              {formData.images.map((image) => (
                <div key={image.id} className="relative group">
                  <AspectRatio ratio={3 / 4} className="bg-muted rounded-lg overflow-hidden">
                    <img
                      src={image.url}
                      alt="Product"
                      className="object-cover w-full h-full"
                    />
                    <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-2">
                      <Button
                        type="button"
                        size="sm"
                        variant={formData.thumbnail === image.url ? "default" : "secondary"}
                        onClick={() => onSetThumbnail(image.url)}
                        className="h-8"
                      >
                        {formData.thumbnail === image.url ? (
                          <>
                            <Check className="h-3 w-3 mr-1" />
                            Thumbnail
                          </>
                        ) : (
                          "Set Thumbnail"
                        )}
                      </Button>
                      <Button
                        type="button"
                        size="sm"
                        variant="destructive"
                        onClick={() => onRemoveImage(image.id)}
                        className="h-8 w-8 p-0"
                      >
                        <X className="h-4 w-4" />
                      </Button>
                    </div>
                  </AspectRatio>
                  {formData.thumbnail === image.url && (
                    <Badge className="absolute top-2 left-2 bg-primary">
                      Thumbnail
                    </Badge>
                  )}
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

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
};
