"use client";

import { useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { Check, Upload } from "lucide-react";

import { MEDIA_SERVICES } from "@/api/media/media.service";
import { useHomeSectionStore } from "@/store/useHomeSectionStore";
import { useToast } from "@/hooks/use-toast";
import { useCategoryStore } from "@/store/useCategoryStore";

export default function HomeSectionConfigPage() {
  const {categories} = useCategoryStore()
  const {
    products,
    selectedCategories,
    selectedProducts,
    title,
    subtitle,
    bannerImage,
    visibleProducts,
    visibleCategories,
    loading,
    init,
    setTitle,
    setSubtitle,
    setBannerImage,
    toggleProduct,
    toggleCategory,
    loadMoreProducts,
    saveLandingPage,
  } = useHomeSectionStore();

  // const { showToast } = useToast?.() || { showToast: () => {} }; // fallback if not using toast

  const { toast } = useToast();

  useEffect(() => {
    init();
  }, [init]);

  const handleUpload = async (e: any) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const localUrl = URL.createObjectURL(file);
    setBannerImage(localUrl);

    try {
      const response = await MEDIA_SERVICES.getHeroImageUploadUrl();
      await MEDIA_SERVICES.uploadImage(response.data.uploadUrl, file);
      // ideally backend returns final public URL; then you’d update bannerImage with that
      // showToast?.("Banner uploaded", "success");
      toast({
      title: 'Updated',
      description: 'Banner uploaded successfully',
    });
    } catch (error) {
      console.error(error);
      toast({
      title: 'Failed',
      description: 'Failed to upload banner',
    });
      // showToast?.("Failed to upload banner", "error");
    }
  };

  const handleSaveChanges = async () => {
    await saveLandingPage();
    // showToast?.("Landing page updated", "success");
     toast({
      title: 'Updated',
      description: 'Landing page updated',
    });
  };

  return (
    <div className="space-y-10 max-w-5xl mx-auto px-4 py-10">
      {/* ---------------- UI SECTION 1 ---------------- */}
      <section>
        <h1 className="text-2xl font-bold">Homepage Visual Configuration</h1>
        <p className="text-sm text-muted-foreground">
          Upload homepage text and images that users will see first.
        </p>

        {/* Banner */}
        <Card className="mt-6">
          <CardHeader>
            <CardTitle>Homepage Banner</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <label className="border rounded-lg border-dashed p-4 cursor-pointer flex flex-col items-center justify-center hover:bg-muted/40 transition">
              <Upload className="mb-2 opacity-60" />
              <span className="text-sm text-muted-foreground">Click to upload banner</span>
              <Input
                type="file"
                className="hidden"
                accept="image/*"
                onChange={handleUpload}
              />
            </label>

            {bannerImage && (
              <div className="relative h-40 w-full rounded-lg overflow-hidden border">
                <img src={bannerImage} alt="Banner" className="object-cover w-full h-full" />
              </div>
            )}
          </CardContent>
        </Card>
      </section>

      <Separator className="my-8" />

      {/* ---------------- UI SECTION 2 ---------------- */}
      <section>
        <Card className="my-6">
          <CardHeader>
            <CardTitle>Homepage Text</CardTitle>
          </CardHeader>

          <CardContent className="space-y-4">
            <div className="space-y-2">
              <label className="text-sm font-medium">Title</label>
              <Input
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                placeholder="Eg: Discover great food nearby"
              />
            </div>

            <div className="space-y-2">
              <label className="text-sm font-medium">Subtitle</label>
              <Input
                value={subtitle}
                onChange={(e) => setSubtitle(e.target.value)}
                placeholder="Eg: Explore restaurants, offers & more"
              />
            </div>
          </CardContent>
        </Card>

        <h1 className="text-2xl font-bold">Homepage Listing Setup</h1>
        <p className="text-sm text-muted-foreground">
          Select up to 10 products and categories to highlight on the homepage.
        </p>

        {/* Product Selection */}
        <Card className="mt-6">
          <CardHeader>
            <CardTitle>Featured Products (max: 10)</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
              {products.slice(0, visibleProducts).map((product) => {
                const isSelected = selectedProducts.includes(product.id);
                return (
                  <div
                    key={product.id}
                    onClick={() => toggleProduct(product.id, 10)}
                    className={`relative rounded-lg overflow-hidden border cursor-pointer transition hover:scale-[1.02] 
                      ${isSelected && "ring-2 ring-primary"}`}
                  >
                    <img
                      src={product.thumbnail}
                      alt={product.name}
                      className="object-cover w-full h-48"
                    />
                    <div className="p-2 text-sm font-medium">{product.name}</div>

                    {isSelected && (
                      <Badge className="absolute top-2 right-2 flex items-center gap-1">
                        <Check size={14} /> Selected
                      </Badge>
                    )}
                  </div>
                );
              })}
            </div>

            {visibleProducts < products.length && (
              <div className="flex justify-center">
                <Button variant="outline" size="sm" onClick={() => loadMoreProducts(8)}>
                  Load more products
                </Button>
              </div>
            )}
          </CardContent>
        </Card>

        {/* Categories Selection */}
        <Card className="mt-6">
          <CardHeader>
            <CardTitle>Featured Categories (max: 10)</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
              {categories.slice(0, visibleCategories).map((cat) => {
                const isSelected = selectedCategories.includes(cat.id);
                return (
                  <div
                    key={cat.id}
                    onClick={() => toggleCategory(cat.id, 10)}
                    className={`relative rounded-lg overflow-hidden border cursor-pointer transition hover:scale-[1.02] 
                      ${isSelected && "ring-2 ring-primary"}`}
                  >
                    <img
                      src={cat.thumbnail}
                      alt={cat.name}
                      className="object-cover w-full h-28"
                    />
                    <div className="p-2 text-sm font-medium">{cat.name}</div>

                    {isSelected && (
                      <Badge className="absolute top-2 right-2 flex items-center gap-1">
                        <Check size={14} /> Selected
                      </Badge>
                    )}
                  </div>
                );
              })}
            </div>
          </CardContent>
        </Card>
      </section>

      {/* Save Button */}
      <div className="flex justify-end">
        <Button size="lg" onClick={handleSaveChanges} disabled={loading}>
          {loading ? "Saving..." : "Save Changes"}
        </Button>
      </div>
    </div>
  );
}
