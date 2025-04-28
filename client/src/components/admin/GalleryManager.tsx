import React, { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { API_ENDPOINTS } from "@/lib/config";
import { apiRequest } from "@/lib/queryClient";
import { useToast } from "@/hooks/use-toast";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { InsertGallery, Gallery } from "@shared/schema";

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
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Plus,
  Trash2,
  Loader2,
  Image as ImageIcon,
  Eye,
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
import GalleryModal from "@/components/gallery/GalleryModal";

const formSchema = z.object({
  photo: z.string().min(5, "Photo URL is required"),
  description: z.string().min(2, "Description must be at least 2 characters"),
  fileUpload: z.any().optional()
});

type FormValues = z.infer<typeof formSchema>;

const GalleryManager: React.FC = () => {
  const { toast } = useToast();
  const queryClient = useQueryClient();
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [isPreviewModalOpen, setIsPreviewModalOpen] = useState(false);
  const [selectedItem, setSelectedItem] = useState<Gallery | null>(null);

  // Load gallery data
  const { data, isLoading, error } = useQuery<{ gallery: Gallery[] }>({
    queryKey: [API_ENDPOINTS.GALLERY],
  });

  const galleryItems = data?.gallery || [];

  // Form for adding gallery items
  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      photo: "",
      description: "",
    },
  });

  // Reset form and state for add dialog
  const [uploadedImageUrl, setUploadedImageUrl] = useState<string | null>(null);
  const [isUploading, setIsUploading] = useState(false);

  const openAddDialog = () => {
    form.reset({
      photo: "",
      description: "",
    });
    setUploadedImageUrl(null);
    setIsAddDialogOpen(true);
  };

  // Open delete confirmation dialog
  const openDeleteDialog = (item: Gallery) => {
    setSelectedItem(item);
    setIsDeleteDialogOpen(true);
  };

  // Open preview modal
  const openPreviewModal = (item: Gallery) => {
    setSelectedItem(item);
    setIsPreviewModalOpen(true);
  };

  // Create gallery item mutation
  const createGalleryItemMutation = useMutation({
    mutationFn: async (data: InsertGallery) => {
      const res = await apiRequest("POST", API_ENDPOINTS.GALLERY, data);
      return res.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [API_ENDPOINTS.GALLERY] });
      toast({
        title: "Gallery Item Added",
        description: "The gallery item has been added successfully",
      });
      setIsAddDialogOpen(false);
    },
    onError: (error) => {
      toast({
        title: "Error",
        description: "Failed to add gallery item. Please try again.",
        variant: "destructive",
      });
    },
  });

  // Delete gallery item mutation
  const deleteGalleryItemMutation = useMutation({
    mutationFn: async (id: number) => {
      const res = await apiRequest("DELETE", API_ENDPOINTS.GALLERY_ITEM(id));
      return res.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [API_ENDPOINTS.GALLERY] });
      toast({
        title: "Gallery Item Deleted",
        description: "The gallery item has been deleted successfully",
      });
      setIsDeleteDialogOpen(false);
    },
    onError: (error) => {
      toast({
        title: "Error",
        description: "Failed to delete gallery item. Please try again.",
        variant: "destructive",
      });
    },
  });

  // Handle form submission for add gallery item
  const onAddSubmit = (values: FormValues) => {
    // Make sure we send only the necessary data to the API
    const galleryData: InsertGallery = {
      photo: values.photo,
      description: values.description
    };
    createGalleryItemMutation.mutateAsync(galleryData);
  };

  // Handle gallery item deletion
  const onDeleteConfirm = () => {
    if (!selectedItem) return;
    deleteGalleryItemMutation.mutateAsync(selectedItem.id);
  };

  // Check if there's an operation in progress
  const isOperationInProgress =
    createGalleryItemMutation.isPending || deleteGalleryItemMutation.isPending;

  return (
    <div>
      <Card>
        <CardHeader className="flex flex-row items-start justify-between">
          <div>
            <CardTitle className="text-2xl">Gallery Management</CardTitle>
            <CardDescription>
              Add photos to your gallery to showcase your products and projects.
            </CardDescription>
          </div>
          <Button onClick={openAddDialog} className="bg-primary hover:bg-primary/90">
            <Plus className="mr-2 h-4 w-4" /> Add Photo
          </Button>
        </CardHeader>
        <CardContent>
          {isLoading ? (
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
              {[...Array(8)].map((_, index) => (
                <Skeleton key={index} className="aspect-square rounded-lg" />
              ))}
            </div>
          ) : error ? (
            <div className="text-center py-6 text-red-500">
              Failed to load gallery. Please try again.
            </div>
          ) : galleryItems.length === 0 ? (
            <div className="text-center py-12 border rounded-lg border-dashed">
              <ImageIcon className="h-12 w-12 mx-auto text-gray-400 mb-3" />
              <h3 className="text-lg font-medium text-gray-900 mb-1">No Images Yet</h3>
              <p className="text-gray-500 mb-4">You haven't added any gallery photos yet.</p>
              <Button onClick={openAddDialog} className="bg-primary hover:bg-primary/90">
                <Plus className="mr-2 h-4 w-4" /> Add Your First Photo
              </Button>
            </div>
          ) : (
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
              {galleryItems.map((item: Gallery) => (
                <div
                  key={item.id}
                  className="group relative aspect-square overflow-hidden rounded-lg bg-gray-100 border"
                >
                  <img
                    src={item.photo}
                    alt={item.description}
                    className="h-full w-full object-cover transition-transform duration-300 group-hover:scale-105"
                    onError={(e) => {
                      (e.target as HTMLImageElement).src =
                        "https://via.placeholder.com/400?text=Error";
                    }}
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity p-3 flex flex-col justify-between">
                    <div className="flex justify-end">
                      <Button
                        variant="secondary"
                        size="icon"
                        className="h-8 w-8 rounded-full bg-black/20 hover:bg-black/40"
                        onClick={(e) => {
                          e.stopPropagation();
                          openPreviewModal(item);
                        }}
                      >
                        <Eye className="h-4 w-4" />
                      </Button>
                    </div>
                    <div>
                      <p className="text-sm text-white font-medium mb-2">
                        {item.description}
                      </p>
                      <Button
                        variant="destructive"
                        size="sm"
                        className="w-full"
                        onClick={(e) => {
                          e.stopPropagation();
                          openDeleteDialog(item);
                        }}
                      >
                        <Trash2 className="h-4 w-4 mr-1" /> Delete
                      </Button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>

      {/* Add Gallery Item Dialog */}
      <Dialog open={isAddDialogOpen} onOpenChange={setIsAddDialogOpen}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>Add New Gallery Photo</DialogTitle>
            <DialogDescription>
              Enter the URL and description for the new gallery photo.
            </DialogDescription>
          </DialogHeader>

          <Form {...form}>
            <form onSubmit={form.handleSubmit(onAddSubmit)} className="space-y-6">
              <div className="grid gap-4">
                <div className="space-y-2">
                  <h3 className="text-md font-medium">Upload Photo</h3>
                  <div className="flex flex-col gap-4">
                    <div className="border rounded-lg p-4">
                      <FormField
                        control={form.control}
                        name="fileUpload"
                        render={({ field: { value, onChange, ...fieldProps } }) => (
                          <FormItem>
                            <FormLabel>Select Image File</FormLabel>
                            <FormControl>
                              <Input 
                                type="file" 
                                accept="image/*"
                                onChange={(e) => {
                                  const file = e.target.files?.[0];
                                  if (file) {
                                    setIsUploading(true);
                                    
                                    // Create FormData for file upload
                                    const formData = new FormData();
                                    formData.append('file', file);
                                    
                                    // Read file as data URL to show preview
                                    const reader = new FileReader();
                                    reader.onload = (e) => {
                                      const dataUrl = e.target?.result as string;
                                      setUploadedImageUrl(dataUrl);
                                      form.setValue('photo', dataUrl);
                                      setIsUploading(false);
                                    };
                                    reader.readAsDataURL(file);
                                  }
                                }}
                                {...fieldProps}
                              />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                      
                      {uploadedImageUrl && (
                        <div className="mt-4">
                          <p className="text-sm font-medium mb-2">Preview:</p>
                          <div className="relative aspect-square w-full max-w-[200px] overflow-hidden rounded-md border">
                            <img 
                              src={uploadedImageUrl} 
                              alt="Preview" 
                              className="h-full w-full object-cover"
                            />
                          </div>
                        </div>
                      )}
                    </div>
                    
                    <div className="relative">
                      <div className="absolute inset-0 flex items-center">
                        <span className="w-full border-t" />
                      </div>
                      <div className="relative flex justify-center text-xs">
                        <span className="bg-background px-2 text-muted-foreground">or use a URL</span>
                      </div>
                    </div>
                    
                    <FormField
                      control={form.control}
                      name="photo"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Photo URL</FormLabel>
                          <FormControl>
                            <Input 
                              placeholder="https://example.com/image.jpg" 
                              {...field} 
                              disabled={isUploading}
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>
                </div>
              </div>

              <FormField
                control={form.control}
                name="description"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Description</FormLabel>
                    <FormControl>
                      <Input placeholder="Enter photo description" {...field} />
                    </FormControl>
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
                  {createGalleryItemMutation.isPending ? (
                    <>
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" /> Adding...
                    </>
                  ) : (
                    "Add Photo"
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
              This action cannot be undone. This will permanently delete the gallery
              photo from your database.
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
              {deleteGalleryItemMutation.isPending ? (
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

      {/* Preview Modal */}
      {selectedItem && isPreviewModalOpen && (
        <GalleryModal
          image={selectedItem.photo}
          description={selectedItem.description}
          onClose={() => setIsPreviewModalOpen(false)}
        />
      )}
    </div>
  );
};

export default GalleryManager;
