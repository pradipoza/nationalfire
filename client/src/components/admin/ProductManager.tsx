import React, { useState, useRef } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { API_ENDPOINTS } from "@/lib/config";
import { apiRequest } from "@/lib/queryClient";
import { useToast } from "@/hooks/use-toast";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { InsertProduct, Product } from "@shared/schema";

import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import {
  Plus,
  Pencil,
  Trash2,
  Loader2,
  X,
  Eye,
  Image as ImageIcon,
} from "lucide-react";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { Skeleton } from "@/components/ui/skeleton";

const formSchema = z.object({
  name: z.string().min(2, "Name must be at least 2 characters"),
  description: z.string().min(10, "Description must be at least 10 characters"),
  photos: z.array(z.string().url("Must be a valid URL")).min(1, "At least one photo URL is required"),
});

type FormValues = z.infer<typeof formSchema>;

const ProductManager: React.FC = () => {
  const { toast } = useToast();
  const queryClient = useQueryClient();
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [currentProduct, setCurrentProduct] = useState<Product | null>(null);
  const [photoUrls, setPhotoUrls] = useState<string[]>([]);
  const [newPhotoUrl, setNewPhotoUrl] = useState("");
  const [isUploading, setIsUploading] = useState(false);

  // Load products data
  const { data, isLoading, error } = useQuery({
    queryKey: [API_ENDPOINTS.PRODUCTS],
  });

  const products = data?.products || [];

  // Form for adding/editing products
  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: "",
      description: "",
      photos: [],
    },
  });

  // Reset form and state for add dialog
  const openAddDialog = () => {
    form.reset({
      name: "",
      description: "",
      photos: [],
    });
    setPhotoUrls([]);
    setNewPhotoUrl("");
    setIsAddDialogOpen(true);
  };

  // Set form values for edit dialog
  const openEditDialog = (product: Product) => {
    form.reset({
      name: product.name,
      description: product.description,
      photos: product.photos,
    });
    setPhotoUrls(product.photos);
    setNewPhotoUrl("");
    setCurrentProduct(product);
    setIsEditDialogOpen(true);
  };

  // Open delete confirmation dialog
  const openDeleteDialog = (product: Product) => {
    setCurrentProduct(product);
    setIsDeleteDialogOpen(true);
  };

  // Add photo URL to the list
  const addPhotoUrl = () => {
    if (!newPhotoUrl) return;
    
    // Validate URL format
    if (!z.string().url().safeParse(newPhotoUrl).success) {
      toast({
        title: "Invalid URL",
        description: "Please enter a valid URL for the photo",
        variant: "destructive",
      });
      return;
    }

    const updatedPhotos = [...photoUrls, newPhotoUrl];
    setPhotoUrls(updatedPhotos);
    form.setValue("photos", updatedPhotos, { shouldValidate: true });
    setNewPhotoUrl("");
  };

  // Remove photo URL from the list
  const removePhotoUrl = (index: number) => {
    const updatedPhotos = photoUrls.filter((_, i) => i !== index);
    setPhotoUrls(updatedPhotos);
    form.setValue("photos", updatedPhotos, { shouldValidate: true });
  };

  // Create product mutation
  const createProductMutation = useMutation({
    mutationFn: async (data: InsertProduct) => {
      const res = await apiRequest("POST", API_ENDPOINTS.PRODUCTS, data);
      return res.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [API_ENDPOINTS.PRODUCTS] });
      toast({
        title: "Product Added",
        description: "The product has been added successfully",
      });
      setIsAddDialogOpen(false);
    },
    onError: (error) => {
      toast({
        title: "Error",
        description: "Failed to add product. Please try again.",
        variant: "destructive",
      });
    },
  });

  // Update product mutation
  const updateProductMutation = useMutation({
    mutationFn: async ({
      id,
      data,
    }: {
      id: number;
      data: Partial<InsertProduct>;
    }) => {
      const res = await apiRequest("PUT", API_ENDPOINTS.PRODUCT(id), data);
      return res.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [API_ENDPOINTS.PRODUCTS] });
      toast({
        title: "Product Updated",
        description: "The product has been updated successfully",
      });
      setIsEditDialogOpen(false);
    },
    onError: (error) => {
      toast({
        title: "Error",
        description: "Failed to update product. Please try again.",
        variant: "destructive",
      });
    },
  });

  // Delete product mutation
  const deleteProductMutation = useMutation({
    mutationFn: async (id: number) => {
      const res = await apiRequest("DELETE", API_ENDPOINTS.PRODUCT(id));
      return res.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [API_ENDPOINTS.PRODUCTS] });
      toast({
        title: "Product Deleted",
        description: "The product has been deleted successfully",
      });
      setIsDeleteDialogOpen(false);
    },
    onError: (error) => {
      toast({
        title: "Error",
        description: "Failed to delete product. Please try again.",
        variant: "destructive",
      });
    },
  });

  // Handle form submission for add product
  const onAddSubmit = (values: FormValues) => {
    createProductMutation.mutate(values);
  };

  // Handle form submission for edit product
  const onEditSubmit = (values: FormValues) => {
    if (!currentProduct) return;
    updateProductMutation.mutate({
      id: currentProduct.id,
      data: values,
    });
  };

  // Handle product deletion
  const onDeleteConfirm = () => {
    if (!currentProduct) return;
    deleteProductMutation.mutate(currentProduct.id);
  };

  // Check if there's an operation in progress
  const isOperationInProgress =
    createProductMutation.isPending ||
    updateProductMutation.isPending ||
    deleteProductMutation.isPending;

  return (
    <div>
      <Card>
        <CardHeader className="flex flex-row items-start justify-between">
          <div>
            <CardTitle className="text-2xl">Products Management</CardTitle>
            <CardDescription>
              Manage your product catalog, add new products or update existing ones.
            </CardDescription>
          </div>
          <Button onClick={openAddDialog} className="bg-primary hover:bg-primary/90">
            <Plus className="mr-2 h-4 w-4" /> Add Product
          </Button>
        </CardHeader>
        <CardContent>
          {isLoading ? (
            <div className="space-y-3">
              {[...Array(3)].map((_, index) => (
                <div key={index} className="flex items-center space-x-4">
                  <Skeleton className="h-12 w-12 rounded" />
                  <div className="space-y-2">
                    <Skeleton className="h-4 w-[250px]" />
                    <Skeleton className="h-4 w-[200px]" />
                  </div>
                </div>
              ))}
            </div>
          ) : error ? (
            <div className="text-center py-6 text-red-500">
              Failed to load products. Please try again.
            </div>
          ) : products.length === 0 ? (
            <div className="text-center py-12 border rounded-lg border-dashed">
              <ImageIcon className="h-12 w-12 mx-auto text-gray-400 mb-3" />
              <h3 className="text-lg font-medium text-gray-900 mb-1">No Products Yet</h3>
              <p className="text-gray-500 mb-4">You haven't added any products yet.</p>
              <Button onClick={openAddDialog} className="bg-primary hover:bg-primary/90">
                <Plus className="mr-2 h-4 w-4" /> Add Your First Product
              </Button>
            </div>
          ) : (
            <div className="border rounded-lg overflow-hidden">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Image</TableHead>
                    <TableHead>Name</TableHead>
                    <TableHead className="hidden md:table-cell">Description</TableHead>
                    <TableHead>Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {products.map((product) => (
                    <TableRow key={product.id}>
                      <TableCell>
                        <div className="w-12 h-12 overflow-hidden rounded">
                          <img
                            src={product.photos[0] || "https://via.placeholder.com/150"}
                            alt={product.name}
                            className="w-full h-full object-cover"
                          />
                        </div>
                      </TableCell>
                      <TableCell className="font-medium">{product.name}</TableCell>
                      <TableCell className="hidden md:table-cell">
                        <div className="max-w-xs overflow-hidden">
                          <p className="truncate">{product.description}</p>
                        </div>
                      </TableCell>
                      <TableCell>
                        <div className="flex space-x-2">
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => openEditDialog(product)}
                          >
                            <Pencil className="h-4 w-4" />
                            <span className="sr-only">Edit</span>
                          </Button>
                          <Button
                            variant="destructive"
                            size="sm"
                            onClick={() => openDeleteDialog(product)}
                          >
                            <Trash2 className="h-4 w-4" />
                            <span className="sr-only">Delete</span>
                          </Button>
                        </div>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Add Product Dialog */}
      <Dialog open={isAddDialogOpen} onOpenChange={setIsAddDialogOpen}>
        <DialogContent className="max-w-3xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>Add New Product</DialogTitle>
            <DialogDescription>
              Fill in the details to add a new product to your catalog.
            </DialogDescription>
          </DialogHeader>

          <Form {...form}>
            <form onSubmit={form.handleSubmit(onAddSubmit)} className="space-y-6">
              <FormField
                control={form.control}
                name="name"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Product Name</FormLabel>
                    <FormControl>
                      <Input placeholder="Enter product name" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="description"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Description</FormLabel>
                    <FormControl>
                      <Textarea
                        placeholder="Describe the product in detail"
                        className="min-h-32"
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="photos"
                render={() => (
                  <FormItem>
                    <FormLabel>Photos</FormLabel>
                    <div className="space-y-3">
                      {/* Photo URL input */}
                      <div className="flex space-x-2">
                        <Input
                          placeholder="Enter photo URL"
                          value={newPhotoUrl}
                          onChange={(e) => setNewPhotoUrl(e.target.value)}
                        />
                        <Button
                          type="button"
                          onClick={addPhotoUrl}
                          variant="secondary"
                        >
                          Add
                        </Button>
                      </div>

                      {/* Photo list */}
                      {photoUrls.length > 0 ? (
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-3">
                          {photoUrls.map((url, index) => (
                            <div
                              key={index}
                              className="border rounded-md p-3 flex items-center space-x-3"
                            >
                              <div className="w-16 h-16 flex-shrink-0 overflow-hidden rounded">
                                <img
                                  src={url}
                                  alt={`Product ${index + 1}`}
                                  className="w-full h-full object-cover"
                                  onError={(e) => {
                                    (e.target as HTMLImageElement).src =
                                      "https://via.placeholder.com/150?text=Error";
                                  }}
                                />
                              </div>
                              <div className="flex-1 min-w-0">
                                <p className="text-sm truncate">{url}</p>
                              </div>
                              <Button
                                type="button"
                                variant="ghost"
                                size="sm"
                                onClick={() => removePhotoUrl(index)}
                                className="text-red-500 hover:text-red-700 hover:bg-red-50"
                              >
                                <X className="h-4 w-4" />
                              </Button>
                            </div>
                          ))}
                        </div>
                      ) : (
                        <p className="text-sm text-gray-500">
                          No photos added yet. Add at least one photo URL.
                        </p>
                      )}
                    </div>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <DialogFooter>
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => setIsAddDialogOpen(false)}
                  disabled={isOperationInProgress}
                >
                  Cancel
                </Button>
                <Button
                  type="submit"
                  className="bg-primary hover:bg-primary/90"
                  disabled={isOperationInProgress}
                >
                  {createProductMutation.isPending ? (
                    <>
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" /> Adding...
                    </>
                  ) : (
                    "Add Product"
                  )}
                </Button>
              </DialogFooter>
            </form>
          </Form>
        </DialogContent>
      </Dialog>

      {/* Edit Product Dialog */}
      <Dialog open={isEditDialogOpen} onOpenChange={setIsEditDialogOpen}>
        <DialogContent className="max-w-3xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>Edit Product</DialogTitle>
            <DialogDescription>
              Update the details of this product.
            </DialogDescription>
          </DialogHeader>

          <Form {...form}>
            <form onSubmit={form.handleSubmit(onEditSubmit)} className="space-y-6">
              <FormField
                control={form.control}
                name="name"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Product Name</FormLabel>
                    <FormControl>
                      <Input placeholder="Enter product name" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="description"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Description</FormLabel>
                    <FormControl>
                      <Textarea
                        placeholder="Describe the product in detail"
                        className="min-h-32"
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="photos"
                render={() => (
                  <FormItem>
                    <FormLabel>Photos</FormLabel>
                    <div className="space-y-3">
                      {/* Photo URL input */}
                      <div className="flex space-x-2">
                        <Input
                          placeholder="Enter photo URL"
                          value={newPhotoUrl}
                          onChange={(e) => setNewPhotoUrl(e.target.value)}
                        />
                        <Button
                          type="button"
                          onClick={addPhotoUrl}
                          variant="secondary"
                        >
                          Add
                        </Button>
                      </div>

                      {/* Photo list */}
                      {photoUrls.length > 0 ? (
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-3">
                          {photoUrls.map((url, index) => (
                            <div
                              key={index}
                              className="border rounded-md p-3 flex items-center space-x-3"
                            >
                              <div className="w-16 h-16 flex-shrink-0 overflow-hidden rounded">
                                <img
                                  src={url}
                                  alt={`Product ${index + 1}`}
                                  className="w-full h-full object-cover"
                                  onError={(e) => {
                                    (e.target as HTMLImageElement).src =
                                      "https://via.placeholder.com/150?text=Error";
                                  }}
                                />
                              </div>
                              <div className="flex-1 min-w-0">
                                <p className="text-sm truncate">{url}</p>
                              </div>
                              <Button
                                type="button"
                                variant="ghost"
                                size="sm"
                                onClick={() => removePhotoUrl(index)}
                                className="text-red-500 hover:text-red-700 hover:bg-red-50"
                              >
                                <X className="h-4 w-4" />
                              </Button>
                            </div>
                          ))}
                        </div>
                      ) : (
                        <p className="text-sm text-gray-500">
                          No photos added yet. Add at least one photo URL.
                        </p>
                      )}
                    </div>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <DialogFooter>
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => setIsEditDialogOpen(false)}
                  disabled={isOperationInProgress}
                >
                  Cancel
                </Button>
                <Button
                  type="submit"
                  className="bg-primary hover:bg-primary/90"
                  disabled={isOperationInProgress}
                >
                  {updateProductMutation.isPending ? (
                    <>
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" /> Updating...
                    </>
                  ) : (
                    "Update Product"
                  )}
                </Button>
              </DialogFooter>
            </form>
          </Form>
        </DialogContent>
      </Dialog>

      {/* Delete Confirmation Dialog */}
      <AlertDialog
        open={isDeleteDialogOpen}
        onOpenChange={setIsDeleteDialogOpen}
      >
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Are you sure?</AlertDialogTitle>
            <AlertDialogDescription>
              This action cannot be undone. This will permanently delete the product
              "{currentProduct?.name}" from your database.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel disabled={isOperationInProgress}>
              Cancel
            </AlertDialogCancel>
            <AlertDialogAction
              onClick={onDeleteConfirm}
              disabled={isOperationInProgress}
              className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
            >
              {deleteProductMutation.isPending ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" /> Deleting...
                </>
              ) : (
                "Delete"
              )}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
};

export default ProductManager;
