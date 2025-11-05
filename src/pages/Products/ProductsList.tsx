import { useState, useEffect, useRef } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle } from "@/components/ui/alert-dialog";
import { Plus, Search, Pencil, Trash2, Crop } from "lucide-react";
import { toast } from "sonner";
import {  VariantDto, ProductImage, Product } from "@/types/product.types";
import ReactCrop, { Crop as CropType, PixelCrop } from 'react-image-crop';
import 'react-image-crop/dist/ReactCrop.css';
import { PRODUCT_SERVICES } from "@/api/product/product.service";
import { updateProductDTO } from "@/api/product/product.dto";
import { ProductFormFields } from "@/components/products/ProductFormFields";
import { productApi } from "@/lib/axios";
import { ProductForm } from "@/components/products/ProductForm";
import { ProductImageUpload } from "@/components/products/ProductImageUpload";
import { CreateProductDto } from "@/api/client";

export default function ProductTable() {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  const [deleteProductId, setDeleteProductId] = useState<string | null>(null);
  const [currentProduct, setCurrentProduct] = useState<Product | null>(null);
  const [createdProductId, setCreatedProductId] = useState<string | null>(null);
  const [formData, setFormData] = useState<Product>({
    id: '',
    name: "",
    description: "",
    price: 0,
    discountPercent: 0,
    categoryId: "",
    status: "active",
    tryOn: false,
    tags: [],
    variants: [],
    images: [],
    thumbnail: "",
  });
  const [newTag, setNewTag] = useState("");
  const [newVariant, setNewVariant] = useState<VariantDto>({ size: "", stock: 0 });
  const [isCropDialogOpen, setIsCropDialogOpen] = useState(false);
  const [imageToCrop, setImageToCrop] = useState<string | null>(null);
  const [crop, setCrop] = useState<CropType>({
    unit: '%',
    width: 75,
    height: 100,
    x: 12.5,
    y: 0,
  });
  const [completedCrop, setCompletedCrop] = useState<PixelCrop | null>(null);
  const imgRef = useRef<HTMLImageElement>(null);


  useEffect(() => {
    fetchProducts();
  }, []);

  const fetchProducts = async () => {
    try {
      setLoading(true);
      const response = await PRODUCT_SERVICES.getProducts();
      setProducts(response.data || []);
    } catch (error) {
      toast.error("Failed to fetch products");
      console.error("Error fetching products:", error);
    } finally {
      setLoading(false);
    }
  };

  const filteredProducts = products.filter((product) =>
    product.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    product.description.toLowerCase().includes(searchQuery.toLowerCase())
  );


  const handleAddProduct = async () => {
    if (!formData.name || !formData.description || !formData.price || !formData.categoryId) {
      toast.error("Please fill in all required fields");
      return;
    }

    if (formData.variants.length === 0) {
      toast.error("Please add at least one variant");
      return;
    }

    // if (formData.images.length === 0) {
    //   toast.error("Please add at least one image");
    //   return;
    // }

    // if (!formData.thumbnail) {
    //   toast.error("Please set a thumbnail image");
    //   return;
    // }

    try {
      const productData: CreateProductDto = {
        name: formData.name,
        description: formData.description,
        discountPercent: formData.discountPercent,
        categoryId: formData.categoryId,
        status: formData.status,
        tryOn: formData.tryOn,
        tags: formData.tags.length > 0 ? formData.tags : undefined,
        variants: [],
        price: formData.price,
      };

      // const response = await PRODUCT_SERVICES.addProduct(productData);
      const { data } = await productApi.productControllerCreate(productData)
      const response = data

      if (response.data) {
        // Update the product with variants
        // await PRODUCT_SERVICES.updateProducts(response.data.id!, {
        //   variants: formData.variants,
        // });
        await fetchProducts();
        setIsAddDialogOpen(false);
        resetForm();
        toast.success("Product added successfully");
      }
    } catch (error) {
      toast.error("Failed to add product");
      console.error("Error adding product:", error);
    }
  };

  const handleEditProduct = async () => {
    if (!currentProduct || !formData.name || !formData.description || !formData.price || !formData.categoryId) {
      toast.error("Please fill in all required fields");
      return;
    }

    if (formData.variants.length === 0) {
      toast.error("Please add at least one variant");
      return;
    }

    if (formData.images.length === 0) {
      toast.error("Please add at least one image");
      return;
    }

    if (!formData.thumbnail) {
      toast.error("Please set a thumbnail image");
      return;
    }

    try {
      const updateData: updateProductDTO = {
        name: formData.name,
        description: formData.description,
        actualPrice: formData.price,
        discountPercent: formData.discountPercent,
        categoryId: parseInt(formData.categoryId),
        status: formData.status,
        tryOn: formData.tryOn,
        tags: formData.tags.length > 0 ? formData.tags : undefined,
        variants: formData.variants,
        images: formData.images,
        thumbnail: formData.thumbnail,
      };

      // await PRODUCT_SERVICES.updateProducts(currentProduct.id!, updateData);
      await fetchProducts();
      setIsEditDialogOpen(false);
      setCurrentProduct(null);
      resetForm();
      toast.success("Product updated successfully");
    } catch (error) {
      toast.error("Failed to update product");
      console.error("Error updating product:", error);
    }
  };

  const handleDeleteProduct = async () => {
    // if (deleteProductId) {
    //   try {
    //     await PRODUCT_SERVICES.deleteProduct(deleteProductId);
    //     await fetchProducts();
    //     setDeleteProductId(null);
    //     toast.success("Product deleted successfully");
    //   } catch (error) {
    //     toast.error("Failed to delete product");
    //     console.error("Error deleting product:", error);
    //   }
    // }
  };

  const openEditDialog = (product: Product) => {
    console.log(product)
    setCurrentProduct(product);
    setFormData({
      id: product.id,
      name: product.name,
      description: product.description,
      price: product.price,
      discountPercent: product.discountPercent,
      categoryId: product.categoryId.toString(),
      status: product.status,
      tryOn: product.tryOn,
      tags: product.tags || [],
      variants: product.variants || [],
      images: product.images || [],
      thumbnail: product.thumbnail || "",
    });
    setIsEditDialogOpen(true);
  };

  const resetForm = () => {
    setFormData({
      id: '',
      name: "",
      description: "",
      price: 0,
      discountPercent: 0,
      categoryId: "",
      status: "active" as "active" | "inactive",
      tryOn: false,
      tags: [],
      variants: [],
      images: [],
      thumbnail: "",
    });
    setNewTag("");
    setNewVariant({ size: "", stock: 0 });
  };

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

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files || files.length === 0) return;

    const file = files[0];
    const reader = new FileReader();

    reader.onload = (event) => {
      setImageToCrop(event.target?.result as string);
      setIsCropDialogOpen(true);
    };

    reader.readAsDataURL(file);
    e.target.value = "";
  };

  const onImageLoad = (e: React.SyntheticEvent<HTMLImageElement>) => {
    const { width, height } = e.currentTarget;
    const aspectRatio = 3 / 4;

    // Calculate initial crop to maintain 3:4 aspect ratio
    const cropWidth = 75;
    const cropHeight = cropWidth / aspectRatio * (width / height);

    setCrop({
      unit: '%',
      width: cropWidth,
      height: cropHeight,
      x: (100 - cropWidth) / 2,
      y: (100 - cropHeight) / 2,
    });
  };

  const getCroppedImg = async (): Promise<string> => {
    if (!completedCrop || !imgRef.current) {
      return imageToCrop || "";
    }

    const image = imgRef.current;
    const canvas = document.createElement('canvas');
    const scaleX = image.naturalWidth / image.width;
    const scaleY = image.naturalHeight / image.height;

    canvas.width = completedCrop.width;
    canvas.height = completedCrop.height;
    const ctx = canvas.getContext('2d');

    if (!ctx) {
      throw new Error('No 2d context');
    }

    ctx.drawImage(
      image,
      completedCrop.x * scaleX,
      completedCrop.y * scaleY,
      completedCrop.width * scaleX,
      completedCrop.height * scaleY,
      0,
      0,
      completedCrop.width,
      completedCrop.height
    );

    return new Promise((resolve) => {
      canvas.toBlob((blob) => {
        if (!blob) {
          resolve(imageToCrop || "");
          return;
        }
        const reader = new FileReader();
        reader.onloadend = () => {
          resolve(reader.result as string);
        };
        reader.readAsDataURL(blob);
      }, 'image/jpeg', 0.95);
    });
  };

  const handleCropComplete = async () => {
    try {
      const croppedImageUrl = await getCroppedImg();

      const newImage: ProductImage = {
        id: Math.random().toString(36).substr(2, 9),
        url: croppedImageUrl,
        isThumbnail: formData.images.length === 0,
      };

      setFormData((prev) => {
        const updatedImages = [...prev.images, newImage];
        return {
          ...prev,
          images: updatedImages,
          thumbnail: prev.thumbnail || newImage.url,
        };
      });

      setIsCropDialogOpen(false);
      setImageToCrop(null);
      setCrop({
        unit: '%',
        width: 75,
        height: 100,
        x: 12.5,
        y: 0,
      });
      setCompletedCrop(null);
      toast.success("Image added successfully");
    } catch (error) {
      toast.error("Failed to crop image");
      console.error("Error cropping image:", error);
    }
  };

  const removeImage = (imageId: string) => {
    setFormData((prev) => {
      const updatedImages = prev.images.filter((img) => img.id !== imageId);
      const removedImage = prev.images.find((img) => img.id === imageId);

      let newThumbnail = prev.thumbnail;
      if (removedImage?.url === prev.thumbnail && updatedImages.length > 0) {
        newThumbnail = updatedImages[0].url;
      } else if (updatedImages.length === 0) {
        newThumbnail = "";
      }

      return {
        ...prev,
        images: updatedImages,
        thumbnail: newThumbnail,
      };
    });
  };

  const setThumbnail = (imageUrl: string) => {
    setFormData((prev) => ({
      ...prev,
      thumbnail: imageUrl,
    }));
  };

  const handleSuccess = async (product: CreateProductDto) => {
  const response = await PRODUCT_SERVICES.addProduct(product);

  if (response?.data) {
    setFormData(response.data);
    setProducts((prevProducts) => [...prevProducts, response.data]);
    if (response.data.id) {
      setCreatedProductId(response.data.id);
    }
  }
};


  const handleCancel = () => {
    console.log("Form cancelled");
    setCreatedProductId(null);
  };

  const handleImageUploadComplete = () => {
    console.log("Image upload complete");
    setCreatedProductId(null);
  };

  return (
    <div className="min-h-screen bg-background p-8">
      <div className="mx-auto max-w-7xl">
        {/* Header */}
        <div className="mb-8 flex items-start justify-between">
          <div>
            <h1 className="text-4xl font-bold text-foreground">Products</h1>
            <p className="mt-2 text-muted-foreground">Manage your product inventory</p>
          </div>
          <Button onClick={() => setIsAddDialogOpen(true)} className="bg-primary text-primary-foreground hover:bg-primary/90">
            <Plus className="mr-2 h-4 w-4" />
            Add Product
          </Button>
        </div>

        {/* Search */}
        <div className="mb-6">
          <div className="relative max-w-md">
            <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
            <Input
              placeholder="Search products..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-10"
            />
          </div>
        </div>

        {/* Table */}
        <div className="overflow-hidden rounded-lg border border-border bg-card">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="border-b border-border bg-muted/50">
                <tr>
                  <th className="px-6 py-4 text-left text-sm font-medium text-muted-foreground">Product</th>
                  <th className="px-6 py-4 text-left text-sm font-medium text-muted-foreground">Category</th>
                  <th className="px-6 py-4 text-left text-sm font-medium text-muted-foreground">Price</th>
                  <th className="px-6 py-4 text-left text-sm font-medium text-muted-foreground">Discount</th>
                  {/* <th className="px-6 py-4 text-left text-sm font-medium text-muted-foreground">Stock</th> */}
                  <th className="px-6 py-4 text-left text-sm font-medium text-muted-foreground">Status</th>
                  <th className="px-6 py-4 text-left text-sm font-medium text-muted-foreground">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-border">
                {loading ? (
                  <tr>
                    <td colSpan={6} className="px-6 py-8 text-center text-muted-foreground">
                      Loading products...
                    </td>
                  </tr>
                ) : filteredProducts.length === 0 ? (
                  <tr>
                    <td colSpan={6} className="px-6 py-8 text-center text-muted-foreground">
                      No products found
                    </td>
                  </tr>
                ) : (
                  filteredProducts.map((product) => (
                    <tr key={product.id} className="transition-colors hover:bg-muted/30">
                      <td className="px-6 py-4">
                        <div className="flex items-center gap-3">
                          {product.thumbnail ?
                            <img
                              src={product.thumbnail}
                              alt="Product"
                              className="object-cover w-10 h-full"
                            /> : <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-accent text-2xl">
                              📦
                            </div>}
                          <div>
                            <div className="font-medium text-foreground">{product.name}</div>
                            <div className="text-sm text-muted-foreground line-clamp-1">{product.description}</div>
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-4 text-foreground">{product?.category?.name}</td>

                      <td className="px-6 py-4">
                        <div className="flex flex-col">
                          <span className="font-medium text-foreground">
                            {(product?.price / 100) * (100 - product?.discountPercentage)}
                          </span>
                          {product.discountPercentage > 0 && (
                            <span className="text-xs text-muted-foreground line-through">
                              {product.price}
                            </span>
                          )}
                        </div>
                      </td>
                      <td className="px-6 py-4 text-foreground">{product?.discountPercentage}%</td> 
                      {/* <td className="px-6 py-4">
                        <span className={getTotalStock(product.variants) < 10 ? "font-medium text-destructive" : "text-foreground"}>
                          {getTotalStock(product.variants)}
                        </span>
                      </td> */}
                      <td className="px-6 py-4">
                        <Badge variant={product.status === "active" ? "default" : "secondary"}>
                          {product.status}
                        </Badge>
                      </td>
                      <td className="px-6 py-4">
                        <div className="flex items-center gap-2">
                          <Button
                            variant="ghost"
                            size="icon"
                            onClick={() => openEditDialog(product)}
                            className="h-8 w-8"
                          >
                            <Pencil className="h-4 w-4" />
                          </Button>
                          <Button
                            variant="ghost"
                            size="icon"
                            onClick={() => setDeleteProductId(product.id!)}
                            className="h-8 w-8 text-destructive hover:text-destructive"
                          >
                            <Trash2 className="h-4 w-4" />
                          </Button>
                        </div>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>

      {/* Add Product Dialog */}
      <Dialog open={isAddDialogOpen} onOpenChange={setIsAddDialogOpen}>
        <DialogContent className="sm:max-w-[600px] max-h-[90vh] overflow-y-auto p-0">
          {/* <DialogHeader>
            <DialogTitle>Add Product</DialogTitle>
            <DialogDescription>Add a new product to your inventory</DialogDescription>
          </DialogHeader> */}
          {/* <ProductFormFields
            formData={formData}
            setFormData={setFormData}
            newTag={newTag}
            setNewTag={setNewTag}
            newVariant={newVariant}
            setNewVariant={setNewVariant}
            categories={[]}
            calculateDiscountPrice={calculateDiscountPrice}
          /> */}
          {!createdProductId ? (
            <ProductForm onSuccess={handleSuccess} onCancel={handleCancel} />
          ) : (
            <ProductImageUpload
              productId={createdProductId}
              onComplete={handleImageUploadComplete}
            />
          )}
          {/* <DialogFooter>
            <Button variant="outline" onClick={() => setIsAddDialogOpen(false)}>
              Cancel
            </Button>
            <Button onClick={handleAddProduct}>Add Product</Button>
          </DialogFooter> */}
        </DialogContent>
      </Dialog>

      {/* Edit Product Dialog */}
      <Dialog open={isEditDialogOpen} onOpenChange={setIsEditDialogOpen}>
        <DialogContent className="sm:max-w-[600px] max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>Edit Product</DialogTitle>
            <DialogDescription>Update product information</DialogDescription>
          </DialogHeader>
          {/* <ProductFormFields
            formData={formData}
            setFormData={setFormData}
            newTag={newTag}
            setNewTag={setNewTag}
            newVariant={newVariant}
            setNewVariant={setNewVariant}
            categories={[]}
            calculateDiscountPrice={calculateDiscountPrice}
          /> */}
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsEditDialogOpen(false)}>
              Cancel
            </Button>
            <Button onClick={handleEditProduct}>Save Changes</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Delete Confirmation Dialog */}
      <AlertDialog open={deleteProductId !== null} onOpenChange={() => setDeleteProductId(null)}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Are you sure?</AlertDialogTitle>
            <AlertDialogDescription>
              This action cannot be undone. This will permanently delete the product from your inventory.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction onClick={handleDeleteProduct} className="bg-destructive text-destructive-foreground hover:bg-destructive/90">
              Delete
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>

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
            <Button variant="outline" onClick={() => setIsCropDialogOpen(false)}>
              Cancel
            </Button>
            <Button onClick={handleCropComplete}>
              <Crop className="mr-2 h-4 w-4" />
              Crop & Add Image
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
