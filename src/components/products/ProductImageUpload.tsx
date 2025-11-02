import { useState, useRef } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";
import { Upload, X, Check, Loader2 } from "lucide-react";
import { ProductImage } from "@/types/product.types";
import { AspectRatio } from "@/components/ui/aspect-ratio";
import { MEDIA_SERVICES } from "@/api/media/media.service";

interface ProductImageUploadProps {
  productId: string;
  onComplete?: () => void;
}

export const ProductImageUpload = ({ productId, onComplete }: ProductImageUploadProps) => {
  const { toast } = useToast();
  const [images, setImages] = useState<ProductImage[]>([]);
  const [thumbnailId, setThumbnailId] = useState<string>("");
  const [isUploading, setIsUploading] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (file.size > 10 * 1024 * 1024) {
      toast({
        title: "File too large",
        description: `${file.name} exceeds 10MB limit.`,
        variant: "destructive",
      });
      return;
    }

    if (!file.type.startsWith("image/")) {
      toast({
        title: "Invalid file type",
        description: `${file.name} is not an image.`,
        variant: "destructive",
      });
      return;
    }

    setIsUploading(true);

    try {
    //   const uploadUrlResponse = await MEDIA_SERVICES.getProductUploadUrl(productId, file);
    //   const uploadUrl = uploadUrlResponse.data;
      
    //   await MEDIA_SERVICES.uploadImage(uploadUrl, file);

      const reader = new FileReader();
      reader.onload = () => {
        const newImage: ProductImage = {
          id: Math.random().toString(36).substr(2, 9),
          url: reader.result as string,
          alt: file.name,
        };

        setImages((prev) => {
          const updatedImages = [...prev, newImage];
          // Set as thumbnail if it's the first image
          if (updatedImages.length === 1) {
            setThumbnailId(newImage.id);
          }
          return updatedImages;
        });

        toast({
          title: "Success",
          description: "Image uploaded successfully",
        });
      };
      reader.readAsDataURL(file);
    } catch (error) {
      console.error("Upload error:", error);
      toast({
        title: "Error",
        description: "Failed to upload image",
        variant: "destructive",
      });
    } finally {
      setIsUploading(false);
      if (fileInputRef.current) {
        fileInputRef.current.value = "";
      }
    }
  };

  const handleRemoveImage = async (imageId: string) => {
    try {
    //   await MEDIA_SERVICES.deleteProductImage(productId, imageId);
      
      setImages((prev) => {
        const updatedImages = prev.filter((img) => img.id !== imageId);
        
        // If removed image was thumbnail, set new thumbnail
        if (imageId === thumbnailId && updatedImages.length > 0) {
          setThumbnailId(updatedImages[0].id);
        } else if (updatedImages.length === 0) {
          setThumbnailId("");
        }
        
        return updatedImages;
      });

      toast({
        title: "Success",
        description: "Image removed successfully",
      });
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to remove image",
        variant: "destructive",
      });
    }
  };

  const handleSetThumbnail = async (imageId: string) => {
    try {
    //   await MEDIA_SERVICES.setProductThumbnail(productId, imageId);
      setThumbnailId(imageId);
      
      toast({
        title: "Success",
        description: "Thumbnail set successfully",
      });
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to set thumbnail",
        variant: "destructive",
      });
    }
  };

  return (
    <Card className="w-full max-w-4xl mx-auto">
      <CardHeader>
        <CardTitle>Upload Product Images</CardTitle>
        <CardDescription>
          Add images for your product. The first image will be set as thumbnail by default.
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        <div className="flex flex-col items-center justify-center border-2 border-dashed rounded-lg p-8 hover:border-primary transition-colors">
          <Upload className="h-12 w-12 text-muted-foreground mb-4" />
          <p className="text-sm text-muted-foreground mb-4">
            Click to upload product images (Max 10MB per image)
          </p>
          <input
            ref={fileInputRef}
            type="file"
            accept="image/*"
            onChange={handleImageUpload}
            disabled={isUploading}
            className="hidden"
            id="image-upload"
          />
          <Button
            type="button"
            variant="outline"
            onClick={() => fileInputRef.current?.click()}
            disabled={isUploading}
          >
            {isUploading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
            {isUploading ? "Uploading..." : "Select Image"}
          </Button>
        </div>

        {images.length > 0 && (
          <div className="space-y-4">
            <h3 className="text-sm font-medium">Uploaded Images ({images.length})</h3>
            <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
              {images.map((image) => (
                <div key={image.id} className="relative group">
                  <AspectRatio ratio={1}>
                    <img
                      src={image.url}
                      alt={image.alt || "Product image"}
                      className="rounded-lg object-cover w-full h-full"
                    />
                  </AspectRatio>
                  
                  {thumbnailId === image.id && (
                    <div className="absolute top-2 left-2 bg-primary text-primary-foreground px-2 py-1 rounded text-xs font-medium">
                      Thumbnail
                    </div>
                  )}

                  <div className="absolute top-2 right-2 flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                    {thumbnailId !== image.id && (
                      <Button
                        type="button"
                        size="icon"
                        variant="secondary"
                        className="h-8 w-8"
                        onClick={() => handleSetThumbnail(image.id)}
                        title="Set as thumbnail"
                      >
                        <Check className="h-4 w-4" />
                      </Button>
                    )}
                    <Button
                      type="button"
                      size="icon"
                      variant="destructive"
                      className="h-8 w-8"
                      onClick={() => handleRemoveImage(image.id)}
                      title="Remove image"
                    >
                      <X className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        <div className="flex justify-end gap-3 pt-4">
          <Button
            type="button"
            variant="outline"
            onClick={onComplete}
          >
            Done
          </Button>
        </div>
      </CardContent>
    </Card>
  );
};
