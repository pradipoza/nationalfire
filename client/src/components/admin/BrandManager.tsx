import React, { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Pencil, Trash2, Plus, Building2, Package } from "lucide-react";

import { Brand, Product, insertBrandSchema, InsertBrand } from "@shared/schema";
import { apiRequest } from "@/lib/queryClient";
import { useToast } from "@/hooks/use-toast";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Checkbox } from "@/components/ui/checkbox";

const formSchema = insertBrandSchema.extend({
  productIds: z.array(z.number()).optional(),
});

type FormValues = z.infer<typeof formSchema>;

export default function BrandManager() {
  const [editingBrand, setEditingBrand] = useState<Brand | null>(null);
  const [brandToDelete, setBrandToDelete] = useState<Brand | null>(null);
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  const [selectedProducts, setSelectedProducts] = useState<number[]>([]);

  const queryClient = useQueryClient();
  const { toast } = useToast();

  const { data: brandsData, isLoading: brandsLoading } = useQuery<{ brands: Brand[] }>({
    queryKey: ["/api/brands"],
  });

  const { data: productsData } = useQuery<{ products: Product[] }>({
    queryKey: ["/api/products"],
  });

  const brands = brandsData?.brands || [];
  const products = productsData?.products || [];

  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: "",
      logo: "",
      description: "",
      productIds: [],
    },
  });

  const addBrandMutation = useMutation({
    mutationFn: async (data: InsertBrand) => {
      console.log("Adding brand:", data);
      const response = await fetch("/api/brands", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(data),
      });
      if (!response.ok) {
        const errorData = await response.text();
        console.error("API Error:", response.status, errorData);
        throw new Error(`HTTP ${response.status}: ${errorData}`);
      }
      return response.json();
    },
    onSuccess: (data) => {
      console.log("Brand added successfully:", data);
      queryClient.invalidateQueries({ queryKey: ["/api/brands"] });
      queryClient.invalidateQueries({ queryKey: ["/api/products"] });
      toast({ title: "Brand added successfully" });
      setIsAddDialogOpen(false);
      form.reset();
      setSelectedProducts([]);
    },
    onError: (error) => {
      console.error("Brand add error:", error);
      toast({ title: `Failed to add brand: ${error.message}`, variant: "destructive" });
    },
  });

  const editBrandMutation = useMutation({
    mutationFn: async ({ id, data }: { id: number; data: InsertBrand }) => {
      console.log("Updating brand:", id, data);
      const response = await fetch(`/api/brands/${id}`, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(data),
      });
      if (!response.ok) {
        const errorData = await response.text();
        console.error("API Error:", response.status, errorData);
        throw new Error(`HTTP ${response.status}: ${errorData}`);
      }
      return response.json();
    },
    onSuccess: (data) => {
      console.log("Brand updated successfully:", data);
      queryClient.invalidateQueries({ queryKey: ["/api/brands"] });
      queryClient.invalidateQueries({ queryKey: ["/api/products"] });
      toast({ title: "Brand updated successfully" });
      setIsEditDialogOpen(false);
      setEditingBrand(null);
      form.reset();
      setSelectedProducts([]);
    },
    onError: (error) => {
      console.error("Brand update error:", error);
      toast({ title: `Failed to update brand: ${error.message}`, variant: "destructive" });
    },
  });

  const deleteBrandMutation = useMutation({
    mutationFn: async (id: number) => {
      console.log("Deleting brand:", id);
      const response = await fetch(`/api/brands/${id}`, {
        method: "DELETE",
        headers: {
          "Content-Type": "application/json",
        },
      });
      if (!response.ok) {
        const errorData = await response.text();
        console.error("API Error:", response.status, errorData);
        throw new Error(`HTTP ${response.status}: ${errorData}`);
      }
      return response.json();
    },
    onSuccess: (data) => {
      console.log("Brand deleted successfully:", data);
      queryClient.invalidateQueries({ queryKey: ["/api/brands"] });
      queryClient.invalidateQueries({ queryKey: ["/api/products"] });
      toast({ title: "Brand deleted successfully" });
      setBrandToDelete(null);
    },
    onError: (error) => {
      console.error("Brand delete error:", error);
      toast({ title: `Failed to delete brand: ${error.message}`, variant: "destructive" });
    },
  });

  const updateProductsBrandMutation = useMutation({
    mutationFn: async ({ brandId, productIds }: { brandId: number; productIds: number[] }) => {
      // First, remove brand from all current products of this brand
      const currentBrandProducts = products.filter(p => p.brandId === brandId);
      
      for (const product of currentBrandProducts) {
        const response = await fetch(`/api/products/${product.id}`, {
          method: "PATCH",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ brandId: null }),
        });
        if (!response.ok) {
          throw new Error(`Failed to remove brand from product ${product.id}`);
        }
      }

      // Then, add brand to selected products
      for (const productId of productIds) {
        const response = await fetch(`/api/products/${productId}`, {
          method: "PATCH",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ brandId }),
        });
        if (!response.ok) {
          throw new Error(`Failed to assign brand to product ${productId}`);
        }
      }

      return true;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/products"] });
      toast({ title: "Product associations updated successfully" });
    },
    onError: (error) => {
      console.error("Product association error:", error);
      toast({ title: `Failed to update product associations: ${error.message}`, variant: "destructive" });
    },
  });

  const openEditDialog = (brand: Brand) => {
    setEditingBrand(brand);
    const brandProducts = products.filter(p => p.brandId === brand.id).map(p => p.id);
    setSelectedProducts(brandProducts);
    form.reset({
      name: brand.name,
      logo: brand.logo,
      description: brand.description || "",
      productIds: brandProducts,
    });
    setIsEditDialogOpen(true);
  };

  const openDeleteDialog = (brand: Brand) => {
    setBrandToDelete(brand);
  };

  const onAddSubmit = async (values: FormValues) => {
    try {
      const brandData: InsertBrand = {
        name: values.name,
        logo: values.logo,
        description: values.description,
      };

      addBrandMutation.mutate(brandData, {
        onSuccess: async (result) => {
          if (result.brand && selectedProducts.length > 0) {
            await updateProductsBrandMutation.mutateAsync({
              brandId: result.brand.id,
              productIds: selectedProducts,
            });
          }
        }
      });
    } catch (error) {
      console.error("Add submit error:", error);
      toast({ title: "Failed to add brand", variant: "destructive" });
    }
  };

  const onEditSubmit = async (values: FormValues) => {
    if (!editingBrand) return;

    try {
      const brandData: InsertBrand = {
        name: values.name,
        logo: values.logo,
        description: values.description,
      };

      editBrandMutation.mutate({ id: editingBrand.id, data: brandData }, {
        onSuccess: async () => {
          await updateProductsBrandMutation.mutateAsync({
            brandId: editingBrand.id,
            productIds: selectedProducts,
          });
        }
      });
    } catch (error) {
      console.error("Edit submit error:", error);
      toast({ title: "Failed to update brand", variant: "destructive" });
    }
  };

  const handleProductToggle = (productId: number) => {
    setSelectedProducts(prev =>
      prev.includes(productId)
        ? prev.filter(id => id !== productId)
        : [...prev, productId]
    );
  };

  const getBrandProductCount = (brandId: number) => {
    return products.filter(p => p.brandId === brandId).length;
  };

  if (brandsLoading) {
    return <div>Loading brands...</div>;
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold">Brands Management</h2>
          <p className="text-muted-foreground">
            Manage your brand catalog and associate products
          </p>
        </div>
        <Dialog open={isAddDialogOpen} onOpenChange={setIsAddDialogOpen}>
          <DialogTrigger asChild>
            <Button>
              <Plus className="mr-2 h-4 w-4" />
              Add Brand
            </Button>
          </DialogTrigger>
          <DialogContent className="max-w-2xl max-h-[80vh] overflow-y-auto">
            <DialogHeader>
              <DialogTitle>Add New Brand</DialogTitle>
            </DialogHeader>
            <form onSubmit={form.handleSubmit(onAddSubmit)} className="space-y-4">
              <div>
                <Label htmlFor="name">Brand Name</Label>
                <Input
                  id="name"
                  {...form.register("name")}
                  placeholder="Enter brand name"
                />
                {form.formState.errors.name && (
                  <p className="text-sm text-red-500">{form.formState.errors.name.message}</p>
                )}
              </div>

              <div>
                <Label htmlFor="logo">Logo URL</Label>
                <Input
                  id="logo"
                  {...form.register("logo")}
                  placeholder="Enter logo URL"
                />
                {form.formState.errors.logo && (
                  <p className="text-sm text-red-500">{form.formState.errors.logo.message}</p>
                )}
              </div>

              <div>
                <Label htmlFor="description">Description</Label>
                <Textarea
                  id="description"
                  {...form.register("description")}
                  placeholder="Enter brand description"
                  rows={3}
                />
              </div>

              <div>
                <Label>Associated Products</Label>
                <div className="border rounded-md p-4 max-h-48 overflow-y-auto">
                  {products.length === 0 ? (
                    <p className="text-muted-foreground text-sm">No products available</p>
                  ) : (
                    <div className="space-y-2">
                      {products.map((product) => (
                        <div key={product.id} className="flex items-center space-x-2">
                          <Checkbox
                            id={`product-${product.id}`}
                            checked={selectedProducts.includes(product.id)}
                            onCheckedChange={() => handleProductToggle(product.id)}
                          />
                          <Label
                            htmlFor={`product-${product.id}`}
                            className="text-sm cursor-pointer"
                          >
                            {product.name}
                          </Label>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              </div>

              <div className="flex justify-end space-x-2">
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => setIsAddDialogOpen(false)}
                >
                  Cancel
                </Button>
                <Button type="submit" disabled={addBrandMutation.isPending}>
                  {addBrandMutation.isPending ? "Adding..." : "Add Brand"}
                </Button>
              </div>
            </form>
          </DialogContent>
        </Dialog>
      </div>

      <div className="border rounded-lg">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Logo</TableHead>
              <TableHead>Name</TableHead>
              <TableHead>Description</TableHead>
              <TableHead>Products</TableHead>
              <TableHead>Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {brands.map((brand) => (
              <TableRow key={brand.id}>
                <TableCell>
                  <img
                    src={brand.logo}
                    alt={brand.name}
                    className="w-12 h-12 object-contain rounded"
                  />
                </TableCell>
                <TableCell className="font-medium">{brand.name}</TableCell>
                <TableCell className="max-w-xs truncate">
                  {brand.description}
                </TableCell>
                <TableCell>
                  <Badge variant="secondary">
                    <Package className="mr-1 h-3 w-3" />
                    {getBrandProductCount(brand.id)} products
                  </Badge>
                </TableCell>
                <TableCell>
                  <div className="flex items-center space-x-2">
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => openEditDialog(brand)}
                    >
                      <Pencil className="h-4 w-4" />
                    </Button>
                    <AlertDialog>
                      <AlertDialogTrigger asChild>
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => openDeleteDialog(brand)}
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </AlertDialogTrigger>
                      <AlertDialogContent>
                        <AlertDialogHeader>
                          <AlertDialogTitle>Delete Brand</AlertDialogTitle>
                          <AlertDialogDescription>
                            Are you sure you want to delete "{brand.name}"? This action cannot be undone.
                            Products associated with this brand will be unlinked.
                          </AlertDialogDescription>
                        </AlertDialogHeader>
                        <AlertDialogFooter>
                          <AlertDialogCancel>Cancel</AlertDialogCancel>
                          <AlertDialogAction
                            onClick={() => deleteBrandMutation.mutate(brand.id)}
                            className="bg-destructive text-destructive-foreground"
                          >
                            Delete
                          </AlertDialogAction>
                        </AlertDialogFooter>
                      </AlertDialogContent>
                    </AlertDialog>
                  </div>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>

      {/* Edit Dialog */}
      <Dialog open={isEditDialogOpen} onOpenChange={setIsEditDialogOpen}>
        <DialogContent className="max-w-2xl max-h-[80vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>Edit Brand</DialogTitle>
          </DialogHeader>
          <form onSubmit={form.handleSubmit(onEditSubmit)} className="space-y-4">
            <div>
              <Label htmlFor="edit-name">Brand Name</Label>
              <Input
                id="edit-name"
                {...form.register("name")}
                placeholder="Enter brand name"
              />
              {form.formState.errors.name && (
                <p className="text-sm text-red-500">{form.formState.errors.name.message}</p>
              )}
            </div>

            <div>
              <Label htmlFor="edit-logo">Logo URL</Label>
              <Input
                id="edit-logo"
                {...form.register("logo")}
                placeholder="Enter logo URL"
              />
              {form.formState.errors.logo && (
                <p className="text-sm text-red-500">{form.formState.errors.logo.message}</p>
              )}
            </div>

            <div>
              <Label htmlFor="edit-description">Description</Label>
              <Textarea
                id="edit-description"
                {...form.register("description")}
                placeholder="Enter brand description"
                rows={3}
              />
            </div>

            <div>
              <Label>Associated Products</Label>
              <div className="border rounded-md p-4 max-h-48 overflow-y-auto">
                {products.length === 0 ? (
                  <p className="text-muted-foreground text-sm">No products available</p>
                ) : (
                  <div className="space-y-2">
                    {products.map((product) => (
                      <div key={product.id} className="flex items-center space-x-2">
                        <Checkbox
                          id={`edit-product-${product.id}`}
                          checked={selectedProducts.includes(product.id)}
                          onCheckedChange={() => handleProductToggle(product.id)}
                        />
                        <Label
                          htmlFor={`edit-product-${product.id}`}
                          className="text-sm cursor-pointer"
                        >
                          {product.name}
                        </Label>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>

            <div className="flex justify-end space-x-2">
              <Button
                type="button"
                variant="outline"
                onClick={() => setIsEditDialogOpen(false)}
              >
                Cancel
              </Button>
              <Button type="submit" disabled={editBrandMutation.isPending}>
                {editBrandMutation.isPending ? "Updating..." : "Update Brand"}
              </Button>
            </div>
          </form>
        </DialogContent>
      </Dialog>
    </div>
  );
}