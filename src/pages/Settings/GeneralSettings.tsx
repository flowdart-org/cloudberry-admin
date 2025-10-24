import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { useToast } from '@/hooks/use-toast';

const GeneralSettings = () => {
  const { toast } = useToast();
  const [formData, setFormData] = useState({
    storeName: 'My E-commerce Store',
    storeEmail: 'store@example.com',
    storePhone: '+1 (555) 123-4567',
    currency: 'USD',
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    toast({
      title: 'Settings saved',
      description: 'Your settings have been updated successfully.',
    });
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold">Settings</h1>
        <p className="text-muted-foreground mt-1">
          Manage your store settings and preferences
        </p>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>General Information</CardTitle>
          <CardDescription>
            Update your store's basic information
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="grid gap-4 md:grid-cols-2">
              <div className="space-y-2">
                <Label htmlFor="storeName">Store Name</Label>
                <Input
                  id="storeName"
                  value={formData.storeName}
                  onChange={(e) => setFormData({ ...formData, storeName: e.target.value })}
                />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="storeEmail">Store Email</Label>
                <Input
                  id="storeEmail"
                  type="email"
                  value={formData.storeEmail}
                  onChange={(e) => setFormData({ ...formData, storeEmail: e.target.value })}
                />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="storePhone">Store Phone</Label>
                <Input
                  id="storePhone"
                  value={formData.storePhone}
                  onChange={(e) => setFormData({ ...formData, storePhone: e.target.value })}
                />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="currency">Currency</Label>
                <Input
                  id="currency"
                  value={formData.currency}
                  onChange={(e) => setFormData({ ...formData, currency: e.target.value })}
                />
              </div>
            </div>

            <Button type="submit">Save Changes</Button>
          </form>
        </CardContent>
      </Card>
    </div>
  );
};

export default GeneralSettings;
