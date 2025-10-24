import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Plus, Search } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { ProductTable } from '@/components/products/ProductTable';
import { Product } from '@/types/product';
import { ROUTES } from '@/config/routes.config';

// Mock data
const mockProducts: Product[] = [
  {
    id: '1',
    name: 'Wireless Headphones',
    description: 'Premium noise-cancelling headphones',
    price: 299.99,
    category: 'Electronics',
    categoryId: '1',
    stock: 45,
    image: 'https://images.unsplash.com/photo-1505740420928-5e560c06d30e',
    sku: 'WH-001',
    status: 'active',
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  },
  {
    id: '2',
    name: 'Smart Watch',
    description: 'Fitness tracking smartwatch',
    price: 399.99,
    category: 'Electronics',
    categoryId: '1',
    stock: 23,
    image: 'https://images.unsplash.com/photo-1523275335684-37898b6baf30',
    sku: 'SW-002',
    status: 'active',
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  },
  {
    id: '3',
    name: 'Laptop Stand',
    description: 'Ergonomic aluminum laptop stand',
    price: 49.99,
    category: 'Accessories',
    categoryId: '2',
    stock: 8,
    image: 'https://images.unsplash.com/photo-1527864550417-7fd91fc51a46',
    sku: 'LS-003',
    status: 'active',
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  },
];

const ProductsList = () => {
  const navigate = useNavigate();
  const [searchQuery, setSearchQuery] = useState('');
  const [products] = useState<Product[]>(mockProducts);

  const filteredProducts = products.filter(product =>
    product.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    product.sku.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">Products</h1>
          <p className="text-muted-foreground mt-1">
            Manage your product inventory
          </p>
        </div>
        <Button onClick={() => navigate(ROUTES.ADD_PRODUCT)}>
          <Plus className="mr-2 h-4 w-4" />
          Add Product
        </Button>
      </div>

      <div className="flex items-center gap-4">
        <div className="relative flex-1 max-w-md">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input
            type="search"
            placeholder="Search products..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-10"
          />
        </div>
      </div>

      <ProductTable products={filteredProducts} />
    </div>
  );
};

export default ProductsList;
