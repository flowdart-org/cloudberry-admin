import { Product } from "@/types/product.types";
import { CreateProductDTO, updateProductDTO } from "./product.dto";
import { ApiResponse } from "@/types/common";


const dummyProducts: Product[] = [
  {
    id: "1",
    name: "Wireless Headphones",
    description: "Premium noise-cancelling wireless headphones with 30-hour battery life",
    actualPrice: 299.99,
    discountPercent: 15,
    discountPrice: 254.99,
    categoryId: 1,
    status: "active",
    tryOn: true,
    tags: ["electronics", "audio", "wireless"],
    variants: [
      { size: "Black", stock: 45 },
      { size: "White", stock: 30 },
      { size: "Silver", stock: 15 },
    ],
  },
  {
    id: "2",
    name: "Smart Watch Pro",
    description: "Advanced fitness tracking with heart rate monitor and GPS",
    actualPrice: 399.99,
    discountPercent: 10,
    discountPrice: 359.99,
    categoryId: 1,
    status: "active",
    tryOn: true,
    tags: ["electronics", "wearable", "fitness"],
    variants: [
      { size: "40mm", stock: 23 },
      { size: "44mm", stock: 18 },
    ],
  },
  {
    id: "3",
    name: "Laptop Stand",
    description: "Ergonomic aluminum laptop stand with adjustable height",
    actualPrice: 49.99,
    discountPercent: 0,
    discountPrice: 49.99,
    categoryId: 2,
    status: "active",
    tryOn: false,
    tags: ["accessories", "workspace"],
    variants: [
      { size: "Standard", stock: 8 },
    ],
  },
  {
    id: "4",
    name: "Wireless Mouse",
    description: "Comfortable wireless mouse with precision tracking",
    actualPrice: 79.99,
    discountPercent: 20,
    discountPrice: 63.99,
    categoryId: 2,
    status: "inactive",
    tryOn: false,
    tags: ["electronics", "accessories"],
    variants: [
      { size: "Black", stock: 50 },
      { size: "White", stock: 35 },
    ],
  },
];

let productIdCounter = 5;

export const PRODUCT_SERVICES = {
  addProduct: async (data: CreateProductDTO): Promise<ApiResponse<Product>> => {
    // Simulate API delay
    await new Promise(resolve => setTimeout(resolve, 500));
    
    const newProduct: Product = {
      id: String(productIdCounter++),
      ...data,
      discountPrice: data.actualPrice - (data.actualPrice * data.discountPercent / 100),
      variants: [],
    };
    
    dummyProducts.push(newProduct);
    
    return { message: 'Product added successfully', success: true, data: newProduct };
  },

  getProduct: async (id: string): Promise<ApiResponse<Product>> => {
    // Simulate API delay
    await new Promise(resolve => setTimeout(resolve, 300));
    
    const product = dummyProducts.find(p => p.id === id);
    if (!product) {
      throw new Error("Product not found");
    }
    
    return { message: 'Product fetched successfully', success: true, data: product };
  },

  getProducts: async (): Promise<ApiResponse<Product[]>> => {
    // Simulate API delay
    await new Promise(resolve => setTimeout(resolve, 500));
    
    return { message: 'Products fetched successfully', success: true, data: dummyProducts };
  },

  updateProducts: async (id: string, data: updateProductDTO): Promise<ApiResponse<Product>> => {
    // Simulate API delay
    await new Promise(resolve => setTimeout(resolve, 500));
    
    const index = dummyProducts.findIndex(p => p.id === id);
    if (index === -1) {
      throw new Error("Product not found");
    }
    
    const updatedProduct = {
      ...dummyProducts[index],
      ...data,
      discountPrice: (data.actualPrice ?? dummyProducts[index].actualPrice) - 
        ((data.actualPrice ?? dummyProducts[index].actualPrice) * (data.discountPercent ?? dummyProducts[index].discountPercent) / 100),
    };
    
    dummyProducts[index] = updatedProduct;
    
    return { message: 'Product updated successfully', success: true, data: updatedProduct };
  },

  deleteProduct: async (id: string): Promise<ApiResponse<void>> => {
    // Simulate API delay
    await new Promise(resolve => setTimeout(resolve, 300));
    
    const index = dummyProducts.findIndex(p => p.id === id);
    if (index === -1) {
      throw new Error("Product not found");
    }
    
    dummyProducts.splice(index, 1);
    
    return { message: 'Product deleted successfully', success: true, data: undefined as any };
  },
};
