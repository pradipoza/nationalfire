import React, { useState, useEffect } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { API_ENDPOINTS } from "@/lib/config";
import { apiRequest } from "@/lib/queryClient";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
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
  X
} from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import type { SubProduct, InsertSubProduct } from "@shared/schema";

interface SubProductManagerProps {
  onClose?: () => void;
}

const SubProductManager: React.FC<SubProductManagerProps> = ({ onClose }) => {
  const [editingSubProduct, setEditingSubProduct] = useState<SubProduct | null>(null);
  const [isCreateDialogOpen, setIsCreateDialogOpen] = useState(false);
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  const [imagePreview, setImagePreview] = useState<string>("");
  const [createContentType, setCreateContentType] = useState<string>("manual");
  const [editContentType, setEditContentType] = useState<string>("manual");
  
  // State for specifications and features
  const [createSpecifications, setCreateSpecifications] = useState<{key: string, value: string}[]>([]);
  const [createFeatures, setCreateFeatures] = useState<string[]>([]);
  const [editSpecifications, setEditSpecifications] = useState<{key: string, value: string}[]>([]);
  const [editFeatures, setEditFeatures] = useState<string[]>([]);
  
  const { toast } = useToast();
  const queryClient = useQueryClient();

  // Fetch sub-products
  const { data, isLoading, error } = useQuery({
    queryKey: [API_ENDPOINTS.SUB_PRODUCTS],
  });

  const subProducts: SubProduct[] = (data as { subProducts: SubProduct[] } | undefined)?.subProducts || [];

  // Create sub-product mutation
  const createMutation = useMutation({
    mutationFn: async (subProductData: InsertSubProduct) => {
      return apiRequest("POST", API_ENDPOINTS.SUB_PRODUCTS, subProductData);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [API_ENDPOINTS.SUB_PRODUCTS] });
      setIsCreateDialogOpen(false);
      setImagePreview("");
      toast({
        title: "Success",
        description: "Sub-product created successfully",
      });
    },
    onError: () => {
      toast({
        title: "Error",
        description: "Failed to create sub-product",
        variant: "destructive",
      });
    },
  });

  // Update sub-product mutation
  const updateMutation = useMutation({
    mutationFn: async ({ id, data }: { id: number; data: Partial<InsertSubProduct> }) => {
      return apiRequest("PUT", API_ENDPOINTS.SUB_PRODUCT(id), data);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [API_ENDPOINTS.SUB_PRODUCTS] });
      setIsEditDialogOpen(false);
      setEditingSubProduct(null);
      setImagePreview("");
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
    const contentType = formData.get("contentType") as string;
    
    const subProductData: InsertSubProduct = {
      name: formData.get("name") as string,
      modelNumber: formData.get("modelNumber") as string,
      description: contentType === "manual" ? (formData.get("description") as string) : null,
      contentType: contentType || "manual",
      content: contentType === "manual" ? (formData.get("content") as string) : null,
      externalUrl: contentType === "external" ? (formData.get("externalUrl") as string) : null,
      specifications: createSpecifications,
      features: createFeatures,
      photo: imagePreview || "https://via.placeholder.com/400x300",
    };

    createMutation.mutate(subProductData);
  };

  const handleEditSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (!editingSubProduct) return;
    
    const formData = new FormData(event.currentTarget);
    const contentType = formData.get("contentType") as string;
    
    const subProductData: Partial<InsertSubProduct> = {
      name: formData.get("name") as string,
      modelNumber: formData.get("modelNumber") as string,
      description: contentType === "manual" ? (formData.get("description") as string) : null,
      contentType: contentType || "manual",
      content: contentType === "manual" ? (formData.get("content") as string) : null,
      externalUrl: contentType === "external" ? (formData.get("externalUrl") as string) : null,
      specifications: editSpecifications,
      features: editFeatures,
      photo: imagePreview || editingSubProduct.photo,
    };

    updateMutation.mutate({ id: editingSubProduct.id, data: subProductData });
  };

  const handleEdit = (subProduct: SubProduct) => {
    setEditingSubProduct(subProduct);
    setImagePreview(subProduct.photo);
    setEditContentType(subProduct.contentType || "manual");
    setEditSpecifications(subProduct.specifications || []);
    setEditFeatures(subProduct.features || []);
    setIsEditDialogOpen(true);
  };

  // Helper functions for specifications
  const addCreateSpecification = () => {
    setCreateSpecifications([...createSpecifications, { key: "", value: "" }]);
  };

  const updateCreateSpecification = (index: number, field: 'key' | 'value', value: string) => {
    const updated = [...createSpecifications];
    updated[index][field] = value;
    setCreateSpecifications(updated);
  };

  const removeCreateSpecification = (index: number) => {
    setCreateSpecifications(createSpecifications.filter((_, i) => i !== index));
  };

  const addEditSpecification = () => {
    setEditSpecifications([...editSpecifications, { key: "", value: "" }]);
  };

  const updateEditSpecification = (index: number, field: 'key' | 'value', value: string) => {
    const updated = [...editSpecifications];
    updated[index][field] = value;
    setEditSpecifications(updated);
  };

  const removeEditSpecification = (index: number) => {
    setEditSpecifications(editSpecifications.filter((_, i) => i !== index));
  };

  // Helper functions for features
  const addCreateFeature = () => {
    setCreateFeatures([...createFeatures, ""]);
  };

  const updateCreateFeature = (index: number, value: string) => {
    const updated = [...createFeatures];
    updated[index] = value;
    setCreateFeatures(updated);
  };

  const removeCreateFeature = (index: number) => {
    setCreateFeatures(createFeatures.filter((_, i) => i !== index));
  };

  const addEditFeature = () => {
    setEditFeatures([...editFeatures, ""]);
  };

  const updateEditFeature = (index: number, value: string) => {
    const updated = [...editFeatures];
    updated[index] = value;
    setEditFeatures(updated);
  };

  const removeEditFeature = (index: number) => {
    setEditFeatures(editFeatures.filter((_, i) => i !== index));
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
            <Button>
              <Plus className="w-4 h-4 mr-2" />
              Add Sub-Product
            </Button>
          </DialogTrigger>
          <DialogContent className="max-w-2xl">
            <DialogHeader>
              <DialogTitle>Create New Sub-Product</DialogTitle>
            </DialogHeader>
            <form onSubmit={handleCreateSubmit} className="space-y-4">
              <div>
                <Label htmlFor="name">Name</Label>
                <Input id="name" name="name" required />
              </div>
              <div>
                <Label htmlFor="modelNumber">Model Number</Label>
                <Input id="modelNumber" name="modelNumber" required placeholder="e.g., FT-2000X" />
              </div>
              {/* Description - Only for Manual Content */}
              {createContentType === "manual" && (
                <div>
                  <Label htmlFor="description">Description</Label>
                  <Textarea id="description" name="description" required />
                </div>
              )}
              
              {/* Content Type Selection */}
              <div>
                <Label>Content Type</Label>
                <div className="flex space-x-4 mt-2">
                  <label className="flex items-center space-x-2">
                    <input
                      type="radio"
                      name="contentType"
                      value="manual"
                      checked={createContentType === "manual"}
                      onChange={(e) => setCreateContentType(e.target.value)}
                      className="text-primary"
                    />
                    <span>Manual Content</span>
                  </label>
                  <label className="flex items-center space-x-2">
                    <input
                      type="radio"
                      name="contentType"
                      value="external"
                      checked={createContentType === "external"}
                      onChange={(e) => setCreateContentType(e.target.value)}
                      className="text-primary"
                    />
                    <span>External Link</span>
                  </label>
                </div>
              </div>

              {/* Manual Content Field */}
              {createContentType === "manual" && (
                <div>
                  <Label htmlFor="content">Content</Label>
                  <Textarea id="content" name="content" rows={4} />
                  <p className="text-sm text-gray-500 mt-1">
                    Add detailed content that will be shown on the sub-product page
                  </p>
                </div>
              )}

              {/* External URL Field */}
              {createContentType === "external" && (
                <div>
                  <Label htmlFor="externalUrl">External URL</Label>
                  <Input 
                    id="externalUrl" 
                    name="externalUrl" 
                    type="url" 
                    placeholder="https://example.com/product-details"
                  />
                  <p className="text-sm text-gray-500 mt-1">
                    Users will be redirected to this external page when they click on the sub-product
                  </p>
                </div>
              )}

              {/* Specifications Section - Only for Manual Content */}
              {createContentType === "manual" && (
                <div>
                  <div className="flex justify-between items-center mb-2">
                    <Label>Specifications</Label>
                    <Button type="button" onClick={addCreateSpecification} size="sm" variant="outline">
                      <Plus className="w-4 h-4 mr-1" />
                      Add Specification
                    </Button>
                  </div>
                  {createSpecifications.length > 0 ? (
                    <div className="space-y-2 border rounded-md p-3">
                      {createSpecifications.map((spec, index) => (
                        <div key={index} className="flex gap-2 items-center">
                          <Input
                            placeholder="Key (e.g., Weight)"
                            value={spec.key}
                            onChange={(e) => updateCreateSpecification(index, 'key', e.target.value)}
                            className="flex-1"
                          />
                          <Input
                            placeholder="Value (e.g., 2500 kg)"
                            value={spec.value}
                            onChange={(e) => updateCreateSpecification(index, 'value', e.target.value)}
                            className="flex-1"
                          />
                          <Button
                            type="button"
                            onClick={() => removeCreateSpecification(index)}
                            size="sm"
                            variant="ghost"
                            className="text-red-500 hover:text-red-700"
                          >
                            <X className="w-4 h-4" />
                          </Button>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <p className="text-sm text-gray-500">No specifications added yet.</p>
                  )}
                </div>
              )}

              {/* Features Section - Only for Manual Content */}
              {createContentType === "manual" && (
                <div>
                  <div className="flex justify-between items-center mb-2">
                    <Label>Features</Label>
                    <Button type="button" onClick={addCreateFeature} size="sm" variant="outline">
                      <Plus className="w-4 h-4 mr-1" />
                      Add Feature
                    </Button>
                  </div>
                  {createFeatures.length > 0 ? (
                    <div className="space-y-2 border rounded-md p-3">
                      {createFeatures.map((feature, index) => (
                        <div key={index} className="flex gap-2 items-center">
                          <Input
                            placeholder="Feature description"
                            value={feature}
                            onChange={(e) => updateCreateFeature(index, e.target.value)}
                            className="flex-1"
                          />
                          <Button
                            type="button"
                            onClick={() => removeCreateFeature(index)}
                            size="sm"
                            variant="ghost"
                            className="text-red-500 hover:text-red-700"
                          >
                            <X className="w-4 h-4" />
                          </Button>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <p className="text-sm text-gray-500">No features added yet.</p>
                  )}
                </div>
              )}
              <div>
                <Label htmlFor="photo">Photo</Label>
                <Input
                  id="photo"
                  type="file"
                  accept="image/*"
                  onChange={handleImageUpload}
                />
                {imagePreview && (
                  <img
                    src={imagePreview}
                    alt="Preview"
                    className="mt-2 w-32 h-32 object-cover rounded"
                  />
                )}
              </div>
              <div className="flex justify-end space-x-2">
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => {
                    setIsCreateDialogOpen(false);
                    setImagePreview("");
                  }}
                >
                  Cancel
                </Button>
                <Button type="submit" disabled={createMutation.isPending}>
                  {createMutation.isPending ? "Creating..." : "Create"}
                </Button>
              </div>
            </form>
          </DialogContent>
        </Dialog>
      </div>

      {/* Sub-Products Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {subProducts.map((subProduct) => (
          <Card key={subProduct.id} className="overflow-hidden">
            <div className="aspect-video bg-gray-100">
              <img
                src={subProduct.photo}
                alt={subProduct.name}
                className="w-full h-full object-cover"
              />
            </div>
            <CardHeader>
              <CardTitle className="text-lg">{subProduct.name}</CardTitle>
              <p className="text-sm text-gray-600 line-clamp-2">
                {subProduct.description}
              </p>
            </CardHeader>
            <CardContent>
              <div className="flex justify-end space-x-2">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => handleEdit(subProduct)}
                >
                  <Edit2 className="w-4 h-4" />
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => handleDelete(subProduct.id)}
                  className="text-red-600 hover:text-red-700"
                >
                  <Trash2 className="w-4 h-4" />
                </Button>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {subProducts.length === 0 && (
        <div className="text-center py-12">
          <Package className="h-12 w-12 text-gray-400 mx-auto mb-4" />
          <h3 className="text-lg font-semibold mb-2">No sub-products found</h3>
          <p className="text-gray-600 mb-4">
            Start by creating your first sub-product
          </p>
          <Button onClick={() => setIsCreateDialogOpen(true)}>
            <Plus className="w-4 h-4 mr-2" />
            Add Sub-Product
          </Button>
        </div>
      )}

      {/* Edit Dialog */}
      <Dialog open={isEditDialogOpen} onOpenChange={setIsEditDialogOpen}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle>Edit Sub-Product</DialogTitle>
          </DialogHeader>
          {editingSubProduct && (
            <form onSubmit={handleEditSubmit} className="space-y-4">
              <div>
                <Label htmlFor="edit-name">Name</Label>
                <Input
                  id="edit-name"
                  name="name"
                  defaultValue={editingSubProduct.name}
                  required
                />
              </div>
              <div>
                <Label htmlFor="edit-modelNumber">Model Number</Label>
                <Input
                  id="edit-modelNumber"
                  name="modelNumber"
                  defaultValue={editingSubProduct.modelNumber}
                  required
                  placeholder="e.g., FT-2000X"
                />
              </div>
              {/* Description - Only for Manual Content */}
              {editContentType === "manual" && (
                <div>
                  <Label htmlFor="edit-description">Description</Label>
                  <Textarea
                    id="edit-description"
                    name="description"
                    defaultValue={editingSubProduct.description}
                    required
                  />
                </div>
              )}
              
              {/* Content Type Selection */}
              <div>
                <Label>Content Type</Label>
                <div className="flex space-x-4 mt-2">
                  <label className="flex items-center space-x-2">
                    <input
                      type="radio"
                      name="contentType"
                      value="manual"
                      checked={editContentType === "manual"}
                      onChange={(e) => setEditContentType(e.target.value)}
                      className="text-primary"
                    />
                    <span>Manual Content</span>
                  </label>
                  <label className="flex items-center space-x-2">
                    <input
                      type="radio"
                      name="contentType"
                      value="external"
                      checked={editContentType === "external"}
                      onChange={(e) => setEditContentType(e.target.value)}
                      className="text-primary"
                    />
                    <span>External Link</span>
                  </label>
                </div>
              </div>

              {/* Manual Content Field */}
              {editContentType === "manual" && (
                <div>
                  <Label htmlFor="edit-content">Content</Label>
                  <Textarea
                    id="edit-content"
                    name="content"
                    rows={4}
                    defaultValue={editingSubProduct.content || ""}
                  />
                  <p className="text-sm text-gray-500 mt-1">
                    Add detailed content that will be shown on the sub-product page
                  </p>
                </div>
              )}

              {/* External URL Field */}
              {editContentType === "external" && (
                <div>
                  <Label htmlFor="edit-externalUrl">External URL</Label>
                  <Input 
                    id="edit-externalUrl" 
                    name="externalUrl" 
                    type="url" 
                    placeholder="https://example.com/product-details"
                    defaultValue={editingSubProduct.externalUrl || ""}
                  />
                  <p className="text-sm text-gray-500 mt-1">
                    Users will be redirected to this external page when they click on the sub-product
                  </p>
                </div>
              )}

              {/* Specifications Section - Only for Manual Content */}
              {editContentType === "manual" && (
                <div>
                  <div className="flex justify-between items-center">
                    <Label>Specifications</Label>
                    <Button
                      type="button"
                      variant="outline"
                      size="sm"
                      onClick={addEditSpecification}
                    >
                      <Plus className="w-4 h-4 mr-1" />
                      Add Spec
                    </Button>
                  </div>
                  {editSpecifications.length > 0 ? (
                    <div className="space-y-2 mt-2">
                      {editSpecifications.map((spec, index) => (
                        <div key={index} className="flex space-x-2">
                          <Input
                            placeholder="Property (e.g., Weight)"
                            value={spec.key}
                            onChange={(e) => updateEditSpecification(index, 'key', e.target.value)}
                            className="flex-1"
                          />
                          <Input
                            placeholder="Value (e.g., 2.5 kg)"
                            value={spec.value}
                            onChange={(e) => updateEditSpecification(index, 'value', e.target.value)}
                            className="flex-1"
                          />
                          <Button
                            type="button"
                            variant="outline"
                            size="sm"
                            onClick={() => removeEditSpecification(index)}
                            className="text-red-600 hover:text-red-700"
                          >
                            <X className="w-4 h-4" />
                          </Button>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <p className="text-sm text-gray-500 mt-2">No specifications added yet.</p>
                  )}
                </div>
              )}

              {/* Features Section - Only for Manual Content */}
              {editContentType === "manual" && (
                <div>
                  <div className="flex justify-between items-center">
                    <Label>Features</Label>
                    <Button
                      type="button"
                      variant="outline"
                      size="sm"
                      onClick={addEditFeature}
                    >
                      <Plus className="w-4 h-4 mr-1" />
                      Add Feature
                    </Button>
                  </div>
                  {editFeatures.length > 0 ? (
                    <div className="space-y-2 mt-2">
                      {editFeatures.map((feature, index) => (
                        <div key={index} className="flex space-x-2">
                          <Input
                            placeholder="Feature description"
                            value={feature}
                            onChange={(e) => updateEditFeature(index, e.target.value)}
                            className="flex-1"
                          />
                          <Button
                            type="button"
                            variant="outline"
                            size="sm"
                            onClick={() => removeEditFeature(index)}
                            className="text-red-600 hover:text-red-700"
                          >
                            <X className="w-4 h-4" />
                          </Button>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <p className="text-sm text-gray-500 mt-2">No features added yet.</p>
                  )}
                </div>
              )}

              <div>
                <Label htmlFor="edit-photo">Photo</Label>
                <Input
                  id="edit-photo"
                  type="file"
                  accept="image/*"
                  onChange={handleImageUpload}
                />
                {imagePreview && (
                  <img
                    src={imagePreview}
                    alt="Preview"
                    className="mt-2 w-32 h-32 object-cover rounded"
                  />
                )}
              </div>
              <div className="flex justify-end space-x-2">
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => {
                    setIsEditDialogOpen(false);
                    setEditingSubProduct(null);
                    setImagePreview("");
                  }}
                >
                  Cancel
                </Button>
                <Button type="submit" disabled={updateMutation.isPending}>
                  {updateMutation.isPending ? "Updating..." : "Update"}
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