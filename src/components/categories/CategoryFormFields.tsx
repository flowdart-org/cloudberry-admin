"use client";

import { useState, useRef } from "react";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Switch } from "@/components/ui/switch";
import { X, Upload } from "lucide-react";
import { MEDIA_SERVICES } from "@/api/media/media.service";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { toast } from "@/components/ui/use-toast";
import ReactCrop, { Crop, PixelCrop } from "react-image-crop";
import "react-image-crop/dist/ReactCrop.css";

interface CategoryFormFieldsProps {
  formData: {
    name: string;
    thumbnail: string;
    description: string;
    status: "active" | "inactive";
  };
  setFormData: React.Dispatch<
    React.SetStateAction<{
      name: string;
      thumbnail: string;
      description: string;
      status: "active" | "inactive";
    }>
  >;
  step: "basic" | "complete";
}

// 🧩 Helper to get cropped image blob
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
  const [crop, setCrop] = useState<Crop>({ unit: "%", width: 60, aspect: 3 / 4 });
  const [completedCrop, setCompletedCrop] = useState<PixelCrop | null>(null);
  const imgRef = useRef<HTMLImageElement | null>(null);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);

  const fetchUploadUrl = async (file: File) => {
    try {
      // replace with your actual API that returns pre-signed Azure SAS URL
      const response = await MEDIA_SERVICES.getUploadURL(file)
      return response.data
    } catch {
      return null;
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
      const croppedFile = new File([croppedBlob], selectedFile.name, { type: selectedFile.type });

      const blobUrl = await fetchUploadUrl(croppedFile);
      if (!blobUrl) throw new Error("Failed to get upload URL");

      const response = await MEDIA_SERVICES.uploadImage(blobUrl, croppedFile);

      if (response.success) {
        setFormData((prev) => ({
          ...prev,
          thumbnail: blobUrl.split("?")[0], // clean URL for display
        }));
        toast({
          title: "Image uploaded successfully",
        });
      } else {
        toast({
          title: "Upload failed",
          description: response.message,
          variant: "destructive",
        });
      }
    } catch (error) {
      console.error("Upload error:", error);
      toast({
        title: "Error uploading image",
        variant: "destructive",
      });
    } finally {
      setIsCropDialogOpen(false);
      setImageToCrop("");
      setCompletedCrop(null);
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
          <div className="flex flex-col gap-2">
            {formData.thumbnail ? (
              <div className="relative inline-block">
                <img
                  src={formData.thumbnail}
                  alt="Category thumbnail"
                  className="w-32 h-42 object-cover rounded-lg border"
                />
                <Button
                  type="button"
                  variant="destructive"
                  size="icon"
                  className="absolute -top-2 -right-2 h-6 w-6 rounded-full"
                  onClick={handleRemoveImage}
                >
                  <X className="h-4 w-4" />
                </Button>
              </div>
            ) : (
              <div className="border-2 border-dashed rounded-lg p-6 text-center">
                <Upload className="h-8 w-8 mx-auto mb-2 text-muted-foreground" />
                <p className="text-sm text-muted-foreground mb-2">
                  Upload category image (3:4 ratio)
                </p>
                <Input
                  id="thumbnail"
                  type="file"
                  accept="image/*"
                  onChange={handleImageUpload}
                  className="max-w-xs mx-auto"
                />
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Crop Modal */}
      <Dialog open={isCropDialogOpen} onOpenChange={setIsCropDialogOpen}>
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
            <Button variant="secondary" onClick={() => setIsCropDialogOpen(false)}>
              Cancel
            </Button>
            <Button onClick={handleCropConfirm}>Save Crop</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  );
};
