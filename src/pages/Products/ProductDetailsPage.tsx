import { useEffect, useState } from "react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { PRODUCT_SERVICES } from "@/api/product/product.service";
import { ProductDetails } from "@/types/product.types";
import { toast } from "sonner";
import { Pencil } from "lucide-react";
import { Router, useParams } from "react-router-dom";

export default function ProductDetailsPage() {
  const { id } = useParams();
  // const router = Router();

  const [product, setProduct] = useState<ProductDetails | null>(null);
  const [loading, setLoading] = useState(true);

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

  const discountedPrice = product.discountPercent
    ? (product.price * (100 - product.discountPercent)) / 100
    : product.price;

  return (
    <div className="min-h-screen bg-background p-8">
      <div className="mx-auto max-w-6xl space-y-10">
        {/* HEADER */}
        <div className="flex justify-between items-center">
          <div>
            <h1 className="text-3xl font-bold">{product.name}</h1>
            <p className="text-muted-foreground">Product details & information</p>
          </div>
          <Button
            variant="default"
            // onClick={() => router.push(`/products?edit=${product.id}`)}
          >
            <Pencil className="mr-2 h-4 w-4" /> Edit
          </Button>
        </div>

        {/* PRODUCT INFO SECTION */}
        <div className="grid gap-8 grid-cols-1 sm:grid-cols-2">
          {/* IMAGES */}
          <div className="space-y-4">
            <img
              src={product.thumbnail}
              alt={product.name}
              className="w-full h-80 object-cover rounded-lg border"
            />

            <div className="grid grid-cols-4 gap-3">
              {(product.images || []).map((img, index) => (
                <img
                  key={index}
                  src={img}
                  alt={`img-${index}`}
                  className="h-20 w-full object-cover rounded border"
                />
              ))}
            </div>
          </div>

          {/* DETAILS */}
          <div className="space-y-5">
            {/* CATEGORY + STATUS */}
            <div className="flex items-center gap-4">
              <Badge>{product.category?.name || "No category"}</Badge>
              <Badge variant={product.status === "active" ? "default" : "secondary"}>
                {product.status}
              </Badge>
              {product.tryOn && <Badge variant="outline">Try-On Supported</Badge>}
            </div>

            {/* PRICE */}
            <div>
              <span className="text-3xl font-bold">₹{discountedPrice.toFixed(2)}</span>
              {product.discountPercent > 0 && (
                <span className="ml-3 text-muted-foreground line-through">
                  ₹{product.price.toFixed(2)}
                </span>
              )}
              {product.discountPercent > 0 && (
                <span className="ml-2 text-sm text-green-600 font-medium">
                  ({product.discountPercent}% OFF)
                </span>
              )}
            </div>

            {/* STOCK */}
            <p className="text-lg">
              Stock:{" "}
              <span
                className={
                  getTotalStock(product.variants) < 10
                    ? "text-destructive font-semibold"
                    : "font-semibold"
                }
              >
                {getTotalStock(product.variants)} pcs
              </span>
            </p>

            {/* DESCRIPTION */}
            <div>
              <h2 className="font-medium mb-2">Description:</h2>
              <p className="text-muted-foreground">{product.description}</p>
            </div>

            {/* CREATED AT */}
            <p className="text-sm text-muted-foreground">
              Added On: {new Date(product.createdAt).toLocaleDateString()}
            </p>
          </div>
        </div>

        {/* CATEGORY + VARIANT INFO SECTION (future expandable UI) */}
      </div>
    </div>
  );
}
