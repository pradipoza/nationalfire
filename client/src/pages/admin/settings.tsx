import React from "react";
import { useAuth } from "@/context/AuthContext";
import { useQuery } from "@tanstack/react-query";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { apiRequest } from "@/lib/queryClient";
import { API_ENDPOINTS } from "@/lib/config";
import { useToast } from "@/hooks/use-toast";

import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Alert,
  AlertDescription,
  AlertTitle,
} from "@/components/ui/alert";
import {
  RefreshCw,
  ShieldAlert,
  User,
  Mail,
  Lock,
  Loader2,
  Info,
} from "lucide-react";
import { aboutStats, AboutStats } from "@shared/schema";

// Form schema for user profile
const profileSchema = z.object({
  username: z.string().min(3, "Username must be at least 3 characters"),
  email: z.string().email("Please enter a valid email address"),
});

// Form schema for password change
const passwordSchema = z.object({
  currentPassword: z.string().min(1, "Current password is required"),
  newPassword: z.string().min(6, "New password must be at least 6 characters"),
  confirmPassword: z.string().min(6, "Confirm password must be at least 6 characters"),
}).refine((data) => data.newPassword === data.confirmPassword, {
  message: "Passwords do not match",
  path: ["confirmPassword"],
});

// Form schema for about stats
const aboutStatsSchema = z.object({
  yearsExperience: z.number().min(0),
  customersServed: z.number().min(0),
  productsSupplied: z.number().min(0),
});

type ProfileFormValues = z.infer<typeof profileSchema>;
type PasswordFormValues = z.infer<typeof passwordSchema>;
type AboutStatsFormValues = z.infer<typeof aboutStatsSchema>;

