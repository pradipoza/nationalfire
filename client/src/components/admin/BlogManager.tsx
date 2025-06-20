import React, { useState, useRef } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { API_ENDPOINTS } from "@/lib/config";
import { apiRequest } from "@/lib/queryClient";
import { useToast } from "@/hooks/use-toast";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { InsertBlog, Blog } from "@shared/schema";
import { format } from "date-fns";

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
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Plus,
  Pencil,
  Trash2,
  Loader2,
  X,
  FileText,
  CalendarDays,
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
  title: z.string().min(3, "Title must be at least 3 characters"),
  content: z.string().min(10, "Content must be at least 10 characters"),
  photos: z.array(
    z.object({
      url: z.string().url("Must be a valid URL"),
      position: z.enum(["top", "middle", "bottom"]),
    })
  ),
});

type FormValues = z.infer<typeof formSchema>;
type PhotoItem = { url: string; position: "top" | "middle" | "bottom" };

const BlogManager: React.FC = () => {
  const { toast } = useToast();
  const queryClient = useQueryClient();
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [currentBlog, setCurrentBlog] = useState<Blog | null>(null);
  const [photos, setPhotos] = useState<PhotoItem[]>([]);
  const [newPhotoUrl, setNewPhotoUrl] = useState("");
  const [newPhotoPosition, setNewPhotoPosition] = useState<"top" | "middle" | "bottom">("top");
  const [isUploading, setIsUploading] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Load blogs data
  const { data, isLoading, error } = useQuery<{ blogs: Blog[] } | undefined>({
    queryKey: [API_ENDPOINTS.BLOGS],
  });

  const blogs = data?.blogs || [];

  // Form for adding/editing blogs
  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      title: "",
      content: "",
      photos: [],
    },
  });

  // Reset form and state for add dialog
  const openAddDialog = () => {
    form.reset({
      title: "",
      content: "",
      photos: [],
    });
    setPhotos([]);
    setNewPhotoUrl("");
    setNewPhotoPosition("top");
    setIsAddDialogOpen(true);
  };

  // Set form values for edit dialog
  const openEditDialog = (blog: Blog) => {
    form.reset({
      title: blog.title,
      content: blog.content,
      photos: blog.photos,
    });
    setPhotos(blog.photos);
    setNewPhotoUrl("");
    setNewPhotoPosition("top");
    setCurrentBlog(blog);
    setIsEditDialogOpen(true);
  };

  // Open delete confirmation dialog
  const openDeleteDialog = (blog: Blog) => {
    setCurrentBlog(blog);
    setIsDeleteDialogOpen(true);
  };

  // Add photo URL to the list
  const addPhoto = () => {
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

    const newPhoto: PhotoItem = {
      url: newPhotoUrl,
      position: newPhotoPosition,
    };

    const updatedPhotos = [...photos, newPhoto];
    setPhotos(updatedPhotos);
    form.setValue("photos", updatedPhotos, { shouldValidate: true });
    setNewPhotoUrl("");
  };
  
  // Handle file upload
  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    
    setIsUploading(true);
    
    // Read file as data URL
    const reader = new FileReader();
    reader.onload = (e) => {
      const dataUrl = e.target?.result as string;
      
      const newPhoto: PhotoItem = {
        url: dataUrl,
        position: newPhotoPosition,
      };
      
      const updatedPhotos = [...photos, newPhoto];
      setPhotos(updatedPhotos);
      form.setValue("photos", updatedPhotos, { shouldValidate: true });
      setIsUploading(false);
      
      // Clear the file input
      if (fileInputRef.current) {
        fileInputRef.current.value = "";
      }
    };
    
    reader.onerror = () => {
      toast({
        title: "Error",
        description: "Failed to read file. Please try again.",
        variant: "destructive",
      });
      setIsUploading(false);
    };
    
    reader.readAsDataURL(file);
  };

  // Remove photo from the list
  const removePhoto = (index: number) => {
    const updatedPhotos = photos.filter((_, i) => i !== index);
    setPhotos(updatedPhotos);
    form.setValue("photos", updatedPhotos, { shouldValidate: true });
  };

  // Create blog mutation
  const createBlogMutation = useMutation({
    mutationFn: async (data: InsertBlog) => {
      const res = await apiRequest("POST", API_ENDPOINTS.BLOGS, data);
      return res.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [API_ENDPOINTS.BLOGS] });
      toast({
        title: "Blog Added",
        description: "The blog has been added successfully",
      });
      setIsAddDialogOpen(false);
    },
    onError: (error) => {
      toast({
        title: "Error",
        description: "Failed to add blog. Please try again.",
        variant: "destructive",
      });
    },
  });

  // Update blog mutation
  const updateBlogMutation = useMutation({
    mutationFn: async ({
      id,
      data,
    }: {
      id: number;
      data: Partial<InsertBlog>;
    }) => {
      const res = await apiRequest("PUT", API_ENDPOINTS.BLOG(id), data);
      return res.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [API_ENDPOINTS.BLOGS] });
      toast({
        title: "Blog Updated",
        description: "The blog has been updated successfully",
      });
      setIsEditDialogOpen(false);
    },
    onError: (error) => {
      toast({
        title: "Error",
        description: "Failed to update blog. Please try again.",
        variant: "destructive",
      });
    },
  });

  // Delete blog mutation
  const deleteBlogMutation = useMutation({
    mutationFn: async (id: number) => {
      const res = await apiRequest("DELETE", API_ENDPOINTS.BLOG(id));
      return res.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [API_ENDPOINTS.BLOGS] });
      toast({
        title: "Blog Deleted",
        description: "The blog has been deleted successfully",
      });
      setIsDeleteDialogOpen(false);
    },
    onError: (error) => {
      toast({
        title: "Error",
        description: "Failed to delete blog. Please try again.",
        variant: "destructive",
      });
    },
  });

  // Handle form submission for add blog
  const onAddSubmit = (values: FormValues) => {
    createBlogMutation.mutate(values);
  };

  // Handle form submission for edit blog
  const onEditSubmit = (values: FormValues) => {
    if (!currentBlog) return;
    updateBlogMutation.mutate({
      id: currentBlog.id,
      data: values,
    });
  };

  // Handle blog deletion
  const onDeleteConfirm = () => {
    if (!currentBlog) return;
    deleteBlogMutation.mutate(currentBlog.id);
  };

  // Check if there's an operation in progress
  const isOperationInProgress =
    createBlogMutation.isPending ||
    updateBlogMutation.isPending ||
    deleteBlogMutation.isPending;

  // Get main image URL from photos array
  const getMainImageUrl = (photos: { url: string; position: string }[]) => {
    const topPhoto = photos.find((photo) => photo.position === "top");
    return topPhoto ? topPhoto.url : photos[0]?.url || "https://via.placeholder.com/150";
  };

  // Format the date
  const formatDate = (dateString: string) => {
    return format(new Date(dateString), "MMM d, yyyy");
  };

  return (
    <div>
      <Card>
        <CardHeader className="flex flex-row items-start justify-between">
          <div>
            <CardTitle className="text-2xl">Blog Management</CardTitle>
            <CardDescription>
              Create, edit and manage blog posts for your website.
            </CardDescription>
          </div>
          <Button onClick={openAddDialog} className="bg-primary hover:bg-primary/90">
            <Plus className="mr-2 h-4 w-4" /> Add Blog
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
              Failed to load blogs. Please try again.
            </div>
          ) : blogs.length === 0 ? (
            <div className="text-center py-12 border rounded-lg border-dashed">
              <FileText className="h-12 w-12 mx-auto text-gray-400 mb-3" />
              <h3 className="text-lg font-medium text-gray-900 mb-1">No Blogs Yet</h3>
              <p className="text-gray-500 mb-4">You haven't added any blog posts yet.</p>
              <Button onClick={openAddDialog} className="bg-primary hover:bg-primary/90">
                <Plus className="mr-2 h-4 w-4" /> Create Your First Blog
              </Button>
            </div>
          ) : (
            <div className="border rounded-lg overflow-hidden">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Image</TableHead>
                    <TableHead>Title</TableHead>
                    <TableHead className="hidden md:table-cell">Date</TableHead>
                    <TableHead className="hidden md:table-cell">Content Preview</TableHead>
                    <TableHead>Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {blogs.map((blog) => (
                    <TableRow key={blog.id}>
                      <TableCell>
                        <div className="w-12 h-12 overflow-hidden rounded">
                          <img
                            src={getMainImageUrl(blog.photos)}
                            alt={blog.title}
                            className="w-full h-full object-cover"
                            onError={(e) => {
                              (e.target as HTMLImageElement).src =
                                "https://via.placeholder.com/150?text=Error";
                            }}
                          />
                        </div>
                      </TableCell>
                      <TableCell className="font-medium">{blog.title}</TableCell>
                      <TableCell className="hidden md:table-cell">
                        <div className="flex items-center text-sm">
                          <CalendarDays className="h-4 w-4 mr-1 text-gray-500" />
                          {formatDate(blog.createdAt)}
                        </div>
                      </TableCell>
                      <TableCell className="hidden md:table-cell">
                        <div className="max-w-xs overflow-hidden">
                          <p className="truncate">
                            {blog.content.slice(0, 80)}...
                          </p>
                        </div>
                      </TableCell>
                      <TableCell>
                        <div className="flex space-x-2">
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => openEditDialog(blog)}
                          >
                            <Pencil className="h-4 w-4" />
                            <span className="sr-only">Edit</span>
                          </Button>
                          <Button
                            variant="destructive"
                            size="sm"
                            onClick={() => openDeleteDialog(blog)}
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

      {/* Add Blog Dialog */}
      <Dialog open={isAddDialogOpen} onOpenChange={setIsAddDialogOpen}>
        <DialogContent className="max-w-3xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>Add New Blog</DialogTitle>
            <DialogDescription>
              Create a new blog post to share with your audience.
            </DialogDescription>
          </DialogHeader>

          <Form {...form}>
            <form onSubmit={form.handleSubmit(onAddSubmit)} className="space-y-6">
              <FormField
                control={form.control}
                name="title"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Blog Title</FormLabel>
                    <FormControl>
                      <Input placeholder="Enter blog title" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="content"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Content</FormLabel>
                    <FormControl>
                      <Textarea
                        placeholder="Write your blog content here"
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
                        <div className="flex-1">
                          <Input
                            placeholder="Enter photo URL"
                            value={newPhotoUrl}
                            onChange={(e) => setNewPhotoUrl(e.target.value)}
                          />
                        </div>
                        <div className="w-32">
                          <Select
                            value={newPhotoPosition}
                            onValueChange={(value: "top" | "middle" | "bottom") =>
                              setNewPhotoPosition(value)
                            }
                          >
                            <SelectTrigger>
                              <SelectValue placeholder="Position" />
                            </SelectTrigger>
                            <SelectContent>
                              <SelectItem value="top">Top</SelectItem>
                              <SelectItem value="middle">Middle</SelectItem>
                              <SelectItem value="bottom">Bottom</SelectItem>
                            </SelectContent>
                          </Select>
                        </div>
                        <Button
                          type="button"
                          onClick={addPhoto}
                          variant="secondary"
                        >
                          Add
                        </Button>
                      </div>

                      {/* Photo list */}
                      {photos.length > 0 ? (
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-3">
                          {photos.map((photo, index) => (
                            <div
                              key={index}
                              className="border rounded-md p-3 flex items-center space-x-3"
                            >
                              <div className="w-16 h-16 flex-shrink-0 overflow-hidden rounded">
                                <img
                                  src={photo.url}
                                  alt={`Blog photo ${index + 1}`}
                                  className="w-full h-full object-cover"
                                  onError={(e) => {
                                    (e.target as HTMLImageElement).src =
                                      "https://via.placeholder.com/150?text=Error";
                                  }}
                                />
                              </div>
                              <div className="flex-1 min-w-0">
                                <p className="text-sm truncate">{photo.url}</p>
                                <p className="text-xs text-gray-500 capitalize">
                                  Position: {photo.position}
                                </p>
                              </div>
                              <Button
                                type="button"
                                variant="ghost"
                                size="sm"
                                onClick={() => removePhoto(index)}
                                className="text-red-500 hover:text-red-700 hover:bg-red-50"
                              >
                                <X className="h-4 w-4" />
                              </Button>
                            </div>
                          ))}
                        </div>
                      ) : (
                        <p className="text-sm text-gray-500">
                          No photos added yet. Photos are optional but recommended.
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
                  {createBlogMutation.isPending ? (
                    <>
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" /> Adding...
                    </>
                  ) : (
                    "Publish Blog"
                  )}
                </Button>
              </DialogFooter>
            </form>
          </Form>
        </DialogContent>
      </Dialog>

      {/* Edit Blog Dialog */}
      <Dialog open={isEditDialogOpen} onOpenChange={setIsEditDialogOpen}>
        <DialogContent className="max-w-3xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>Edit Blog</DialogTitle>
            <DialogDescription>
              Update the content and details of this blog post.
            </DialogDescription>
          </DialogHeader>

          <Form {...form}>
            <form onSubmit={form.handleSubmit(onEditSubmit)} className="space-y-6">
              <FormField
                control={form.control}
                name="title"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Blog Title</FormLabel>
                    <FormControl>
                      <Input placeholder="Enter blog title" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="content"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Content</FormLabel>
                    <FormControl>
                      <Textarea
                        placeholder="Write your blog content here"
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
                        <div className="flex-1">
                          <Input
                            placeholder="Enter photo URL"
                            value={newPhotoUrl}
                            onChange={(e) => setNewPhotoUrl(e.target.value)}
                          />
                        </div>
                        <div className="w-32">
                          <Select
                            value={newPhotoPosition}
                            onValueChange={(value: "top" | "middle" | "bottom") =>
                              setNewPhotoPosition(value)
                            }
                          >
                            <SelectTrigger>
                              <SelectValue placeholder="Position" />
                            </SelectTrigger>
                            <SelectContent>
                              <SelectItem value="top">Top</SelectItem>
                              <SelectItem value="middle">Middle</SelectItem>
                              <SelectItem value="bottom">Bottom</SelectItem>
                            </SelectContent>
                          </Select>
                        </div>
                        <Button
                          type="button"
                          onClick={addPhoto}
                          variant="secondary"
                        >
                          Add
                        </Button>
                      </div>

                      {/* Photo list */}
                      {photos.length > 0 ? (
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-3">
                          {photos.map((photo, index) => (
                            <div
                              key={index}
                              className="border rounded-md p-3 flex items-center space-x-3"
                            >
                              <div className="w-16 h-16 flex-shrink-0 overflow-hidden rounded">
                                <img
                                  src={photo.url}
                                  alt={`Blog photo ${index + 1}`}
                                  className="w-full h-full object-cover"
                                  onError={(e) => {
                                    (e.target as HTMLImageElement).src =
                                      "https://via.placeholder.com/150?text=Error";
                                  }}
                                />
                              </div>
                              <div className="flex-1 min-w-0">
                                <p className="text-sm truncate">{photo.url}</p>
                                <p className="text-xs text-gray-500 capitalize">
                                  Position: {photo.position}
                                </p>
                              </div>
                              <Button
                                type="button"
                                variant="ghost"
                                size="sm"
                                onClick={() => removePhoto(index)}
                                className="text-red-500 hover:text-red-700 hover:bg-red-50"
                              >
                                <X className="h-4 w-4" />
                              </Button>
                            </div>
                          ))}
                        </div>
                      ) : (
                        <p className="text-sm text-gray-500">
                          No photos added yet. Photos are optional but recommended.
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
                  {updateBlogMutation.isPending ? (
                    <>
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" /> Updating...
                    </>
                  ) : (
                    "Update Blog"
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
              This action cannot be undone. This will permanently delete the blog
              post "{currentBlog?.title}" from your database.
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
              {deleteBlogMutation.isPending ? (
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

export default BlogManager;
