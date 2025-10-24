import { useState } from 'react';
import { Search, AlertCircle } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Alert, AlertDescription } from '@/components/ui/alert';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { cn } from '@/lib/utils';

interface InventoryItem {
  id: string;
  productName: string;
  sku: string;
  stock: number;
  reserved: number;
  available: number;
  lowStockThreshold: number;
}

const mockInventory: InventoryItem[] = [
  {
    id: '1',
    productName: 'Wireless Headphones',
    sku: 'WH-001',
    stock: 45,
    reserved: 5,
    available: 40,
    lowStockThreshold: 10,
  },
  {
    id: '2',
    productName: 'Smart Watch',
    sku: 'SW-002',
    stock: 8,
    reserved: 2,
    available: 6,
    lowStockThreshold: 10,
  },
  {
    id: '3',
    productName: 'Laptop Stand',
    sku: 'LS-003',
    stock: 15,
    reserved: 3,
    available: 12,
    lowStockThreshold: 5,
  },
];

const InventoryList = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const [inventory] = useState<InventoryItem[]>(mockInventory);

  const filteredInventory = inventory.filter(item =>
    item.productName.toLowerCase().includes(searchQuery.toLowerCase()) ||
    item.sku.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const lowStockItems = inventory.filter(item => item.available <= item.lowStockThreshold);

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold">Inventory</h1>
        <p className="text-muted-foreground mt-1">
          Track stock levels and manage inventory
        </p>
      </div>

      {lowStockItems.length > 0 && (
        <Alert>
          <AlertCircle className="h-4 w-4" />
          <AlertDescription>
            {lowStockItems.length} product{lowStockItems.length > 1 ? 's are' : ' is'} running low on stock
          </AlertDescription>
        </Alert>
      )}

      <div className="flex items-center gap-4">
        <div className="relative flex-1 max-w-md">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input
            type="search"
            placeholder="Search inventory..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-10"
          />
        </div>
      </div>

      <div className="rounded-lg border border-border bg-card">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Product</TableHead>
              <TableHead>SKU</TableHead>
              <TableHead>Stock</TableHead>
              <TableHead>Reserved</TableHead>
              <TableHead>Available</TableHead>
              <TableHead>Status</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {filteredInventory.map((item) => (
              <TableRow key={item.id} className="hover:bg-card-hover">
                <TableCell className="font-medium">{item.productName}</TableCell>
                <TableCell>{item.sku}</TableCell>
                <TableCell>{item.stock}</TableCell>
                <TableCell>{item.reserved}</TableCell>
                <TableCell>
                  <span
                    className={cn(
                      'font-medium',
                      item.available <= item.lowStockThreshold
                        ? 'text-destructive'
                        : 'text-foreground'
                    )}
                  >
                    {item.available}
                  </span>
                </TableCell>
                <TableCell>
                  {item.available <= item.lowStockThreshold ? (
                    <Badge variant="destructive">Low Stock</Badge>
                  ) : (
                    <Badge variant="default">In Stock</Badge>
                  )}
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>
    </div>
  );
};

export default InventoryList;