const AdminSettings: React.FC = () => {
  const { user } = useAuth();
  const { toast } = useToast();
  const queryClient = useQueryClient();
  const [activeTab, setActiveTab] = React.useState("profile");

  // Profile form
  const profileForm = useForm<ProfileFormValues>({
    resolver: zodResolver(profileSchema),
    defaultValues: {
      username: user?.username || "",
      email: user?.email || "",
    },
  });

  // Password form
  const passwordForm = useForm<PasswordFormValues>({
    resolver: zodResolver(passwordSchema),
    defaultValues: {
      currentPassword: "",
      newPassword: "",
      confirmPassword: "",
    },
  });

  // About stats form
  const aboutStatsForm = useForm<AboutStatsFormValues>({
    resolver: zodResolver(aboutStatsSchema),
    defaultValues: {
      yearsExperience: 35,
      customersServed: 500,
      productsSupplied: 1200,
    },
  });

  // Load about stats
  const { data: aboutStatsData, isLoading: isLoadingAboutStats } = 
    useQuery<{ aboutStats: AboutStats }>({ 
      queryKey: [API_ENDPOINTS.ABOUT_STATS] 
    });

  // Set about stats form values when data is loaded
  React.useEffect(() => {
    if (aboutStatsData?.aboutStats) {
      const stats = aboutStatsData.aboutStats;
      aboutStatsForm.reset({
        yearsExperience: stats.yearsExperience,
        customersServed: stats.customersServed,
        productsSupplied: stats.productsSupplied,
      });
    }
  }, [aboutStatsData, aboutStatsForm]);

  // Update profile mutation
  const updateProfileMutation = useMutation({
    mutationFn: async (data: ProfileFormValues) => {
      if (!user) throw new Error("User not found");
      const res = await apiRequest("PUT", API_ENDPOINTS.CURRENT_USER, data);
      return res.json();
    },
    onSuccess: () => {
      toast({
        title: "Profile Updated",
        description: "Your profile has been updated successfully",
      });
    },
    onError: (error) => {
      toast({
        title: "Error",
        description: "Failed to update profile. Please try again.",
        variant: "destructive",
      });
    },
  });

  // Change password mutation
  const changePasswordMutation = useMutation({
    mutationFn: async (data: PasswordFormValues) => {
      if (!user) throw new Error("User not found");
      const res = await apiRequest("PUT", `${API_ENDPOINTS.CURRENT_USER}/password`, {
        currentPassword: data.currentPassword,
        newPassword: data.newPassword,
      });
      return res.json();
    },
    onSuccess: () => {
      toast({
        title: "Password Changed",
        description: "Your password has been changed successfully",
      });
      passwordForm.reset();
    },
    onError: (error) => {
      toast({
        title: "Error",
        description: "Failed to change password. Please check your current password.",
        variant: "destructive",
      });
    },
  });

  // Update about stats mutation
  const updateAboutStatsMutation = useMutation({
    mutationFn: async (data: AboutStatsFormValues) => {
      const res = await apiRequest("PUT", API_ENDPOINTS.ABOUT_STATS, data);
      return res.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [API_ENDPOINTS.ABOUT_STATS] });
      toast({
        title: "Stats Updated",
        description: "About page statistics have been updated successfully",
      });
    },
    onError: (error) => {
      toast({
        title: "Error",
        description: "Failed to update statistics. Please try again.",
        variant: "destructive",
      });
    },
  });

  const onProfileSubmit = (values: ProfileFormValues) => {
    updateProfileMutation.mutateAsync(values);
  };

  const onPasswordSubmit = (values: PasswordFormValues) => {
    changePasswordMutation.mutateAsync(values);
  };

  const onAboutStatsSubmit = (values: AboutStatsFormValues) => {
    updateAboutStatsMutation.mutateAsync(values);
  };

  return (
    <div>
      <div className="mb-6">
        <h1 className="text-2xl font-bold">Account Settings</h1>
        <p className="text-gray-500">Manage your account and website settings</p>
      </div>

      <Tabs value={activeTab} onValueChange={setActiveTab}>
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="profile">Profile</TabsTrigger>
          <TabsTrigger value="security">Security</TabsTrigger>
          <TabsTrigger value="website">Website Settings</TabsTrigger>
        </TabsList>
        
        <TabsContent value="profile" className="mt-6">
          <Card>
            <CardHeader>
              <CardTitle>Profile Information</CardTitle>
              <CardDescription>
                Update your account details and contact information
              </CardDescription>
            </CardHeader>
            <CardContent>
              <Form {...profileForm}>
                <form onSubmit={profileForm.handleSubmit(onProfileSubmit)} className="space-y-6">
                  <FormField
                    control={profileForm.control}
                    name="username"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Username</FormLabel>
                        <FormControl>
                          <div className="flex">
                            <User className="h-5 w-5 text-muted-foreground mr-2 mt-2" />
                            <Input placeholder="Your username" {...field} />
                          </div>
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={profileForm.control}
                    name="email"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Email</FormLabel>
                        <FormControl>
                          <div className="flex">
                            <Mail className="h-5 w-5 text-muted-foreground mr-2 mt-2" />
                            <Input placeholder="Your email address" {...field} />
                          </div>
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <Button
                    type="submit"
                    className="bg-primary hover:bg-primary/90"
                    disabled={updateProfileMutation.isPending}
                  >
                    {updateProfileMutation.isPending ? (
                      <>
                        <Loader2 className="mr-2 h-4 w-4 animate-spin" /> Saving...
                      </>
                    ) : (
                      "Save Changes"
                    )}
                  </Button>
                </form>
              </Form>
            </CardContent>
          </Card>
        </TabsContent>
        
        <TabsContent value="security" className="mt-6">
          <Card>
            <CardHeader>
              <CardTitle>Security Settings</CardTitle>
              <CardDescription>
                Manage your password and security preferences
              </CardDescription>
            </CardHeader>
            <CardContent>
              <Form {...passwordForm}>
                <form onSubmit={passwordForm.handleSubmit(onPasswordSubmit)} className="space-y-6">
                  <FormField
                    control={passwordForm.control}
                    name="currentPassword"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Current Password</FormLabel>
                        <FormControl>
                          <div className="flex">
                            <Lock className="h-5 w-5 text-muted-foreground mr-2 mt-2" />
                            <Input type="password" placeholder="Your current password" {...field} />
                          </div>
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={passwordForm.control}
                    name="newPassword"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>New Password</FormLabel>
                        <FormControl>
                          <div className="flex">
                            <Lock className="h-5 w-5 text-muted-foreground mr-2 mt-2" />
                            <Input type="password" placeholder="New password" {...field} />
                          </div>
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={passwordForm.control}
                    name="confirmPassword"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Confirm New Password</FormLabel>
                        <FormControl>
                          <div className="flex">
                            <Lock className="h-5 w-5 text-muted-foreground mr-2 mt-2" />
                            <Input type="password" placeholder="Confirm new password" {...field} />
                          </div>
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <Button
                    type="submit"
                    className="bg-primary hover:bg-primary/90"
                    disabled={changePasswordMutation.isPending}
                  >
                    {changePasswordMutation.isPending ? (
                      <>
                        <Loader2 className="mr-2 h-4 w-4 animate-spin" /> Updating...
                      </>
                    ) : (
                      "Change Password"
                    )}
                  </Button>
                </form>
              </Form>
            </CardContent>
            <CardFooter className="flex-col items-start border-t pt-6">
              <Alert variant="destructive" className="mb-4">
                <ShieldAlert className="h-4 w-4" />
                <AlertTitle>Important Security Notice</AlertTitle>
                <AlertDescription>
                  Always use a strong, unique password for your admin account. Never share your login credentials with others.
                </AlertDescription>
              </Alert>
              <div className="text-sm text-gray-500">
                <p className="mb-2">Password requirements:</p>
                <ul className="list-disc pl-5 space-y-1">
                  <li>At least 6 characters long</li>
                  <li>Include uppercase and lowercase letters</li>
                  <li>Include at least one number</li>
                </ul>
              </div>
            </CardFooter>
          </Card>
        </TabsContent>
        
        <TabsContent value="website" className="mt-6">
          <Card>
            <CardHeader>
              <CardTitle>Website Settings</CardTitle>
              <CardDescription>
                Configure statistics and other website content
              </CardDescription>
            </CardHeader>
            <CardContent>
              <Alert className="mb-6">
                <Info className="h-4 w-4" />
                <AlertTitle>About Page Statistics</AlertTitle>
                <AlertDescription>
                  These numbers are displayed on the About page. Update them to reflect your company's current achievements.
                </AlertDescription>
              </Alert>
              
              <Form {...aboutStatsForm}>
                <form onSubmit={aboutStatsForm.handleSubmit(onAboutStatsSubmit)} className="space-y-6">
                  <FormField
                    control={aboutStatsForm.control}
                    name="yearsExperience"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Years of Experience</FormLabel>
                        <FormControl>
                          <Input
                            type="number"
                            placeholder="Years"
                            {...field}
                            value={field.value || 0}
                            onChange={(e) => field.onChange(parseInt(e.target.value) || 0)}
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={aboutStatsForm.control}
                    name="customersServed"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Customers Served</FormLabel>
                        <FormControl>
                          <Input
                            type="number"
                            placeholder="Number of customers"
                            {...field}
                            value={field.value || 0}
                            onChange={(e) => field.onChange(parseInt(e.target.value) || 0)}
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={aboutStatsForm.control}
                    name="productsSupplied"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Products Supplied</FormLabel>
                        <FormControl>
                          <Input
                            type="number"
                            placeholder="Number of products"
                            {...field}
                            value={field.value || 0}
                            onChange={(e) => field.onChange(parseInt(e.target.value) || 0)}
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <Button
                    type="submit"
                    className="bg-primary hover:bg-primary/90"
                    disabled={updateAboutStatsMutation.isPending}
                  >
                    {updateAboutStatsMutation.isPending ? (
                      <>
                        <Loader2 className="mr-2 h-4 w-4 animate-spin" /> Updating...
                      </>
                    ) : (
                      "Update Statistics"
                    )}
                  </Button>
                </form>
              </Form>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default AdminSettings;
