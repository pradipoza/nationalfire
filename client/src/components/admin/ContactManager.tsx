import React, { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { API_ENDPOINTS } from "@/lib/config";
import { apiRequest } from "@/lib/queryClient";
import { useToast } from "@/hooks/use-toast";
import { useForm, useFieldArray } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { ContactInfo, Inquiry } from "@shared/schema";

import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
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
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Loader2,
  Save,
  Mail,
  MapPin,
  Phone,
  Facebook,
  Instagram,
  MessageSquare,
  Linkedin,
  Check,
  Trash2,
  Eye,
  Clock,
  Plus,
  X,
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
import { Badge } from "@/components/ui/badge";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from "@/components/ui/dialog";
import { format } from "date-fns";

const contactInfoSchema = z.object({
  address: z.string().min(5, "Address must be at least 5 characters"),
  phones: z.array(z.object({
    value: z.string().min(5, "Phone number must be at least 5 characters")
  })).min(1, "At least one phone number is required"),
  email: z.string().email("Please enter a valid email"),
  facebook: z.string().url("Please enter a valid URL").optional().or(z.literal("")),
  instagram: z.string().url("Please enter a valid URL").optional().or(z.literal("")),
  whatsapp: z.string().url("Please enter a valid URL").optional().or(z.literal("")),
  linkedin: z.string().url("Please enter a valid URL").optional().or(z.literal("")),
});

type ContactInfoFormValues = z.infer<typeof contactInfoSchema>;

const ContactManager: React.FC = () => {
  const { toast } = useToast();
  const queryClient = useQueryClient();
  const [activeTab, setActiveTab] = useState("contact-info");
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [isViewDialogOpen, setIsViewDialogOpen] = useState(false);
  const [selectedInquiry, setSelectedInquiry] = useState<Inquiry | null>(null);

  const {
    data: contactData,
    isLoading: isLoadingContactInfo,
    error: contactInfoError,
  } = useQuery({
    queryKey: [API_ENDPOINTS.CONTACT_INFO],
  });

  const {
    data: inquiriesData,
    isLoading: isLoadingInquiries,
    error: inquiriesError,
  } = useQuery({
    queryKey: [API_ENDPOINTS.INQUIRIES],
  });

  const contactInfo = contactData?.contactInfo as ContactInfo | undefined;
  const inquiries = (inquiriesData?.inquiries || []) as Inquiry[];

  const form = useForm<ContactInfoFormValues>({
    resolver: zodResolver(contactInfoSchema),
    defaultValues: {
      address: "",
      phones: [{ value: "" }],
      email: "",
      facebook: "",
      instagram: "",
      whatsapp: "",
      linkedin: "",
    },
  });

  const { fields, append, remove } = useFieldArray({
    control: form.control,
    name: "phones",
  });

  React.useEffect(() => {
    if (contactInfo) {
      const phonesArray = contactInfo.phones || [];
      form.reset({
        address: contactInfo.address,
        phones: phonesArray.length > 0 
          ? phonesArray.map((p: string) => ({ value: p }))
          : [{ value: "" }],
        email: contactInfo.email,
        facebook: contactInfo.facebook || "",
        instagram: contactInfo.instagram || "",
        whatsapp: contactInfo.whatsapp || "",
        linkedin: contactInfo.linkedin || "",
      });
    }
  }, [contactInfo, form]);

  const updateContactInfoMutation = useMutation({
    mutationFn: async (data: ContactInfoFormValues) => {
      const payload = {
        ...data,
        phones: data.phones.map(p => p.value),
      };
      const res = await apiRequest("PUT", API_ENDPOINTS.CONTACT_INFO, payload);
      return res.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [API_ENDPOINTS.CONTACT_INFO] });
      toast({
        title: "Contact Info Updated",
        description: "The contact information has been updated successfully",
      });
    },
    onError: () => {
      toast({
        title: "Error",
        description: "Failed to update contact information. Please try again.",
        variant: "destructive",
      });
    },
  });

  const markInquiryAsReadMutation = useMutation({
    mutationFn: async (id: number) => {
      const res = await apiRequest("PUT", API_ENDPOINTS.MARK_INQUIRY_READ(id));
      return res.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [API_ENDPOINTS.INQUIRIES] });
      toast({
        title: "Inquiry Updated",
        description: "The inquiry has been marked as read",
      });
    },
    onError: () => {
      toast({
        title: "Error",
        description: "Failed to update inquiry status. Please try again.",
        variant: "destructive",
      });
    },
  });

  const deleteInquiryMutation = useMutation({
    mutationFn: async (id: number) => {
      const res = await apiRequest("DELETE", API_ENDPOINTS.INQUIRY(id));
      return res.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [API_ENDPOINTS.INQUIRIES] });
      toast({
        title: "Inquiry Deleted",
        description: "The inquiry has been deleted successfully",
      });
      setIsDeleteDialogOpen(false);
    },
    onError: () => {
      toast({
        title: "Error",
        description: "Failed to delete inquiry. Please try again.",
        variant: "destructive",
      });
    },
  });

  const onSubmitContactInfo = (values: ContactInfoFormValues) => {
    updateContactInfoMutation.mutate(values);
  };

  const viewInquiry = (inquiry: Inquiry) => {
    setSelectedInquiry(inquiry);
    setIsViewDialogOpen(true);
    
    if (!inquiry.read) {
      markInquiryAsReadMutation.mutate(inquiry.id);
    }
  };

  const openDeleteDialog = (inquiry: Inquiry) => {
    setSelectedInquiry(inquiry);
    setIsDeleteDialogOpen(true);
  };

  const onDeleteConfirm = () => {
    if (!selectedInquiry) return;
    deleteInquiryMutation.mutate(selectedInquiry.id);
  };

  const formatDate = (dateString: string | Date | null) => {
    if (!dateString) return "Unknown";
    return format(new Date(dateString), "MMM d, yyyy h:mm a");
  };

  return (
    <div>
      <Tabs value={activeTab} onValueChange={setActiveTab}>
        <TabsList className="grid w-full grid-cols-2">
          <TabsTrigger value="contact-info">Contact Information</TabsTrigger>
          <TabsTrigger value="inquiries">Customer Inquiries</TabsTrigger>
        </TabsList>
        
        <TabsContent value="contact-info" className="mt-6">
          <Card>
            <CardHeader>
              <CardTitle className="text-2xl">Contact Information</CardTitle>
              <CardDescription>
                Update your company's contact details displayed on the website.
              </CardDescription>
            </CardHeader>
            <CardContent>
              {isLoadingContactInfo ? (
                <div className="space-y-4">
                  <Skeleton className="h-10 w-full" />
                  <Skeleton className="h-10 w-full" />
                  <Skeleton className="h-10 w-full" />
                  <Skeleton className="h-10 w-full" />
                </div>
              ) : contactInfoError ? (
                <div className="text-center py-6 text-red-500">
                  Failed to load contact information. Please try again.
                </div>
              ) : (
                <Form {...form}>
                  <form onSubmit={form.handleSubmit(onSubmitContactInfo)} className="space-y-6">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <FormField
                        control={form.control}
                        name="address"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Address</FormLabel>
                            <FormControl>
                              <div className="flex gap-2">
                                <MapPin className="h-5 w-5 text-muted-foreground mt-2" />
                                <Input placeholder="Enter company address" {...field} />
                              </div>
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                      
                      <FormField
                        control={form.control}
                        name="email"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Email Address</FormLabel>
                            <FormControl>
                              <div className="flex gap-2">
                                <Mail className="h-5 w-5 text-muted-foreground mt-2" />
                                <Input placeholder="Enter email address" {...field} />
                              </div>
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                    </div>

                    <div className="space-y-4">
                      <div className="flex items-center justify-between">
                        <FormLabel className="text-base font-medium">Phone Numbers</FormLabel>
                        <Button
                          type="button"
                          variant="outline"
                          size="sm"
                          onClick={() => append({ value: "" })}
                        >
                          <Plus className="h-4 w-4 mr-2" />
                          Add Phone
                        </Button>
                      </div>
                      
                      {fields.map((field, index) => (
                        <div key={field.id} className="flex gap-2 items-start">
                          <Phone className="h-5 w-5 text-muted-foreground mt-2" />
                          <FormField
                            control={form.control}
                            name={`phones.${index}.value`}
                            render={({ field }) => (
                              <FormItem className="flex-1">
                                <FormControl>
                                  <Input 
                                    placeholder={`Phone number ${index + 1}`} 
                                    {...field} 
                                  />
                                </FormControl>
                                <FormMessage />
                              </FormItem>
                            )}
                          />
                          {fields.length > 1 && (
                            <Button
                              type="button"
                              variant="ghost"
                              size="icon"
                              onClick={() => remove(index)}
                              className="text-red-500 hover:text-red-700"
                            >
                              <X className="h-4 w-4" />
                            </Button>
                          )}
                        </div>
                      ))}
                    </div>
                    
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <FormField
                        control={form.control}
                        name="facebook"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Facebook URL</FormLabel>
                            <FormControl>
                              <div className="flex gap-2">
                                <Facebook className="h-5 w-5 text-muted-foreground mt-2" />
                                <Input placeholder="https://facebook.com/yourpage" {...field} />
                              </div>
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                      
                      <FormField
                        control={form.control}
                        name="instagram"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Instagram URL</FormLabel>
                            <FormControl>
                              <div className="flex gap-2">
                                <Instagram className="h-5 w-5 text-muted-foreground mt-2" />
                                <Input placeholder="https://instagram.com/yourpage" {...field} />
                              </div>
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                      
                      <FormField
                        control={form.control}
                        name="whatsapp"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>WhatsApp URL</FormLabel>
                            <FormControl>
                              <div className="flex gap-2">
                                <MessageSquare className="h-5 w-5 text-muted-foreground mt-2" />
                                <Input placeholder="https://wa.me/yournumber" {...field} />
                              </div>
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                      
                      <FormField
                        control={form.control}
                        name="linkedin"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>LinkedIn URL</FormLabel>
                            <FormControl>
                              <div className="flex gap-2">
                                <Linkedin className="h-5 w-5 text-muted-foreground mt-2" />
                                <Input placeholder="https://linkedin.com/company/yourcompany" {...field} />
                              </div>
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                    </div>
                    
                    <Button
                      type="submit"
                      className="bg-primary hover:bg-primary/90"
                      disabled={updateContactInfoMutation.isPending}
                    >
                      {updateContactInfoMutation.isPending ? (
                        <>
                          <Loader2 className="mr-2 h-4 w-4 animate-spin" /> Saving...
                        </>
                      ) : (
                        <>
                          <Save className="mr-2 h-4 w-4" /> Save Changes
                        </>
                      )}
                    </Button>
                  </form>
                </Form>
              )}
            </CardContent>
          </Card>
        </TabsContent>
        
        <TabsContent value="inquiries" className="mt-6">
          <Card>
            <CardHeader>
              <CardTitle className="text-2xl">Customer Inquiries</CardTitle>
              <CardDescription>
                Manage and respond to inquiries from your customers.
              </CardDescription>
            </CardHeader>
            <CardContent>
              {isLoadingInquiries ? (
                <div className="space-y-3">
                  {[...Array(3)].map((_, index) => (
                    <div key={index} className="flex items-center space-x-4">
                      <Skeleton className="h-12 w-12 rounded-full" />
                      <div className="space-y-2">
                        <Skeleton className="h-4 w-[250px]" />
                        <Skeleton className="h-4 w-[200px]" />
                      </div>
                    </div>
                  ))}
                </div>
              ) : inquiriesError ? (
                <div className="text-center py-6 text-red-500">
                  Failed to load inquiries. Please try again.
                </div>
              ) : inquiries.length === 0 ? (
                <div className="text-center py-12 border rounded-lg border-dashed">
                  <Mail className="h-12 w-12 mx-auto text-gray-400 mb-3" />
                  <h3 className="text-lg font-medium text-gray-900 mb-1">No Inquiries Yet</h3>
                  <p className="text-gray-500">You haven't received any customer inquiries yet.</p>
                </div>
              ) : (
                <div className="border rounded-lg overflow-hidden">
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>Name</TableHead>
                        <TableHead>Email</TableHead>
                        <TableHead className="hidden md:table-cell">Date</TableHead>
                        <TableHead className="hidden md:table-cell">Status</TableHead>
                        <TableHead>Actions</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {inquiries.map((inquiry) => (
                        <TableRow key={inquiry.id} className={!inquiry.read ? "bg-blue-50" : undefined}>
                          <TableCell className="font-medium">{inquiry.name}</TableCell>
                          <TableCell>{inquiry.email}</TableCell>
                          <TableCell className="hidden md:table-cell">
                            <div className="flex items-center">
                              <Clock className="h-4 w-4 mr-1 text-muted-foreground" />
                              {formatDate(inquiry.createdAt)}
                            </div>
                          </TableCell>
                          <TableCell className="hidden md:table-cell">
                            {inquiry.read ? (
                              <Badge variant="outline" className="bg-green-50 text-green-700 border-green-200">
                                <Check className="h-3 w-3 mr-1" /> Read
                              </Badge>
                            ) : (
                              <Badge className="bg-blue-100 text-blue-800 hover:bg-blue-100">
                                New
                              </Badge>
                            )}
                          </TableCell>
                          <TableCell>
                            <div className="flex space-x-2">
                              <Button
                                variant="outline"
                                size="sm"
                                onClick={() => viewInquiry(inquiry)}
                              >
                                <Eye className="h-4 w-4" />
                                <span className="sr-only">View</span>
                              </Button>
                              <Button
                                variant="destructive"
                                size="sm"
                                onClick={() => openDeleteDialog(inquiry)}
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
        </TabsContent>
      </Tabs>

      {selectedInquiry && (
        <Dialog open={isViewDialogOpen} onOpenChange={setIsViewDialogOpen}>
          <DialogContent className="sm:max-w-lg">
            <DialogHeader>
              <DialogTitle>Inquiry Details</DialogTitle>
              <DialogDescription>
                Inquiry from {selectedInquiry.name} on {formatDate(selectedInquiry.createdAt)}
              </DialogDescription>
            </DialogHeader>
            
            <div className="space-y-4">
              <div className="grid grid-cols-[100px_1fr] gap-2">
                <div className="font-medium text-gray-500">Name:</div>
                <div>{selectedInquiry.name}</div>
              </div>
              
              <div className="grid grid-cols-[100px_1fr] gap-2">
                <div className="font-medium text-gray-500">Email:</div>
                <div>
                  <a 
                    href={`mailto:${selectedInquiry.email}`} 
                    className="text-blue-600 hover:underline"
                  >
                    {selectedInquiry.email}
                  </a>
                </div>
              </div>
              
              {selectedInquiry.productId && (
                <div className="grid grid-cols-[100px_1fr] gap-2">
                  <div className="font-medium text-gray-500">Product:</div>
                  <div>
                    <Badge variant="outline" className="bg-secondary/10 text-secondary">
                      Product ID: {selectedInquiry.productId}
                    </Badge>
                  </div>
                </div>
              )}
              
              <div className="grid grid-cols-[100px_1fr] gap-2">
                <div className="font-medium text-gray-500">Status:</div>
                <div>
                  {selectedInquiry.read ? (
                    <Badge variant="outline" className="bg-green-50 text-green-700 border-green-200">
                      <Check className="h-3 w-3 mr-1" /> Read
                    </Badge>
                  ) : (
                    <Badge className="bg-blue-100 text-blue-800 hover:bg-blue-100">
                      New
                    </Badge>
                  )}
                </div>
              </div>
              
              <div className="border-t pt-4">
                <div className="font-medium text-gray-500 mb-2">Message:</div>
                <div className="bg-gray-50 p-4 rounded-md whitespace-pre-line">
                  {selectedInquiry.message}
                </div>
              </div>
            </div>
            
            <DialogFooter className="gap-2 sm:gap-0">
              <Button
                variant="outline"
                onClick={() => setIsViewDialogOpen(false)}
              >
                Close
              </Button>
              <Button
                variant="destructive"
                onClick={() => {
                  setIsViewDialogOpen(false);
                  openDeleteDialog(selectedInquiry);
                }}
              >
                <Trash2 className="h-4 w-4 mr-2" /> Delete
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      )}

      <AlertDialog open={isDeleteDialogOpen} onOpenChange={setIsDeleteDialogOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Are you sure?</AlertDialogTitle>
            <AlertDialogDescription>
              This action cannot be undone. This will permanently delete this
              inquiry from your database.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction
              onClick={onDeleteConfirm}
              className="bg-red-600 hover:bg-red-700"
            >
              {deleteInquiryMutation.isPending ? (
                <Loader2 className="h-4 w-4 animate-spin" />
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

export default ContactManager;
