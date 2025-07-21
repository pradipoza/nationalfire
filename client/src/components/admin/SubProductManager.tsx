import React, { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { API_ENDPOINTS } from "@/lib/config";
import { apiRequest } from "@/lib/queryClient";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Skeleton } from "@/components/ui/skeleton";
import { 
  Plus, 
  Edit2, 
  Trash2, 
  Package,
  AlertCircle,
  FileText
} from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { AdvancedRichTextEditor } from "@/components/AdvancedRichTextEditor";
import type { SubProduct, InsertSubProduct } from "@shared/schema";

const SubProductManager: React.FC = () => {
  const [isCreateDialogOpen, setIsCreateDialogOpen] = useState(false);
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  const [editingSubProduct, setEditingSubProduct] = useState<SubProduct | null>(null);
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const [content, setContent] = useState<string>("");
  const { toast } = useToast();
  const queryClient = useQueryClient();

  // Fetch sub-products
  const { data: subProducts, isLoading, error } = useQuery<{ subProducts: SubProduct[] }>({
    queryKey: [API_ENDPOINTS.SUB_PRODUCTS],
  });

  // Create sub-product mutation
  const createMutation = useMutation({
    mutationFn: async (data: InsertSubProduct) => {
      return apiRequest("POST", API_ENDPOINTS.SUB_PRODUCTS, data);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [API_ENDPOINTS.SUB_PRODUCTS] });
      setIsCreateDialogOpen(false);
      setImagePreview(null);
      toast({
        title: "Success",
        description: "Sub-product created successfully",
      });
    },
    onError: (error: any) => {
      const errorMessage = error?.error === 'duplicate_name' 
        ? "A sub-product with this name already exists. Please choose a different name."
        : "Failed to create sub-product. Please try again.";
      
      toast({
        title: "Error",
        description: errorMessage,
        variant: "destructive",
      });
    },
  });

  // Update sub-product mutation
  const updateMutation = useMutation({
    mutationFn: async ({ id, data }: { id: number; data: Partial<InsertSubProduct> }) => {
      return apiRequest("PATCH", API_ENDPOINTS.SUB_PRODUCT(id), data);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [API_ENDPOINTS.SUB_PRODUCTS] });
      setIsEditDialogOpen(false);
      setEditingSubProduct(null);
      setImagePreview(null);
      toast({
        title: "Success",
        description: "Sub-product updated successfully",
      });
    },
    onError: () => {
      toast({
        title: "Error",
        description: "Failed to update sub-product",
        variant: "destructive",
      });
    },
  });

  // Delete sub-product mutation
  const deleteMutation = useMutation({
    mutationFn: async (id: number) => {
      return apiRequest("DELETE", API_ENDPOINTS.SUB_PRODUCT(id));
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [API_ENDPOINTS.SUB_PRODUCTS] });
      toast({
        title: "Success",
        description: "Sub-product deleted successfully",
      });
    },
    onError: () => {
      toast({
        title: "Error",
        description: "Failed to delete sub-product",
        variant: "destructive",
      });
    },
  });

  const handleImageUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (e) => {
        const result = e.target?.result as string;
        setImagePreview(result);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleCreateSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const formData = new FormData(event.currentTarget);
    
    const subProductData: InsertSubProduct = {
      name: formData.get("name") as string,
      modelNumber: formData.get("modelNumber") as string || null,
      photo: imagePreview || "https://via.placeholder.com/400x300",
      content: content,
    };

    createMutation.mutate(subProductData);
  };

  const handleEditSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (!editingSubProduct) return;
    
    const formData = new FormData(event.currentTarget);
    
    const subProductData: Partial<InsertSubProduct> = {
      name: formData.get("name") as string,
      modelNumber: formData.get("modelNumber") as string || null,
      photo: imagePreview || editingSubProduct.photo,
      content: content,
    };

    updateMutation.mutate({ id: editingSubProduct.id, data: subProductData });
  };

  const handleEdit = (subProduct: SubProduct) => {
    setEditingSubProduct(subProduct);
    setImagePreview(subProduct.photo);
    setContent(subProduct.content || "");
    setIsEditDialogOpen(true);
  };

  const handleOpenCreateDialog = () => {
    setContent("");
    setImagePreview(null);
    setIsCreateDialogOpen(true);
  };

  const handleDelete = (id: number) => {
    if (confirm("Are you sure you want to delete this sub-product?")) {
      deleteMutation.mutate(id);
    }
  };

  if (isLoading) {
    return (
      <div className="space-y-4">
        <Skeleton className="h-8 w-64" />
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {[...Array(6)].map((_, i) => (
            <Skeleton key={i} className="h-64 w-full" />
          ))}
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="text-center py-8">
        <AlertCircle className="h-12 w-12 text-red-500 mx-auto mb-4" />
        <h3 className="text-lg font-semibold mb-2">Error loading sub-products</h3>
        <p className="text-gray-600">Please try refreshing the page</p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-2xl font-bold">Sub-Products Management</h2>
          <p className="text-gray-600">Manage individual product models and variants</p>
        </div>
        <Dialog open={isCreateDialogOpen} onOpenChange={setIsCreateDialogOpen}>
          <DialogTrigger asChild>
            <Button onClick={handleOpenCreateDialog}>
              <Plus className="w-4 h-4 mr-2" />
              Add Sub-Product
            </Button>
          </DialogTrigger>
          <DialogContent className="max-w-7xl max-h-[95vh] overflow-y-auto" aria-describedby="create-sub-product-description">
            <DialogHeader>
              <DialogTitle>Create New Sub-Product</DialogTitle>
            </DialogHeader>
            <div id="create-sub-product-description" className="sr-only">
              Create a new sub-product with name, model number, photo, and custom content design
            </div>
            <form onSubmit={handleCreateSubmit} className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="name">Product Name</Label>
                  <Input id="name" name="name" required placeholder="Enter product name" />
                </div>
                <div>
                  <Label htmlFor="modelNumber">Model Number (Optional)</Label>
                  <Input id="modelNumber" name="modelNumber" placeholder="e.g., FT-2000X" />
                </div>
              </div>
              
              <div>
                <Label htmlFor="photo">Product Photo</Label>
                <input
                  type="file"
                  id="photo"
                  accept="image/*"
                  onChange={handleImageUpload}
                  className="w-full file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-fire-red file:text-white hover:file:bg-fire-red/90"
                />
                {imagePreview && (
                  <div className="mt-3">
                    <img
                      src={imagePreview}
                      alt="Preview"
                      className="w-48 h-32 object-cover rounded border"
                    />
                  </div>
                )}
              </div>
              
              <div>
                <Label htmlFor="content">Custom Page Designer</Label>
                <p className="text-sm text-gray-600 mb-2">
                  Design your complete sub-product page with drag-and-drop editor, advanced layouts, and professional templates.
                </p>
                <AdvancedRichTextEditor
                  content={content}
                  onChange={setContent}
                  placeholder="Design your custom sub-product page with advanced drag-and-drop tools..."
                />
              </div>
              
              <div className="flex justify-end space-x-2 pt-6 border-t">
                <Button type="button" variant="outline" onClick={() => setIsCreateDialogOpen(false)}>
                  Cancel
                </Button>
                <Button type="submit" disabled={createMutation.isPending}>
                  <FileText className="w-4 h-4 mr-2" />
                  {createMutation.isPending ? "Creating..." : "Create Sub-Product"}
                </Button>
              </div>
            </form>
          </DialogContent>
        </Dialog>
      </div>

      {subProducts?.subProducts && subProducts.subProducts.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {subProducts.subProducts.map((subProduct) => (
            <Card key={subProduct.id} className="overflow-hidden hover:shadow-lg transition-shadow">
              <CardHeader className="p-0">
                <img
                  src={subProduct.photo}
                  alt={subProduct.name}
                  className="w-full h-48 object-cover"
                />
              </CardHeader>
              <CardContent className="p-4">
                <CardTitle className="text-lg mb-2">{subProduct.name}</CardTitle>
                {subProduct.modelNumber && (
                  <p className="text-sm text-gray-600 mb-3">Model: {subProduct.modelNumber}</p>
                )}
                <div className="flex gap-2">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => handleEdit(subProduct)}
                    className="flex-1"
                  >
                    <Edit2 className="w-4 h-4 mr-1" />
                    Edit
                  </Button>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => handleDelete(subProduct.id)}
                    className="text-red-600 hover:text-red-800"
                  >
                    <Trash2 className="w-4 h-4" />
                  </Button>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      ) : (
        <div className="text-center py-12 bg-gray-50 rounded-lg">
          <Package className="h-12 w-12 text-gray-400 mx-auto mb-4" />
          <h3 className="text-lg font-semibold mb-2">No Sub-Products Found</h3>
          <p className="text-gray-600 mb-4">Create your first sub-product to get started.</p>
          <Button onClick={handleOpenCreateDialog}>
            <Plus className="w-4 h-4 mr-2" />
            Add Sub-Product
          </Button>
        </div>
      )}

      {/* Edit Dialog */}
      <Dialog open={isEditDialogOpen} onOpenChange={setIsEditDialogOpen}>
        <DialogContent className="max-w-7xl max-h-[95vh] overflow-y-auto" aria-describedby="edit-sub-product-description">
          <DialogHeader>
            <DialogTitle>Edit Sub-Product</DialogTitle>
          </DialogHeader>
          <div id="edit-sub-product-description" className="sr-only">
            Edit sub-product details including name, model number, photo, and custom content design
          </div>
          {editingSubProduct && (
            <form onSubmit={handleEditSubmit} className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="edit-name">Product Name</Label>
                  <Input
                    id="edit-name"
                    name="name"
                    defaultValue={editingSubProduct.name}
                    required
                    placeholder="Enter product name"
                  />
                </div>
                <div>
                  <Label htmlFor="edit-modelNumber">Model Number (Optional)</Label>
                  <Input
                    id="edit-modelNumber"
                    name="modelNumber"
                    defaultValue={editingSubProduct.modelNumber || ""}
                    placeholder="e.g., FT-2000X"
                  />
                </div>
              </div>
              
              <div>
                <Label htmlFor="edit-photo">Product Photo</Label>
                <input
                  type="file"
                  id="edit-photo"
                  accept="image/*"
                  onChange={handleImageUpload}
                  className="w-full file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-fire-red file:text-white hover:file:bg-fire-red/90"
                />
                {imagePreview && (
                  <div className="mt-3">
                    <img
                      src={imagePreview}
                      alt="Preview"
                      className="w-48 h-32 object-cover rounded border"
                    />
                  </div>
                )}
              </div>
              
              <div>
                <Label htmlFor="edit-content">Custom Page Designer</Label>
                <p className="text-sm text-gray-600 mb-2">
                  Design your complete sub-product page with drag-and-drop editor, advanced layouts, and professional templates.
                </p>
                <AdvancedRichTextEditor
                  content={content}
                  onChange={setContent}
                  placeholder="Design your custom sub-product page with advanced drag-and-drop tools..."
                />
              </div>
              
              <div className="flex justify-end space-x-2 pt-6 border-t">
                <Button type="button" variant="outline" onClick={() => setIsEditDialogOpen(false)}>
                  Cancel
                </Button>
                <Button type="submit" disabled={updateMutation.isPending}>
                  <FileText className="w-4 h-4 mr-2" />
                  {updateMutation.isPending ? "Updating..." : "Update Sub-Product"}
                </Button>
              </div>
            </form>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default SubProductManager;