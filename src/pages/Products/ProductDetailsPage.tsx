import { useEffect, useState } from "react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { PRODUCT_SERVICES } from "@/api/product/product.service";
import { ProductDetails } from "@/types/product.types";
import { toast } from "sonner";
import { ChevronLeft, ChevronRight, Pencil } from "lucide-react";
import { Router, useParams } from "react-router-dom";
import { cn } from "@/utils/tailwind";
import { useAuthStore } from "@/store/authStore";
import { Dialog, DialogContent } from "@/components/ui/dialog";
import { ProductForm } from "@/components/products/ProductForm";
import { ProductImageUpload } from "@/components/products/ProductImageUpload";

export default function ProductDetailsPage() {
  const { id } = useParams();
  const {isAuthenticated} = useAuthStore()

  const [product, setProduct] = useState<ProductDetails | null>(null);
  const [loading, setLoading] = useState(true);

  const [selectedImage, setSelectedImage] = useState<null | number>(null);
  const [selectedVariantId, setSelectedVariantId] = useState("");
  const [quantity, setQuantity] = useState(1);

   const [isTryOnOpen, setIsTryOnOpen] = useState(false);

    const [showImageUpload, setShowImageUpload] = useState(false);

    const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);

  const getTotalStock = (variants: any[] = []) =>
    variants.reduce((sum, v) => sum + (v.stock || 0), 0);

  useEffect(() => {
    async function fetchProduct() {
      try {
        const res = await PRODUCT_SERVICES.getProduct(id as string);
        setProduct(res.data);
      } catch {
        toast.error("Failed to load product");
      } finally {
        setLoading(false);
      }
    }
    fetchProduct();
  }, [id]);

  if (loading)
    return (
      <div className="min-h-screen flex justify-center items-center text-muted-foreground">
        Loading...
      </div>
    );

  if (!product)
    return (
      <div className="min-h-screen flex justify-center items-center text-muted-foreground">
        Product not found
      </div>
    );

    
  const handleTryOnModal = () => {
    if (!isAuthenticated) {
      return
    }
    setIsTryOnOpen(true)
  }

  const discountedPrice = product.discountPercent
    ? (product.price * (100 - product.discountPercent)) / 100
    : product.price;

     const handleEditSuccess = () => {
    setShowImageUpload(true);
  };

  const handleEditImageComplete = () => {
    setShowImageUpload(false);
    setIsEditDialogOpen(false);
  };
  return (
    <div className="min-h-screen bg-background p-8">
      {product ? <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-16">
            {/* Image Gallery */}
            <div className="flex flex-col-reverse md:flex-row gap-4">
              {/* Thumbnails */}
              <div className="flex md:flex-col gap-2 overflow-x-auto md:overflow-visible">
                <button
                    key={'thumbnail'}
                    onClick={() => setSelectedImage(null)}
                    className={cn(
                      "relative w-20 h-24 flex-shrink-0 rounded-lg overflow-hidden border-2 transition-all",
                      selectedImage === null
                        ? "border-primary"
                        : "border-transparent hover:border-border"
                    )}
                  >
                    <img
                      src={product?.thumbnail}
                      alt={`product thumbnail view`}
                      className="w-full h-full object-cover"
                    />
                  </button>

                {product.images.map((img, idx) => (
                  <button
                    key={idx}
                    onClick={() => setSelectedImage(idx)}
                    className={cn(
                      "relative w-20 h-24 flex-shrink-0 rounded-lg overflow-hidden border-2 transition-all",
                       selectedImage === idx
                        ? "border-primary"
                        : "border-transparent hover:border-border"
                    )}
                  >
                    <img
                      src={img}
                      alt={`product view ${idx + 1}`}
                      className="w-full h-full object-cover"
                    />
                  </button>
                ))}
              </div>

              {/* Main Image */}
              <div className="relative flex-1 bg-muted rounded-lg overflow-hidden aspect-[3/4]">
                <img
                  src={selectedImage === null ? product?.thumbnail : product.images[selectedImage]}
                  alt={product.name}
                  className="w-full h-full object-cover"
                />
                <Button
                  variant="ghost"
                  size="icon"
                  className="absolute left-4 top-1/2 -translate-y-1/2 bg-background/80 hover:bg-background"
                  onClick={() => setSelectedImage((prev) => (prev || -1 > 0 ? prev || - 1 : product.images.length - 1))}
                >
                  <ChevronLeft className="h-5 w-5" />
                </Button>
                <Button
                  variant="ghost"
                  size="icon"
                  className="absolute right-4 top-1/2 -translate-y-1/2 bg-background/80 hover:bg-background"
                  onClick={() => setSelectedImage((prev) => ((prev ?? 0) < product.images.length - 1 ? (prev ?? 0) + 1 : 0))}
                >
                  <ChevronRight className="h-5 w-5" />
                </Button>
              </div>
            </div>

            {/* product Info */}
            <div className="space-y-6">
              <div>
                <h1 className="text-2xl md:text-3xl font-light text-foreground mb-2">
                  {product.name}
                </h1>
                <div className="flex items-baseline gap-3">
                  <div className="flex text-2xl md:text-3xl font-light font-pirulen text-neutral-300">
                    <p>₹</p>
                    <p className=" line-through">
                      {product.price.toFixed(2)}
                    </p>
                  </div>

                  {/* Discounted Price */}
                  <p className="text-3xl md:text-4xl font-pirulen font- text-accent">
                    ₹{product.discountPrice.toFixed(2)}
                  </p>
                </div>

              </div>

              {/* Size Selector */}
              <div>
                <label className="block text-sm font-semibold text-foreground mb-3">
                  AVAILABLE SIZE
                </label>
                <div className="flex gap-2">
                  {product.variants.map((variant) => (
                    <button
                      key={variant?.id}
                      onClick={() => setSelectedVariantId(variant?.id)}
                      className={cn(
                        "w-12 h-12 border-2 text-sm font-medium transition-all",
                        selectedVariantId === variant?.id
                          ? "border-foreground bg-foreground text-background"
                          : "border-border hover:border-foreground"
                      )}
                    >
                      {variant.size}
                    </button>
                  ))}
                </div>
              </div>

              {/* Quantity Selector */}
              <div>
                <label className="block text-sm font-semibold text-foreground mb-3">
                  QTY
                </label>
                <div className="flex items-center gap-3">
                  <Button
                    variant="outline"
                    size="icon"
                    onClick={() => setQuantity(Math.max(1, quantity - 1))}
                  >
                    -
                  </Button>
                  <span className="w-12 text-center font-medium">{quantity}</span>
                  <Button
                    variant="outline"
                    size="icon"
                    onClick={() => setQuantity(quantity + 1)}
                  >
                    +
                  </Button>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="flex gap-3 pt-4 ">
                <Button
                  variant={product?.tryOn ? 'default' : 'disabled'}
                  className="flex-1 h-12 font-semibold font-pirulen"
                  disabled={!product?.tryOn}
                  onClick={handleTryOnModal}
                >
                  TRY ON
                </Button>
                <Button
                  variant="default"
                  className="flex-1 h-12 font-semibold font-pirulen"
                  onClick={() => setIsEditDialogOpen(true)}
                >
                  Edit
                </Button>
              </div>

              {/* product Description */}
              <div className="pt-6 border-t border-border">
                <h3 className="font-semibold text-foreground mb-2">product Details</h3>
                <p className="text-sm text-neutral-400  leading-relaxed">
                  {product.description}
                </p>
              </div>
            </div>
          </div> :
          <div>Loading</div> }

          <Dialog open={isEditDialogOpen} onOpenChange={setIsEditDialogOpen}>
                  <DialogContent className="sm:max-w-[600px] max-h-[90vh] overflow-y-auto p-0">
                    {!showImageUpload ? (
                      product && (
                        <ProductForm
                          initialData={product}
                          onSuccess={handleEditSuccess}
                          onCancel={() => {
                            setIsEditDialogOpen(false);
                          }}
                        />
                      )
                    ) : (
                      <ProductImageUpload
                        productId={product?.id || ""}
                        existingImages={[
                          ...(product?.thumbnail ? [product.thumbnail] : []),
                          ...(product?.images || []),
                        ]}
                        onComplete={handleEditImageComplete}
                      />
                    )}
                  </DialogContent>
                </Dialog>
    </div>
  );
}
