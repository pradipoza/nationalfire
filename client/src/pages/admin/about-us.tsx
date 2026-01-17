import React from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { API_ENDPOINTS } from "@/lib/config";
import { apiRequest } from "@/lib/queryClient";
import { useToast } from "@/hooks/use-toast";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { AboutStats, AboutContent } from "@shared/schema";
import { RichTextEditor } from "@/components/ui/rich-text-editor";

import {
  Card,
  CardContent,
  CardDescription,
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
  FormDescription,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Alert,
  AlertDescription,
  AlertTitle,
} from "@/components/ui/alert";
import {
  Loader2,
  Save,
  Info,
} from "lucide-react";
import { Skeleton } from "@/components/ui/skeleton";

const aboutContentSchema = z.object({
  title: z.string().min(1, "Title is required"),
  introTitle: z.string().optional(),
  content: z.string().optional(),
});

const aboutStatsSchema = z.object({
  yearsExperience: z.number().min(0),
  customersServed: z.number().min(0),
  productsSupplied: z.number().min(0),
});

type AboutContentFormValues = z.infer<typeof aboutContentSchema>;
type AboutStatsFormValues = z.infer<typeof aboutStatsSchema>;

const AdminAboutUs: React.FC = () => {
  const { toast } = useToast();
  const queryClient = useQueryClient();
  const [activeTab, setActiveTab] = React.useState("content");

  const { data: aboutContentData, isLoading: isLoadingContent } = useQuery<{ aboutContent: AboutContent | null }>({
    queryKey: [API_ENDPOINTS.ABOUT_CONTENT],
  });

  const { data: aboutStatsData, isLoading: isLoadingStats } = useQuery<{ aboutStats: AboutStats }>({
    queryKey: [API_ENDPOINTS.ABOUT_STATS],
  });

  const contentForm = useForm<AboutContentFormValues>({
    resolver: zodResolver(aboutContentSchema),
    defaultValues: {
      title: "National Fire Safe Pvt. Ltd.",
      introTitle: "",
      content: "",
    },
  });

  const statsForm = useForm<AboutStatsFormValues>({
    resolver: zodResolver(aboutStatsSchema),
    defaultValues: {
      yearsExperience: 35,
      customersServed: 500,
      productsSupplied: 1200,
    },
  });

  React.useEffect(() => {
    if (aboutContentData?.aboutContent) {
      const content = aboutContentData.aboutContent;
      contentForm.reset({
        title: content.title || "National Fire Safe Pvt. Ltd.",
        introTitle: content.introTitle || "",
        content: content.content || "",
      });
    }
  }, [aboutContentData, contentForm]);

  React.useEffect(() => {
    if (aboutStatsData?.aboutStats) {
      const stats = aboutStatsData.aboutStats;
      statsForm.reset({
        yearsExperience: stats.yearsExperience,
        customersServed: stats.customersServed,
        productsSupplied: stats.productsSupplied,
      });
    }
  }, [aboutStatsData, statsForm]);

  const updateContentMutation = useMutation({
    mutationFn: async (data: AboutContentFormValues) => {
      const res = await apiRequest("PUT", API_ENDPOINTS.ABOUT_CONTENT, data);
      return res.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [API_ENDPOINTS.ABOUT_CONTENT] });
      toast({
        title: "Content Updated",
        description: "About page content has been updated successfully",
      });
    },
    onError: () => {
      toast({
        title: "Error",
        description: "Failed to update content. Please try again.",
        variant: "destructive",
      });
    },
  });

  const updateStatsMutation = useMutation({
    mutationFn: async (data: AboutStatsFormValues) => {
      const res = await apiRequest("PUT", API_ENDPOINTS.ABOUT_STATS, data);
      return res.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [API_ENDPOINTS.ABOUT_STATS] });
      toast({
        title: "Statistics Updated",
        description: "About page statistics have been updated successfully",
      });
    },
    onError: () => {
      toast({
        title: "Error",
        description: "Failed to update statistics. Please try again.",
        variant: "destructive",
      });
    },
  });

  const onContentSubmit = (values: AboutContentFormValues) => {
    updateContentMutation.mutate(values);
  };

  const onStatsSubmit = (values: AboutStatsFormValues) => {
    updateStatsMutation.mutate(values);
  };

  return (
    <div>
      <div className="mb-6">
        <h1 className="text-2xl font-bold">About Us Page</h1>
        <p className="text-gray-500">Manage the About Us page content and statistics</p>
      </div>

      <Tabs value={activeTab} onValueChange={setActiveTab}>
        <TabsList className="grid w-full grid-cols-2">
          <TabsTrigger value="content">Page Content</TabsTrigger>
          <TabsTrigger value="stats">Counter Statistics</TabsTrigger>
        </TabsList>

        <TabsContent value="content" className="mt-6">
          <Card>
            <CardHeader>
              <CardTitle>About Us Content</CardTitle>
              <CardDescription>
                Edit the main content displayed on the About Us page
              </CardDescription>
            </CardHeader>
            <CardContent>
              {isLoadingContent ? (
                <div className="space-y-4">
                  <Skeleton className="h-10 w-full" />
                  <Skeleton className="h-20 w-full" />
                  <Skeleton className="h-40 w-full" />
                </div>
              ) : (
                <Form {...contentForm}>
                  <form onSubmit={contentForm.handleSubmit(onContentSubmit)} className="space-y-6">
                    <FormField
                      control={contentForm.control}
                      name="title"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Company Title</FormLabel>
                          <FormControl>
                            <Input placeholder="National Fire Safe Pvt. Ltd." {...field} />
                          </FormControl>
                          <FormDescription>
                            The main title displayed at the top of the About Us page
                          </FormDescription>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    <FormField
                      control={contentForm.control}
                      name="introTitle"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Intro Title</FormLabel>
                          <FormControl>
                            <Textarea
                              placeholder="Enter a 2-3 line introduction of your company (displayed in bold, larger font)"
                              className="min-h-[100px]"
                              {...field}
                            />
                          </FormControl>
                          <FormDescription>
                            A brief introduction displayed in bold, larger text below the title
                          </FormDescription>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    <FormField
                      control={contentForm.control}
                      name="content"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Main Content</FormLabel>
                          <FormControl>
                            <RichTextEditor
                              content={field.value || ""}
                              onChange={field.onChange}
                              placeholder="Enter the detailed content about your company..."
                              minHeight="300px"
                            />
                          </FormControl>
                          <FormDescription>
                            The main content about your company with rich text formatting
                          </FormDescription>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    <Button
                      type="submit"
                      className="bg-primary hover:bg-primary/90"
                      disabled={updateContentMutation.isPending}
                    >
                      {updateContentMutation.isPending ? (
                        <>
                          <Loader2 className="mr-2 h-4 w-4 animate-spin" /> Saving...
                        </>
                      ) : (
                        <>
                          <Save className="mr-2 h-4 w-4" /> Save Content
                        </>
                      )}
                    </Button>
                  </form>
                </Form>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="stats" className="mt-6">
          <Card>
            <CardHeader>
              <CardTitle>Counter Statistics</CardTitle>
              <CardDescription>
                Update the animated counter numbers displayed on the About page
              </CardDescription>
            </CardHeader>
            <CardContent>
              <Alert className="mb-6">
                <Info className="h-4 w-4" />
                <AlertTitle>About Page Statistics</AlertTitle>
                <AlertDescription>
                  These numbers are displayed as animated counters on the About page. Update them to reflect your company's current achievements.
                </AlertDescription>
              </Alert>

              {isLoadingStats ? (
                <div className="space-y-4">
                  <Skeleton className="h-10 w-full" />
                  <Skeleton className="h-10 w-full" />
                  <Skeleton className="h-10 w-full" />
                </div>
              ) : (
                <Form {...statsForm}>
                  <form onSubmit={statsForm.handleSubmit(onStatsSubmit)} className="space-y-6">
                    <FormField
                      control={statsForm.control}
                      name="yearsExperience"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Years of Experience</FormLabel>
                          <FormControl>
                            <Input
                              type="number"
                              placeholder="Years"
                              value={field.value || 0}
                              onChange={(e) => field.onChange(parseInt(e.target.value) || 0)}
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    <FormField
                      control={statsForm.control}
                      name="customersServed"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Customers Served</FormLabel>
                          <FormControl>
                            <Input
                              type="number"
                              placeholder="Number of customers"
                              value={field.value || 0}
                              onChange={(e) => field.onChange(parseInt(e.target.value) || 0)}
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    <FormField
                      control={statsForm.control}
                      name="productsSupplied"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Vehicles/Products Supplied</FormLabel>
                          <FormControl>
                            <Input
                              type="number"
                              placeholder="Number of products"
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
                      disabled={updateStatsMutation.isPending}
                    >
                      {updateStatsMutation.isPending ? (
                        <>
                          <Loader2 className="mr-2 h-4 w-4 animate-spin" /> Updating...
                        </>
                      ) : (
                        <>
                          <Save className="mr-2 h-4 w-4" /> Update Statistics
                        </>
                      )}
                    </Button>
                  </form>
                </Form>
              )}
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default AdminAboutUs;
