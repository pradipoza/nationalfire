import { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';
import { z } from 'zod';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Switch } from '@/components/ui/switch';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle } from '@/components/ui/alert-dialog';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { Plus, Edit2, Trash2, ExternalLink } from 'lucide-react';
import { apiRequest } from '@/lib/queryClient';
import { useToast } from '@/hooks/use-toast';
import type { Customer, InsertCustomer } from '@shared/schema';

const formSchema = z.object({
  name: z.string().min(1, 'Name is required'),
  logo: z.string().min(1, 'Logo is required'),
  website: z.string().url('Please enter a valid URL'),
  displayOrder: z.number().int().min(0, 'Display order must be a positive number'),
  isActive: z.boolean(),
});

type FormValues = z.infer<typeof formSchema>;

export default function CustomerManager() {
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [selectedCustomer, setSelectedCustomer] = useState<Customer | null>(null);
  const { toast } = useToast();
  const queryClient = useQueryClient();

  const { data: customerData, isLoading } = useQuery<{ customers: Customer[] }>({
    queryKey: ['/api/customers'],
  });

  const customers = customerData?.customers || [];

  const addMutation = useMutation({
    mutationFn: async (data: InsertCustomer) => {
      return apiRequest('POST', '/api/customers', data);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['/api/customers'] });
      setIsAddDialogOpen(false);
      toast({
        title: 'Success',
        description: 'Customer added successfully',
      });
    },
    onError: () => {
      toast({
        title: 'Error',
        description: 'Failed to add customer',
        variant: 'destructive',
      });
    },
  });

  const updateMutation = useMutation({
    mutationFn: async ({ id, data }: { id: number; data: InsertCustomer }) => {
      return apiRequest('PUT', `/api/customers/${id}`, data);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['/api/customers'] });
      setIsEditDialogOpen(false);
      setSelectedCustomer(null);
      toast({
        title: 'Success',
        description: 'Customer updated successfully',
      });
    },
    onError: () => {
      toast({
        title: 'Error',
        description: 'Failed to update customer',
        variant: 'destructive',
      });
    },
  });

  const deleteMutation = useMutation({
    mutationFn: async (id: number) => {
      return apiRequest('DELETE', `/api/customers/${id}`);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['/api/customers'] });
      setIsDeleteDialogOpen(false);
      setSelectedCustomer(null);
      toast({
        title: 'Success',
        description: 'Customer deleted successfully',
      });
    },
    onError: () => {
      toast({
        title: 'Error',
        description: 'Failed to delete customer',
        variant: 'destructive',
      });
    },
  });

  const addForm = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: '',
      logo: '',
      website: '',
      displayOrder: 0,
      isActive: true,
    },
  });

  const editForm = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: '',
      logo: '',
      website: '',
      displayOrder: 0,
      isActive: true,
    },
  });

  const openEditDialog = (customer: Customer) => {
    setSelectedCustomer(customer);
    editForm.reset({
      name: customer.name,
      logo: customer.logo,
      website: customer.website,
      displayOrder: customer.displayOrder || 0,
      isActive: customer.isActive ?? true,
    });
    setIsEditDialogOpen(true);
  };

  const openDeleteDialog = (customer: Customer) => {
    setSelectedCustomer(customer);
    setIsDeleteDialogOpen(true);
  };

  const handleImageUpload = (
    event: React.ChangeEvent<HTMLInputElement>,
    form: typeof addForm | typeof editForm
  ) => {
    const file = event.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (e) => {
        const result = e.target?.result as string;
        form.setValue('logo', result);
      };
      reader.readAsDataURL(file);
    }
  };

  const onAddSubmit = (values: FormValues) => {
    const customerData: InsertCustomer = {
      name: values.name,
      logo: values.logo,
      website: values.website,
      displayOrder: values.displayOrder,
      isActive: values.isActive,
    };
    addMutation.mutate(customerData);
  };

  const onEditSubmit = (values: FormValues) => {
    if (!selectedCustomer) return;

    const customerData: InsertCustomer = {
      name: values.name,
      logo: values.logo,
      website: values.website,
      displayOrder: values.displayOrder,
      isActive: values.isActive,
    };
    updateMutation.mutate({ id: selectedCustomer.id, data: customerData });
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center p-8">
        <div className="text-lg">Loading customers...</div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-3xl font-bold tracking-tight">Customer Management</h2>
          <p className="text-muted-foreground">Manage customer logos and websites</p>
        </div>
        <Dialog open={isAddDialogOpen} onOpenChange={setIsAddDialogOpen}>
          <DialogTrigger asChild>
            <Button>
              <Plus className="w-4 h-4 mr-2" />
              Add Customer
            </Button>
          </DialogTrigger>
          <DialogContent className="max-w-2xl">
            <DialogHeader>
              <DialogTitle>Add New Customer</DialogTitle>
            </DialogHeader>
            <form onSubmit={addForm.handleSubmit(onAddSubmit)} className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="add-name">Customer Name</Label>
                  <Input
                    id="add-name"
                    {...addForm.register('name')}
                    placeholder="Enter customer name"
                  />
                  {addForm.formState.errors.name && (
                    <p className="text-sm text-red-500">{addForm.formState.errors.name.message}</p>
                  )}
                </div>
                <div>
                  <Label htmlFor="add-website">Website URL</Label>
                  <Input
                    id="add-website"
                    {...addForm.register('website')}
                    placeholder="https://example.com"
                  />
                  {addForm.formState.errors.website && (
                    <p className="text-sm text-red-500">{addForm.formState.errors.website.message}</p>
                  )}
                </div>
              </div>

              <div>
                <Label htmlFor="add-logo">Logo</Label>
                <Input
                  id="add-logo"
                  type="file"
                  accept="image/*"
                  onChange={(e) => handleImageUpload(e, addForm)}
                />
                {addForm.watch('logo') && (
                  <div className="mt-2">
                    <img
                      src={addForm.watch('logo')}
                      alt="Logo preview"
                      className="w-32 h-32 object-contain border rounded"
                    />
                  </div>
                )}
                {addForm.formState.errors.logo && (
                  <p className="text-sm text-red-500">{addForm.formState.errors.logo.message}</p>
                )}
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="add-display-order">Display Order</Label>
                  <Input
                    id="add-display-order"
                    type="number"
                    {...addForm.register('displayOrder', { valueAsNumber: true })}
                    placeholder="0"
                  />
                  {addForm.formState.errors.displayOrder && (
                    <p className="text-sm text-red-500">{addForm.formState.errors.displayOrder.message}</p>
                  )}
                </div>
                <div className="flex items-center space-x-2">
                  <Switch
                    id="add-active"
                    checked={addForm.watch('isActive')}
                    onCheckedChange={(checked) => addForm.setValue('isActive', checked)}
                  />
                  <Label htmlFor="add-active">Active</Label>
                </div>
              </div>

              <div className="flex justify-end space-x-2 pt-4">
                <Button type="button" variant="outline" onClick={() => setIsAddDialogOpen(false)}>
                  Cancel
                </Button>
                <Button type="submit" disabled={addMutation.isPending}>
                  {addMutation.isPending ? 'Adding...' : 'Add Customer'}
                </Button>
              </div>
            </form>
          </DialogContent>
        </Dialog>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Customers ({customers.length})</CardTitle>
          <CardDescription>
            Manage customer logos that appear on the website
          </CardDescription>
        </CardHeader>
        <CardContent>
          {customers.length === 0 ? (
            <div className="text-center py-8">
              <p className="text-gray-500">No customers added yet.</p>
            </div>
          ) : (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Logo</TableHead>
                  <TableHead>Name</TableHead>
                  <TableHead>Website</TableHead>
                  <TableHead>Display Order</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {customers.map((customer: Customer) => (
                  <TableRow key={customer.id}>
                    <TableCell>
                      <img
                        src={customer.logo}
                        alt={customer.name}
                        className="w-12 h-12 object-contain border rounded"
                      />
                    </TableCell>
                    <TableCell className="font-medium">{customer.name}</TableCell>
                    <TableCell>
                      <a
                        href={customer.website}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-blue-600 hover:underline flex items-center"
                      >
                        Visit <ExternalLink className="w-3 h-3 ml-1" />
                      </a>
                    </TableCell>
                    <TableCell>{customer.displayOrder}</TableCell>
                    <TableCell>
                      <Badge variant={customer.isActive ? 'default' : 'secondary'}>
                        {customer.isActive ? 'Active' : 'Inactive'}
                      </Badge>
                    </TableCell>
                    <TableCell>
                      <div className="flex space-x-2">
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => openEditDialog(customer)}
                        >
                          <Edit2 className="w-4 h-4" />
                        </Button>
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => openDeleteDialog(customer)}
                        >
                          <Trash2 className="w-4 h-4" />
                        </Button>
                      </div>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          )}
        </CardContent>
      </Card>

      {/* Edit Dialog */}
      <Dialog open={isEditDialogOpen} onOpenChange={setIsEditDialogOpen}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle>Edit Customer</DialogTitle>
          </DialogHeader>
          <form onSubmit={editForm.handleSubmit(onEditSubmit)} className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label htmlFor="edit-name">Customer Name</Label>
                <Input
                  id="edit-name"
                  {...editForm.register('name')}
                  placeholder="Enter customer name"
                />
                {editForm.formState.errors.name && (
                  <p className="text-sm text-red-500">{editForm.formState.errors.name.message}</p>
                )}
              </div>
              <div>
                <Label htmlFor="edit-website">Website URL</Label>
                <Input
                  id="edit-website"
                  {...editForm.register('website')}
                  placeholder="https://example.com"
                />
                {editForm.formState.errors.website && (
                  <p className="text-sm text-red-500">{editForm.formState.errors.website.message}</p>
                )}
              </div>
            </div>

            <div>
              <Label htmlFor="edit-logo">Logo</Label>
              <Input
                id="edit-logo"
                type="file"
                accept="image/*"
                onChange={(e) => handleImageUpload(e, editForm)}
              />
              {editForm.watch('logo') && (
                <div className="mt-2">
                  <img
                    src={editForm.watch('logo')}
                    alt="Logo preview"
                    className="w-32 h-32 object-contain border rounded"
                  />
                </div>
              )}
              {editForm.formState.errors.logo && (
                <p className="text-sm text-red-500">{editForm.formState.errors.logo.message}</p>
              )}
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label htmlFor="edit-display-order">Display Order</Label>
                <Input
                  id="edit-display-order"
                  type="number"
                  {...editForm.register('displayOrder', { valueAsNumber: true })}
                  placeholder="0"
                />
                {editForm.formState.errors.displayOrder && (
                  <p className="text-sm text-red-500">{editForm.formState.errors.displayOrder.message}</p>
                )}
              </div>
              <div className="flex items-center space-x-2">
                <Switch
                  id="edit-active"
                  checked={editForm.watch('isActive')}
                  onCheckedChange={(checked) => editForm.setValue('isActive', checked)}
                />
                <Label htmlFor="edit-active">Active</Label>
              </div>
            </div>

            <div className="flex justify-end space-x-2 pt-4">
              <Button type="button" variant="outline" onClick={() => setIsEditDialogOpen(false)}>
                Cancel
              </Button>
              <Button type="submit" disabled={updateMutation.isPending}>
                {updateMutation.isPending ? 'Updating...' : 'Update Customer'}
              </Button>
            </div>
          </form>
        </DialogContent>
      </Dialog>

      {/* Delete Dialog */}
      <AlertDialog open={isDeleteDialogOpen} onOpenChange={setIsDeleteDialogOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Delete Customer</AlertDialogTitle>
            <AlertDialogDescription>
              Are you sure you want to delete "{selectedCustomer?.name}"? This action cannot be undone.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction
              onClick={() => selectedCustomer && deleteMutation.mutate(selectedCustomer.id)}
              disabled={deleteMutation.isPending}
            >
              {deleteMutation.isPending ? 'Deleting...' : 'Delete'}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}