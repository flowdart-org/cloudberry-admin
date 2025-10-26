import { Category } from "@/types/category.types";
import { CreateCategoryDTO, updateCategoryDTO } from "./category.dto";
import { ApiResponse } from "@/types/common";

// Dummy data for testing
const dummyCategories: Category[] = [
  {
    id: "1",
    name: "Electronics",
    thumbnail: '',
    description: "Electronic devices and accessories",
    status: "active",
    productCount: 45,
  },
  {
    id: "2",
    name: "Accessories",
    thumbnail: '',
    description: "Phone and computer accessories",
    status: "active",
    productCount: 23,
  },
  {
    id: "3",
    name: "Home & Garden",
    thumbnail: '',
    description: "Home improvement and garden supplies",
    status: "active",
    productCount: 67,
  },
];

let categoryIdCounter = 4;

export const CATEGORY_SERVICES = {
  addCategory: async (data: CreateCategoryDTO): Promise<ApiResponse<Category>> => {
    // Simulate API delay
    await new Promise(resolve => setTimeout(resolve, 500));
    
    const newCategory: Category = {
      id: String(categoryIdCounter++),
      ...data,
      productCount: 0,
    };
    
    dummyCategories.push(newCategory);
    
    return { message: 'Product fetched successfully', success: true, data: newCategory };
  },

  getCategory: async (id: string): Promise<ApiResponse<Category>> => {
    // Simulate API delay
    await new Promise(resolve => setTimeout(resolve, 300));
    
    const category = dummyCategories.find(c => c.id === id);
    if (!category) {
      throw new Error("Category not found");
    }
    
    return { message: 'Product fetched successfully', success: true, data: category };
  },

  getCategories: async (): Promise<ApiResponse<Category[]>> => {
    // Simulate API delay
    await new Promise(resolve => setTimeout(resolve, 500));
    
    return { message: 'Product fetched successfully', success: true, data: dummyCategories };
  },

  updateCategory: async (id: string, data: updateCategoryDTO): Promise<ApiResponse<Category>> => {
    // Simulate API delay
    await new Promise(resolve => setTimeout(resolve, 500));
    
    const index = dummyCategories.findIndex(c => c.id === id);
    if (index === -1) {
      throw new Error("Category not found");
    }
    
    const updatedCategory = {
      ...dummyCategories[index],
      ...data,
    };
    
    dummyCategories[index] = updatedCategory;
    
    return { message: 'Product fetched successfully', success: true, data: updatedCategory };
  },

  deleteCategory: async (id: string): Promise<ApiResponse<void>> => {
    // Simulate API delay
    await new Promise(resolve => setTimeout(resolve, 300));
    
    const index = dummyCategories.findIndex(c => c.id === id);
    if (index === -1) {
      throw new Error("Category not found");
    }
    
    dummyCategories.splice(index, 1);
    
    return { message: 'Product fetched successfully', success: true, data: undefined as any };
  },
};
