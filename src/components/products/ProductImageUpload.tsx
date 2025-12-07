"use client";

import { useState, useRef } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Upload, X, Crop } from "lucide-react";
import { toast } from "sonner";
import ReactCrop, { Crop as CropType, PixelCrop } from "react-image-crop";
import "react-image-crop/dist/ReactCrop.css";
import { MEDIA_SERVICES } from "@/api/media/media.service";
import { PRODUCT_SERVICES } from "@/api/product/product.service";

interface ProductImageUploadProps {
  productId: string;
  onComplete: () => void;
  existingImages?: string[];
}

export const ProductImageUpload = ({ productId, onComplete, existingImages = [] }: ProductImageUploadProps) => {
  const [thumbnail, setThumbnail] = useState<string>(existingImages[0] || "");
  const [images, setImages] = useState<string[]>(existingImages.slice(1)); // index 1→4 stored here
  const [uploading, setUploading] = useState(false);

  // Crop
  const [isCropDialogOpen, setIsCropDialogOpen] = useState(false);
  const [imageToCrop, setImageToCrop] = useState<string>("");
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [currentSlotIndex, setCurrentSlotIndex] = useState<number>(0);

  const [crop, setCrop] = useState<CropType>({
    unit: "%",
    width: 75,
    height: 100,
    x: 12.5,
    y: 0,
  });

  const [completedCrop, setCompletedCrop] = useState<PixelCrop | null>(null);
  const imgRef = useRef<HTMLImageElement>(null);

  const MAX_IMAGES = 4;

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

  const onImageLoad = () => {
    setCrop({
      unit: "%",
      width: 75,
      height: 100,
      x: 12.5,
      y: 10,
    });
  };

  const getCroppedImg = async (image: HTMLImageElement, pixelCrop: PixelCrop): Promise<Blob> => {
    const canvas = document.createElement("canvas");
    const scaleX = image.naturalWidth / image.width;
    const scaleY = image.naturalHeight / image.height;

    canvas.width = pixelCrop.width;
    canvas.height = pixelCrop.height;
    const ctx = canvas.getContext("2d")!;
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

    return await new Promise((resolve) => {
      canvas.toBlob((b) => resolve(b!), "image/jpeg", 0.95);
    });
  };

  const handleCropConfirm = async () => {
    if (!imgRef.current || !completedCrop || !selectedFile) return;

    try {
      setUploading(true);

      const croppedBlob = await getCroppedImg(imgRef.current, completedCrop);
      const croppedFile = new File([croppedBlob], selectedFile.name, { type: selectedFile.type });

      const response =
        currentSlotIndex === 0
          ? await MEDIA_SERVICES.getProductThumbnailUploadUrl(productId, croppedFile)
          : await MEDIA_SERVICES.getProductUploadUrl(productId, currentSlotIndex - 1, croppedFile);

      if (!response.data) throw new Error("Failed to get upload URL");

      await MEDIA_SERVICES.uploadImage(response.data.uploadUrl, croppedFile);

      if (currentSlotIndex === 0) {
        setThumbnail(response.data.readUrl);
      } else {
        setImages((prev) => {
          const updated = [...prev];
          updated[currentSlotIndex - 1] = response.data.readUrl;
          return updated;
        });
      }

      toast.success("Image uploaded successfully");
      setIsCropDialogOpen(false);
      resetCropState();
    } catch (err) {
      toast.error("Upload failed");
    } finally {
      setUploading(false);
    }
  };

  const resetCropState = () => {
    setImageToCrop("");
    setCompletedCrop(null);
    setSelectedFile(null);
  };

  const removeImage = (slotIndex: number) => {
    if (slotIndex === 0) {
      setThumbnail("");
    } else {
      setImages((prev) => prev.filter((_, i) => i !== slotIndex - 1));
    }
    toast.success("Image removed");
  };

  const handleSave = async () => {
    if (!thumbnail) return toast.error("Thumbnail is required");

    await PRODUCT_SERVICES.updateProduct(productId, {
      thumbnail,
      images,
    });

    toast.success("Images saved successfully");
    onComplete();
  };

  const renderImageSlot = (slotIndex: number) => {
    const img = slotIndex === 0 ? thumbnail : images[slotIndex - 1];
    const isThumbnail = slotIndex === 0;

    return (
      <div key={slotIndex} className="relative aspect-[3/4] rounded-lg border-2 border-dashed overflow-hidden group">
        {img ? (
          <>
            <img src={img} className="w-full h-full object-cover" />
            <button
              className="absolute top-2 right-2 bg-black/70 p-1 rounded-full text-white opacity-0 group-hover:opacity-100 transition"
              onClick={() => removeImage(slotIndex)}
            >
              <X size={16} />
            </button>

            {isThumbnail && (
              <span className="absolute top-2 left-2 bg-primary text-white text-xs px-2 rounded">
                Thumbnail
              </span>
            )}
          </>
        ) : (
          <div
            onClick={() => document.getElementById(`file-${slotIndex}`)?.click()}
            className="border-2 border-dashed rounded-lg p-8 text-center hover:border-primary/50 transition-colors"
          >
            <Upload size={22} className="text-muted-foreground mb-1" />
                <p className="text-sm font-medium mb-1">{isThumbnail ? "Upload Thumbnail" : `Image ${slotIndex}`}</p>
                <p className="text-xs text-muted-foreground mb-4">
                  Recommended: 3:4 aspect ratio (e.g., 600x800px)
                </p>

            <input id={`file-${slotIndex}`} type="file" accept="image/*" hidden onChange={(e) => handleFileSelect(e, slotIndex)} />
          </div>
        )}
      </div>
    );
  };

  return (
    <>
      <Card className="border-none shadow-none">
        <CardHeader>
          <CardTitle>Product Images</CardTitle>
          <CardDescription>First image is thumbnail. Max 5 total.</CardDescription>
        </CardHeader>

        <CardContent className="space-y-6">
          <div className="grid grid-cols-5 gap-3">
            {[0, 1, 2, 3, 4].map(renderImageSlot)}
          </div>

          <div className="flex justify-end gap-3">
            <Button variant="outline" onClick={onComplete}>Skip</Button>
            <Button disabled={uploading} onClick={handleSave}>
              Save Images
            </Button>
          </div>
        </CardContent>
      </Card>

      <Dialog open={isCropDialogOpen} onOpenChange={setIsCropDialogOpen}>
        {/* <DialogContent className="max-w-3xl overflow-y-auto h-screen">
          <DialogHeader>
            <DialogTitle>Crop Image</DialogTitle>
            <DialogDescription>Use the crop tool to adjust framing.</DialogDescription>
          </DialogHeader>

          {imageToCrop && (
            <div className="flex justify-center py-4">
              <ReactCrop crop={crop} onChange={setCrop} onComplete={setCompletedCrop} aspect={3 / 4}>
                <img ref={imgRef} src={imageToCrop} onLoad={onImageLoad} style={{ maxHeight: "400px" }} />
              </ReactCrop>
            </div>
          )}

          {/* <div className="flex justify-center">
            {imageToCrop && (
              <ReactCrop
                crop={crop}
                onChange={(newCrop) => setCrop(newCrop)}
                onComplete={(c) => setCompletedCrop(c)}
                aspect={3 / 4}
              >
                <img
                  ref={imgRef}
                  src={imageToCrop}
                  alt="Crop preview"
                  style={{ maxHeight: "400px" }}
                />
              </ReactCrop>
            )}
          </div> 

          <DialogFooter>
            <Button variant="outline" onClick={() => setIsCropDialogOpen(false)}>Cancel</Button>
            <Button onClick={handleCropConfirm} disabled={uploading}>
              <Crop size={16} className="mr-2" /> {uploading ? "Uploading..." : "Crop & Upload"}
            </Button>
          </DialogFooter>
        </DialogContent> */}

        <DialogContent className="sm:max-w-[500px]">
          <DialogHeader>
            <DialogTitle>Crop Image</DialogTitle>
          </DialogHeader>

          <div className="flex justify-center">
            {imageToCrop && (
              <ReactCrop
                crop={crop}
                onChange={(newCrop) => setCrop(newCrop)}
                onComplete={(c) => setCompletedCrop(c)}
                aspect={3 / 4}
              >
                <img
                  ref={imgRef}
                  src={imageToCrop}
                  alt="Crop preview"
                  style={{ maxHeight: "400px" }}
                />
              </ReactCrop>
            )}
          </div>

          <DialogFooter>
            <Button
              variant="secondary"
              onClick={() => {
                setIsCropDialogOpen(false);
                setImageToCrop("");
                setCompletedCrop(null);
                setSelectedFile(null);
              }}
              // disabled={isUploading}
            >
              Close
            </Button>
            <Button
              onClick={handleCropConfirm}
              // disabled={isUploading}
            >
              "Save & Uploa"
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  );
};
