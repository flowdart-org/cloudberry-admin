"use client";

import { useState, useRef } from "react";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Switch } from "@/components/ui/switch";
import { X, Upload, Loader2 } from "lucide-react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { toast } from "@/components/ui/use-toast";
import ReactCrop, { Crop, PixelCrop } from "react-image-crop";
import "react-image-crop/dist/ReactCrop.css";
import { MEDIA_SERVICES } from "@/api/media/media.service";
import { CATEGORY_SERVICES } from "@/api/category/category.service";

interface CategoryFormFieldsProps {
  formData: {
    id: string;
    name: string;
    thumbnail: string;
    status: "active" | "inactive";
  };
  setFormData: React.Dispatch<
    React.SetStateAction<{
      id: string;
      name: string;
      thumbnail: string;
      status: "active" | "inactive";
    }>
  >;
  step: "basic" | "complete";
}

const getCroppedImg = (image: HTMLImageElement, crop: PixelCrop): Promise<Blob | null> => {
  return new Promise((resolve) => {
    const canvas = document.createElement("canvas");
    const scaleX = image.naturalWidth / image.width;
    const scaleY = image.naturalHeight / image.height;
    canvas.width = crop.width;
    canvas.height = crop.height;
    const ctx = canvas.getContext("2d");
    if (!ctx) {
      resolve(null);
      return;
    }

    ctx.drawImage(
      image,
      crop.x * scaleX,
      crop.y * scaleY,
      crop.width * scaleX,
      crop.height * scaleY,
      0,
      0,
      crop.width,
      crop.height
    );

    canvas.toBlob((blob) => resolve(blob), "image/jpeg", 0.95);
  });
};

export const CategoryFormFields = ({
  formData,
  setFormData,
  step,
}: CategoryFormFieldsProps) => {
  const [isCropDialogOpen, setIsCropDialogOpen] = useState(false);
  const [imageToCrop, setImageToCrop] = useState<string>("");
  const [crop, setCrop] = useState<Crop>({ unit: "%", width: 60, height: 80, x: 20, y: 10 });
  const [completedCrop, setCompletedCrop] = useState<PixelCrop | null>(null);
  const imgRef = useRef<HTMLImageElement | null>(null);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [isUploading, setIsUploading] = useState(false);

  const fetchUploadUrl = async (file: File): Promise<string> => {
    try {
      const response = await MEDIA_SERVICES.getCategoryUploadUrl(formData.id, file);
      return response.data;
    } catch {
      throw new Error("Failed to get upload URL");
    }
  };

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = () => {
      setImageToCrop(reader.result as string);
      setSelectedFile(file);
      setIsCropDialogOpen(true);
    };
    reader.readAsDataURL(file);
  };

  const handleCropConfirm = async () => {
    if (!imgRef.current || !completedCrop) return;
    
    const croppedBlob = await getCroppedImg(imgRef.current, completedCrop);
    if (!croppedBlob || !selectedFile) return;

    try {
      setIsUploading(true);
      const croppedFile = new File([croppedBlob], selectedFile.name, { type: selectedFile.type });

      const uploadUrl = await fetchUploadUrl(croppedFile);
      if (!uploadUrl) throw new Error("Failed to get upload URL");

      await MEDIA_SERVICES.uploadImage(uploadUrl, croppedFile);
      const response = await CATEGORY_SERVICES.getCategory(formData.id);

      const publicUrl = uploadUrl.split('?')[0];
      
      setFormData(response.data);
      
      toast({
        title: "Success",
        description: "Image uploaded successfully",
      });
      
      setIsCropDialogOpen(false);
      setImageToCrop("");
      setCompletedCrop(null);
      setSelectedFile(null);
    } catch (error) {
      console.error("Upload error:", error);
      toast({
        title: "Error",
        description: "Failed to upload image",
        variant: "destructive",
      });
    } finally {
      setIsUploading(false);
    }
  };

  const handleRemoveImage = () => {
    setFormData((prev) => ({ ...prev, thumbnail: "" }));
  };

  if (step === "basic") {
    return (
      <div className="grid gap-4 py-4">
        <div className="grid gap-2">
          <Label htmlFor="name">Name</Label>
          <Input
            id="name"
            value={formData.name}
            onChange={(e) => setFormData({ ...formData, name: e.target.value })}
            placeholder="Enter category name"
          />
        </div>

        <div className="grid gap-2">
          <div className="flex items-center justify-between">
            <Label htmlFor="status">Status</Label>
            <div className="flex items-center gap-2">
              <span className="text-sm text-muted-foreground">Inactive</span>
            </div>
          </div>
          <p className="text-xs text-muted-foreground">
            Category can only be made active after creation
          </p>
        </div>
      </div>
    );
  }

  return (
    <>
      <div className="grid gap-4 py-4">
        <div className="grid gap-2">
          <Label htmlFor="edit-name">Category Name</Label>
          <Input
            id="edit-name"
            value={formData.name}
            onChange={(e) => setFormData({ ...formData, name: e.target.value })}
            placeholder="Enter category name"
          />
        </div>

        <div className="grid gap-2">
          <div className="flex items-center justify-between">
            <Label htmlFor="status">Active Status</Label>
            <Switch
              id="status"
              checked={formData.status === "active"}
              onCheckedChange={(checked) =>
                setFormData({ ...formData, status: checked ? "active" : "inactive" })
              }
            />
          </div>
          <p className="text-xs text-muted-foreground">
            {formData.status === "active"
              ? "Category is visible to users"
              : "Category is hidden from users"}
          </p>
        </div>

        <div className="grid gap-2">
          <Label htmlFor="thumbnail">Category Image</Label>
          <div className="flex flex-col gap-4">
            {formData.thumbnail ? (
              <div className="flex flex-col gap-3">
                <div className="relative inline-block w-fit">
                  <img
                    src={formData.thumbnail}
                    alt="Category thumbnail"
                    className="w-48 h-64 object-cover rounded-lg border-2 shadow-lg"
                  />
                  <Button
                    type="button"
                    variant="destructive"
                    size="icon"
                    className="absolute -top-2 -right-2 h-7 w-7 rounded-full shadow-md"
                    onClick={handleRemoveImage}
                  >
                    <X className="h-4 w-4" />
                  </Button>
                </div>
                <p className="text-xs text-muted-foreground">
                  Current category image (3:4 ratio)
                </p>
              </div>
            ) : (
              <div className="border-2 border-dashed rounded-lg p-8 text-center hover:border-primary/50 transition-colors">
                <Upload className="h-10 w-10 mx-auto mb-3 text-muted-foreground" />
                <p className="text-sm font-medium mb-1">Upload Category Image</p>
                <p className="text-xs text-muted-foreground mb-4">
                  Recommended: 3:4 aspect ratio (e.g., 600x800px)
                </p>
                <Input
                  id="thumbnail"
                  type="file"
                  accept="image/*"
                  onChange={handleImageUpload}
                  className="max-w-xs mx-auto cursor-pointer"
                  disabled={isUploading}
                />
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Crop Modal */}
      <Dialog open={isCropDialogOpen} onOpenChange={(open) => {
        if (!open && !isUploading) {
          setIsCropDialogOpen(false);
          setImageToCrop("");
          setCompletedCrop(null);
          setSelectedFile(null);
        }
      }}>
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
              disabled={isUploading}
            >
              Cancel
            </Button>
            <Button
              onClick={handleCropConfirm}
              disabled={isUploading}
            >
              {isUploading ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Uploading...
                </>
              ) : (
                "Save & Upload"
              )}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  );
};