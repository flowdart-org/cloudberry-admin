import { useState, useRef } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Upload, X, Crop } from "lucide-react";
import { toast } from "sonner";
import ReactCrop, { Crop as CropType, PixelCrop } from 'react-image-crop';
import 'react-image-crop/dist/ReactCrop.css';
import { MEDIA_SERVICES } from "@/api/media/media.service";

interface ProductImageUploadProps {
  productId: string;
  onComplete: () => void;
  existingImages?: string[];
}

export const ProductImageUpload = ({ productId, onComplete, existingImages = [] }: ProductImageUploadProps) => {
  const [images, setImages] = useState<string[]>(existingImages);
  const [uploading, setUploading] = useState(false);
  const [isCropDialogOpen, setIsCropDialogOpen] = useState(false);
  const [imageToCrop, setImageToCrop] = useState<string>("");
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [currentSlotIndex, setCurrentSlotIndex] = useState<number>(0);
  const [crop, setCrop] = useState<CropType>({
    unit: '%',
    width: 75,
    height: 100,
    x: 12.5,
    y: 0,
  });
  const [completedCrop, setCompletedCrop] = useState<PixelCrop | null>(null);
  const imgRef = useRef<HTMLImageElement>(null);

  const MAX_IMAGES = 5;

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>, slotIndex: number) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = () => {
      setImageToCrop(reader.result as string);
      setSelectedFile(file);
      setCurrentSlotIndex(slotIndex);
      setIsCropDialogOpen(true);
    };
    reader.readAsDataURL(file);

    e.target.value = "";
  };

   

  const onImageLoad = (e: React.SyntheticEvent<HTMLImageElement>) => {
    const width = 60; // 60% width crop

    setCrop({
      unit: "%",
      width,
      aspect: 3 / 4,
      x: (100 - width) / 2,
      y: 10,
    });
  };


  const getCroppedImg = async (image: HTMLImageElement, pixelCrop: PixelCrop): Promise<Blob | null> => {
    const canvas = document.createElement('canvas');
    const scaleX = image.naturalWidth / image.width;
    const scaleY = image.naturalHeight / image.height;

    canvas.width = pixelCrop.width;
    canvas.height = pixelCrop.height;
    const ctx = canvas.getContext('2d');

    if (!ctx) {
      throw new Error('No 2d context');
    }

    ctx.drawImage(
      image,
      pixelCrop.x * scaleX,
      pixelCrop.y * scaleY,
      pixelCrop.width * scaleX,
      pixelCrop.height * scaleY,
      0,
      0,
      pixelCrop.width,
      pixelCrop.height
    );

    return new Promise((resolve) => {
      canvas.toBlob((blob) => {
        resolve(blob);
      }, 'image/jpeg', 0.95);
    });
  };

  const handleCropConfirm = async () => {
    if (!imgRef.current || !completedCrop || !selectedFile) return;


    try {
      setUploading(true);

      const croppedBlob = await getCroppedImg(imgRef.current, completedCrop);
      if (!croppedBlob) throw new Error("Failed to crop image");

      const croppedFile = new File([croppedBlob], selectedFile.name, { type: selectedFile.type });

      const response =  currentSlotIndex === 0 ?  await MEDIA_SERVICES.getProductThumbnailUploadUrl(productId, croppedFile) : await MEDIA_SERVICES.getProductUploadUrl(productId, currentSlotIndex, croppedFile);
      if (!response.data) throw new Error("Failed to get upload URL");

      await MEDIA_SERVICES.uploadImage(response.data, croppedFile);


      setImages((prev) => {
        const updated = [...prev];
        updated[currentSlotIndex] = response.data;
        return updated;
      });

      toast.success("Image uploaded successfully");

      setIsCropDialogOpen(false);
      setImageToCrop("");
      setCompletedCrop(null);
      setSelectedFile(null);
    } catch (error) {
      console.error("Upload error:", error);
      toast.error("Failed to upload image");
    } finally {
      setUploading(false);
    }
  };

  const removeImage = (slotIndex: number) => {
    setImages((prev) => {
      const updated = [...prev];
      updated[slotIndex] = undefined as any;
      return updated.filter(Boolean);
    });
    toast.success("Image removed");
  };

  const handleSave = () => {
    const validImages = images.filter(Boolean);
    if (validImages.length === 0) {
      toast.error("Please upload at least one image (thumbnail)");
      return;
    }
    // Here you would typically save images to the product via API
    toast.success("Images saved successfully");
    onComplete();
  };

  const renderImageSlot = (slotIndex: number) => {
    const image = images[slotIndex];
    const isThumb = slotIndex === 0;

    return (
      <div key={slotIndex} className="relative aspect-[3/4] border-2 border-dashed rounded-lg overflow-hidden">
        {image ? (
          <>
            <img src={image} alt={`Product ${slotIndex + 1}`} className="w-full h-full object-cover" />
            <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
              <Button
                type="button"
                size="icon"
                variant="destructive"
                onClick={() => removeImage(slotIndex)}
                className="h-8 w-8"
              >
                <X className="h-4 w-4" />
              </Button>
            </div>
            {isThumb && (
              <div className="absolute top-2 left-2 bg-primary text-primary-foreground text-xs px-2 py-1 rounded">
                Thumbnail
              </div>
            )}
          </>
        ) : (
          <div
            onClick={() => document.getElementById(`file-input-${slotIndex}`)?.click()}
            className="w-full h-full flex flex-col items-center justify-center cursor-pointer hover:bg-muted/50 transition-colors"
          >
            <Upload className="h-8 w-8 text-muted-foreground mb-2" />
            <p className="text-xs text-muted-foreground text-center px-2">
              {isThumb ? "Upload Thumbnail" : `Image ${slotIndex + 1}`}
            </p>
            <input
              id={`file-input-${slotIndex}`}
              type="file"
              accept="image/*"
              onChange={(e) => handleFileSelect(e, slotIndex)}
              className="hidden"
            />
          </div>
        )}
      </div>
    );
  };

  return (
    <>
      <Card className="border-0 shadow-none">
        <CardHeader>
          <CardTitle>Product Images</CardTitle>
          <CardDescription>
            Upload up to 5 images. The first image will be used as the thumbnail.
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="grid grid-cols-5 gap-3 group">
            {[0, 1, 2, 3, 4].map((index) => renderImageSlot(index))}
          </div>

          <div className="flex gap-3 justify-end">
            <Button type="button" variant="outline" onClick={onComplete}>
              Skip
            </Button>
            <Button onClick={handleSave} disabled={uploading}>
              Save Images
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Crop Dialog */}
      <Dialog open={isCropDialogOpen} onOpenChange={setIsCropDialogOpen}>
        <DialogContent className="max-w-4xl">
          <DialogHeader>
            <DialogTitle>Crop Image to 3:4 Ratio</DialogTitle>
            <DialogDescription>
              Adjust the crop area to select the portion of the image you want to use
            </DialogDescription>
          </DialogHeader>
          <div className="py-4">
            {imageToCrop && (
              <div className="flex justify-center">
                <ReactCrop
                  crop={crop}
                  onChange={(c) => setCrop(c)}
                  onComplete={(c) => setCompletedCrop(c)}
                  aspect={3 / 4}
                  className="max-h-[500px]"
                >
                  <img
                    ref={imgRef}
                    src={imageToCrop}
                    alt="Crop preview"
                    onLoad={onImageLoad}
                    className="max-h-[500px]"
                  />
                </ReactCrop>
              </div>
            )}
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsCropDialogOpen(false)} disabled={uploading}>
              Cancel
            </Button>
            <Button onClick={handleCropConfirm} disabled={uploading}>
              {uploading ? (
                <>Uploading...</>
              ) : (
                <>
                  <Crop className="mr-2 h-4 w-4" />
                  Crop & Upload
                </>
              )}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  );
};
