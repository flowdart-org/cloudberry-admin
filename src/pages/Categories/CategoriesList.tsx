import { useState, useEffect, useRef } from "react";
import { Category } from "@/types/category.types";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import ReactCrop, { Crop as CropType, PixelCrop } from "react-image-crop";
import "react-image-crop/dist/ReactCrop.css";
import { CategoryFormFields } from "@/components/categories/CategoryFormFields";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { Plus, Search, Pencil, Trash2 } from "lucide-react";
import { toast } from "@/hooks/use-toast";
import { CATEGORY_SERVICES } from "@/api/category/category.service";
import { ComingSoonDialog } from "@/components/common/ComingSoonDialog";
import { MEDIA_SERVICES } from "@/api/media/media.service";

export const CategoriesList = () => {
  const [categories, setCategories] = useState<Category[]>([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState<Category | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [addStep, setAddStep] = useState<"basic" | "complete">("basic");
  const [newCategoryId, setNewCategoryId] = useState<string | null>(null);
  const [showComingSoon, setShowComingSoon] = useState(false);

  const [formData, setFormData] = useState({
    name: "",
    thumbnail: "",
    description: "",
    status: "inactive" as "active" | "inactive",
  });

  // Image crop states
  const [isCropDialogOpen, setIsCropDialogOpen] = useState(false);
  const [imageToCrop, setImageToCrop] = useState<string>("");
  const [crop, setCrop] = useState<CropType>({
    unit: "%",
    width: 75,
    height: 100,
    x: 12.5,
    y: 0,
  });
  const [completedCrop, setCompletedCrop] = useState<PixelCrop | null>(null);
  const imgRef = useRef<HTMLImageElement>(null);

  useEffect(() => {
    loadCategories();
  }, []);

  const loadCategories = async () => {
    try {
      setIsLoading(true);
      const response = await CATEGORY_SERVICES.getCategories();
      if (response.success) {
        setCategories(response.data);
        // } else {
        //   throw new Error(response.message)
      }
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to load categories",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const fetchBlogUrl = async (file: File) => {
      const response = await MEDIA_SERVICES.getUploadURL(file)
      return response.data
    }
  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
  try {
    const file = e.target.files?.[0];
    if (!file) return;

    // Get pre-signed SAS URL from backend
    const blobUrl = await fetchBlogUrl(file);
    if (!blobUrl) throw new Error("Failed to fetch blob URL");

    // Upload the file directly to Azure
    const response = await MEDIA_SERVICES.uploadImage(blobUrl, file);

    if (response.success) {
      console.log("✅ Image uploaded successfully:", response.data);
      // Optionally set preview
      // setUploadedImageUrl(response.data.url);
    } else {
      console.error("❌ Upload failed:", response.message);
    }
  } catch (error) {
    console.error("Error uploading image:", error);
  }
};



  const onImageLoad = (e: React.SyntheticEvent<HTMLImageElement>) => {
    const { width, height } = e.currentTarget;
    const aspect = 3 / 4;

    let cropWidth = width;
    let cropHeight = width / aspect;

    if (cropHeight > height) {
      cropHeight = height;
      cropWidth = height * aspect;
    }

    const x = (width - cropWidth) / 2;
    const y = (height - cropHeight) / 2;

    setCrop({
      unit: "px",
      width: cropWidth,
      height: cropHeight,
      x,
      y,
    });
  };

  const getCroppedImg = (): Promise<Blob | null> => {
  return new Promise((resolve) => {
    const image = imgRef.current;
    const crop = completedCrop;

    if (!image || !crop) {
      resolve(null);
      return;
    }

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

    canvas.toBlob((blob) => {
      resolve(blob || null);
    }, "image/jpeg");
  });
};



  const handleCropComplete = async () => {
  const croppedBlob = await getCroppedImg();
  if (!croppedBlob) return;

  try {
    // Get original file name & type
    const originalFile = (handleImageUpload as any).currentFile as File;
    const croppedFile = new File([croppedBlob], originalFile.name, { type: originalFile.type });

    // Step 1: Get upload URL
    const blobUrl = await fetchBlogUrl(croppedFile);
    if (!blobUrl) throw new Error("Failed to get blob URL");

    // Step 2: Upload image file directly
    const response = await MEDIA_SERVICES.uploadImage(blobUrl, croppedFile);

    if (response.success) {
      toast({
        title: "Success",
        description: "Image uploaded successfully",
      });

      // Step 3: Save blob URL for preview (thumbnail)
      setFormData((prev) => ({
        ...prev,
        thumbnail: blobUrl.split("?")[0], // Remove SAS token for safe storage
      }));
    } else {
      toast({
        title: "Error",
        description: response.message,
        variant: "destructive",
      });
    }
  } catch (error) {
    console.error(error);
    toast({
      title: "Error",
      description: "Failed to upload cropped image",
      variant: "destructive",
    });
  } finally {
    // Close crop modal
    setIsCropDialogOpen(false);
    setImageToCrop("");
    setCompletedCrop(null);
  }
};


  const handleRemoveImage = () => {
    setFormData({
      ...formData,
      thumbnail: "",
    });
  };

  const handleAddCategory = async () => {
    if (addStep === "basic") {
      if (!formData.name) {
        toast({
          title: "Error",
          description: "Please enter category name",
          variant: "destructive",
        });
        return;
      }

      try {
        setIsLoading(true);
        const categoryData = {
          name: formData.name,
          description: "",
          thumbnail: "",
          status: "inactive" as "active" | "inactive"
        };
        const response = await CATEGORY_SERVICES.addCategory(categoryData);
        setNewCategoryId(response.data.id);
        setCategories([...categories, response.data]);
        setAddStep("complete");
        toast({
          title: "Success",
          description: "Category created. Now you can add an image and set status.",
        });
      } catch (error) {
        toast({
          title: "Error",
          description: "Failed to create category",
          variant: "destructive",
        });
      } finally {
        setIsLoading(false);
      }
    }
  };

  const handleUpdateCategoryImage = async () => {
    if (!newCategoryId) return;

    try {
      setIsLoading(true);

      // Update name, image and status
      const updates: any = {
        name: formData.name,
        status: formData.status
      };

      if (formData.thumbnail) {
        await CATEGORY_SERVICES.updateCategoryImage(newCategoryId, formData.thumbnail);
      }

      await CATEGORY_SERVICES.updateCategory(newCategoryId, updates);

      // Refresh categories
      await loadCategories();

      setIsAddDialogOpen(false);
      resetForm();
      setAddStep("basic");
      setNewCategoryId(null);

      toast({
        title: "Success",
        description: "Category updated successfully",
      });
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to update category",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleEditCategory = async () => {
    if (!selectedCategory) return;

    try {
      setIsLoading(true);

      // Update image if provided
      if (formData.thumbnail && formData.thumbnail !== selectedCategory.thumbnail) {
        await CATEGORY_SERVICES.updateCategoryImage(selectedCategory.id, formData.thumbnail);
      }

      // Update name and status
      const response = await CATEGORY_SERVICES.updateCategory(
        selectedCategory.id,
        {
          name: formData.name,
          status: formData.status
        }
      );

      setCategories(
        categories.map((cat) =>
          cat.id === selectedCategory.id ? response.data : cat
        )
      );
      setIsEditDialogOpen(false);
      resetForm();
      toast({
        title: "Success",
        description: "Category updated successfully",
      });
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to update category",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleDeleteCategory = async () => {
    if (!selectedCategory) return;
    // try {
    //   setIsLoading(true);
    //   await CATEGORY_SERVICES.deleteCategory(selectedCategory.id);
    //   setCategories(categories.filter((cat) => cat.id !== selectedCategory.id));
    //   setIsDeleteDialogOpen(false);
    //   setSelectedCategory(null);
    //   toast({
    //     title: "Success",
    //     description: "Category deleted successfully",
    //   });
    // } catch (error) {
    //   toast({
    //     title: "Error",
    //     description: "Failed to delete category",
    //     variant: "destructive",
    //   });
    // } finally {
    //   setIsLoading(false);
    // }
  };

  const openEditDialog = (category: Category) => {
    setSelectedCategory(category);
    setFormData({
      name: category.name,
      thumbnail: category.thumbnail || "",
      description: category.description,
      status: category.status,
    });
    setIsEditDialogOpen(true);
  };

  const openDeleteDialog = (category: Category) => {
    setShowComingSoon(true)

    // setSelectedCategory(category);
    // setIsDeleteDialogOpen(true);
  };

  const resetForm = () => {
    setFormData({
      name: "",
      thumbnail: "",
      description: "",
      status: "inactive",
    });
    setSelectedCategory(null);
    setAddStep("basic");
    setNewCategoryId(null);
  };

  const filteredCategories = categories.filter((category) =>
    category.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    category.description.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="container mx-auto py-10 px-4">
      <div className="flex justify-between items-start mb-8">
        <div>
          <h1 className="text-4xl font-bold mb-2">Categories</h1>
          <p className="text-muted-foreground">
            Organize your products into categories
          </p>
        </div>
        <Button onClick={() => setIsAddDialogOpen(true)} size="lg">
          <Plus className="mr-2 h-4 w-4" />
          Add Category
        </Button>
      </div>

      <div className="mb-6">
        <div className="relative max-w-md">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
          <Input
            placeholder="Search categories..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-10"
          />
        </div>
      </div>

      <div className="border rounded-lg">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead className="">Image</TableHead>
              <TableHead className="">Name</TableHead>
              <TableHead className="text-center">Products</TableHead>
              <TableHead className="text-center">Status</TableHead>
              <TableHead className="text-right">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {isLoading ? (
              <TableRow>
                <TableCell colSpan={5} className="text-center py-8">
                  Loading...
                </TableCell>
              </TableRow>
            ) : filteredCategories.length === 0 ? (
              <TableRow>
                <TableCell colSpan={5} className="text-center py-8">
                  No categories found
                </TableCell>
              </TableRow>
            ) : (
              filteredCategories.map((category) => (
                <TableRow key={category.id}>
                  <TableCell className="text-center">
                    {category.thumbnail ? (
                      <img
                        src={category.thumbnail}
                        alt={category.name}
                        className="w-12 h-16 object-cover rounded"
                      />
                    ) : (
                      <div className="w-12 h-16 bg-muted rounded flex items-center justify-center text-xs text-muted-foreground">
                        No image
                      </div>
                    )}
                  </TableCell>
                  <TableCell className="font-medium">{category.name}</TableCell>
                  <TableCell className="text-center">{category.productCount || 0}</TableCell>
                  <TableCell className="text-center">
                    <Badge
                      variant={category.status === "active" ? "default" : "secondary"}
                      className={`inline-flex ${category.status === "active"
                        ? "bg-green-100 text-green-800"
                        : "bg-gray-200 text-gray-800"
                        }`}
                    >
                      {category.status.charAt(0).toUpperCase() + category.status.slice(1)}
                    </Badge>
                  </TableCell>


                  <TableCell className="text-right">
                    <div className="flex justify-end gap-2">
                      <Button
                        variant="ghost"
                        size="icon"
                        onClick={() => openEditDialog(category)}
                      >
                        <Pencil className="h-4 w-4" />
                      </Button>
                      <Button
                        variant="ghost"
                        size="icon"
                        onClick={() => openDeleteDialog(category)}
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                  </TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </div>

      {/* Add Category Dialog */}
      <Dialog open={isAddDialogOpen} onOpenChange={(open) => {
        if (!open) {
          resetForm();
        }
        setIsAddDialogOpen(open);
      }}>
        <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>
              {addStep === "basic" ? "Add New Category" : "Complete Category Setup"}
            </DialogTitle>
            <DialogDescription>
              {addStep === "basic"
                ? "Enter basic category information"
                : "Add category image and set status"}
            </DialogDescription>
          </DialogHeader>
          <CategoryFormFields
            formData={formData}
            setFormData={setFormData}
            onImageUpload={handleImageUpload}
            onRemoveImage={handleRemoveImage}
            step={addStep}
          />
          <DialogFooter>
            <Button
              variant="outline"
              onClick={() => {
                setIsAddDialogOpen(false);
                resetForm();
              }}
            >
              Cancel
            </Button>
            {addStep === "basic" ? (
              <Button onClick={handleAddCategory} disabled={isLoading}>
                Create Category
              </Button>
            ) : (
              <Button onClick={handleUpdateCategoryImage} disabled={isLoading}>
                Save Changes
              </Button>
            )}
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Edit Category Dialog */}
      <Dialog open={isEditDialogOpen} onOpenChange={setIsEditDialogOpen}>
        <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>Edit Category</DialogTitle>
            <DialogDescription>
              Update category information and manage status
            </DialogDescription>
          </DialogHeader>
          <CategoryFormFields
            formData={formData}
            setFormData={setFormData}
            onImageUpload={handleImageUpload}
            onRemoveImage={handleRemoveImage}
            step="complete"
          />
          <DialogFooter>
            <Button
              variant="outline"
              onClick={() => {
                setIsEditDialogOpen(false);
                resetForm();
              }}
            >
              Cancel
            </Button>
            <Button onClick={handleEditCategory} disabled={isLoading}>
              Update Category
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Image Crop Dialog */}
      <Dialog open={isCropDialogOpen} onOpenChange={setIsCropDialogOpen}>
        <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>Crop Category Image</DialogTitle>
            <DialogDescription>
              Adjust the crop area to fit a 3:4 aspect ratio
            </DialogDescription>
          </DialogHeader>
          <div className="flex justify-center py-4">
            {imageToCrop && (
              <ReactCrop
                crop={crop}
                onChange={(c) => setCrop(c)}
                onComplete={(c) => setCompletedCrop(c)}
                aspect={3 / 4}
              >
                <img
                  ref={imgRef}
                  src={imageToCrop}
                  onLoad={onImageLoad}
                  alt="Crop preview"
                  style={{ maxHeight: "60vh" }}
                />
              </ReactCrop>
            )}
          </div>
          <DialogFooter>
            <Button
              variant="outline"
              onClick={() => {
                setIsCropDialogOpen(false);
                setImageToCrop("");
                setCompletedCrop(null);
              }}
            >
              Cancel
            </Button>
            <Button onClick={handleCropComplete}>Apply Crop</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Delete Confirmation Dialog */}
      <AlertDialog open={isDeleteDialogOpen} onOpenChange={setIsDeleteDialogOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Are you sure?</AlertDialogTitle>
            <AlertDialogDescription>
              This will permanently delete the category "{selectedCategory?.name}".
              This action cannot be undone.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel onClick={() => setSelectedCategory(null)}>
              Cancel
            </AlertDialogCancel>
            <AlertDialogAction onClick={handleDeleteCategory} disabled={isLoading}>
              Delete
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>

      <ComingSoonDialog
              open={showComingSoon}
              onOpenChange={setShowComingSoon}
            />
    </div>
  );
};
