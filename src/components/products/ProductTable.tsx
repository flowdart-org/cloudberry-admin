import { useNavigate } from 'react-router-dom';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Edit, Trash2 } from 'lucide-react';
import { Product } from '@/types/product.types';
import { formatCurrency } from '@/utils/currency';
import { cn } from '@/lib/utils';

interface ProductTableProps {
  products: Product[];
  onDelete?: (id: string) => void;
}

export const ProductTable = ({ products, onDelete }: ProductTableProps) => {
  const navigate = useNavigate();

  return (
    <div className="rounded-lg border border-border bg-card">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Product</TableHead>
            <TableHead>Category</TableHead>
            <TableHead>Price</TableHead>
            <TableHead>Stock</TableHead>
            <TableHead>Status</TableHead>
            <TableHead className="text-right">Actions</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {products.map((product) => (
            <TableRow key={product.id} className="hover:bg-card-hover">
              <TableCell>
                <div className="flex items-center gap-3">
                  <div className="h-10 w-10 rounded-lg bg-secondary overflow-hidden">
                    {product.images && product.images.length > 0 ? (
                      <img
                        src={product.images[0]}
                        alt={product.name}
                        className="h-full w-full object-cover"
                      />
                    ) : (
                      <div className="flex h-full w-full items-center justify-center text-xl">
                        📦
                      </div>
                    )}
                  </div>
                  <div>
                    <p className="font-medium">{product.name}</p>
                    <p className="text-sm text-muted-foreground">{product.description.substring(0, 30)}...</p>
                  </div>
                </div>
              </TableCell>
              <TableCell>Category #{product.categoryId}</TableCell>
              <TableCell>{formatCurrency(product.discountPrice)}</TableCell>
              <TableCell>
                <span
                  className={cn(
                    'font-medium',
                    product.variants.reduce((sum, v) => sum + v.stock, 0) < 10 ? 'text-destructive' : 'text-foreground'
                  )}
                >
                  {product.variants.reduce((sum, v) => sum + v.stock, 0)}
                </span>
              </TableCell>
              <TableCell>
                <Badge
                  variant={product.status === 'active' ? 'default' : 'secondary'}
                >
                  {product.status}
                </Badge>
              </TableCell>
              <TableCell className="text-right">
                <div className="flex justify-end gap-2">
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={() => navigate(`/products/${product.id}`)}
                  >
                    <Edit className="h-4 w-4" />
                  </Button>
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={() => onDelete?.(product.id)}
                  >
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </div>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
};
