import React, { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { useToast } from '@/hooks/use-toast';
import { Plus, Edit, Trash2, Eye, ExternalLink } from 'lucide-react';
import { apiRequest } from '@/lib/queryClient';
import PageBuilder from './PageBuilder';

interface Page {
  id: number;
  slug: string;
  title: string;
  data: any;
  htmlContent?: string;
  cssContent?: string;
  createdAt: string;
  updatedAt: string;
}

const PageManager: React.FC = () => {
  const [showBuilder, setShowBuilder] = useState(false);
  const [editingPage, setEditingPage] = useState<string | null>(null);
  const [editingTitle, setEditingTitle] = useState<string>('');
  const [newPageSlug, setNewPageSlug] = useState('');
  const [newPageTitle, setNewPageTitle] = useState('');
  const [showNewPageDialog, setShowNewPageDialog] = useState(false);
  const { toast } = useToast();
  const queryClient = useQueryClient();

  // Fetch pages
  const { data: pages = [], isLoading } = useQuery<Page[]>({
    queryKey: ['/api/pages'],
    queryFn: async () => {
      const response = await apiRequest('/api/pages');
      return response.pages;
    }
  });

  // Delete page mutation
  const deleteMutation = useMutation({
    mutationFn: async (slug: string) => {
      return apiRequest(`/api/pages/${slug}`, {
        method: 'DELETE',
      });
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['/api/pages'] });
      toast({
        title: "Success",
        description: "Page deleted successfully!",
      });
    },
    onError: () => {
      toast({
        title: "Error",
        description: "Failed to delete page.",
        variant: "destructive",
      });
    },
  });

  const handleNewPage = () => {
    if (!newPageSlug || !newPageTitle) {
      toast({
        title: "Error",
        description: "Please enter both slug and title.",
        variant: "destructive",
      });
      return;
    }

    // Check if slug already exists
    const slugExists = pages.some(page => page.slug === newPageSlug);
    if (slugExists) {
      toast({
        title: "Error",
        description: "A page with this slug already exists.",
        variant: "destructive",
      });
      return;
    }

    setEditingPage(newPageSlug);
    setEditingTitle(newPageTitle);
    setShowBuilder(true);
    setShowNewPageDialog(false);
    setNewPageSlug('');
    setNewPageTitle('');
  };

  const handleEditPage = (page: Page) => {
    setEditingPage(page.slug);
    setEditingTitle(page.title);
    setShowBuilder(true);
  };

  const handleDeletePage = (slug: string) => {
    if (window.confirm('Are you sure you want to delete this page?')) {
      deleteMutation.mutate(slug);
    }
  };

  const handlePreviewPage = (page: Page) => {
    if (page.htmlContent && page.cssContent) {
      const previewWindow = window.open('', '_blank');
      if (previewWindow) {
        previewWindow.document.write(`
          <!DOCTYPE html>
          <html>
            <head>
              <title>${page.title}</title>
              <meta charset="utf-8">
              <meta name="viewport" content="width=device-width, initial-scale=1">
              <style>${page.cssContent}</style>
            </head>
            <body>${page.htmlContent}</body>
          </html>
        `);
        previewWindow.document.close();
      }
    } else {
      toast({
        title: "No Content",
        description: "This page doesn't have any content yet.",
        variant: "destructive",
      });
    }
  };

  const generateSlug = (title: string) => {
    return title
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, '-')
      .replace(/^-|-$/g, '');
  };

  if (showBuilder && editingPage) {
    return (
      <PageBuilder
        pageSlug={editingPage}
        pageTitle={editingTitle}
        onBack={() => {
          setShowBuilder(false);
          setEditingPage(null);
          setEditingTitle('');
          queryClient.invalidateQueries({ queryKey: ['/api/pages'] });
        }}
      />
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold">Page Manager</h1>
        <Dialog open={showNewPageDialog} onOpenChange={setShowNewPageDialog}>
          <DialogTrigger asChild>
            <Button>
              <Plus className="w-4 h-4 mr-2" />
              New Page
            </Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Create New Page</DialogTitle>
            </DialogHeader>
            <div className="space-y-4">
              <div>
                <Label htmlFor="page-title">Page Title</Label>
                <Input
                  id="page-title"
                  value={newPageTitle}
                  onChange={(e) => {
                    setNewPageTitle(e.target.value);
                    if (!newPageSlug || newPageSlug === generateSlug(newPageTitle)) {
                      setNewPageSlug(generateSlug(e.target.value));
                    }
                  }}
                  placeholder="Enter page title"
                />
              </div>
              <div>
                <Label htmlFor="page-slug">Page Slug (URL)</Label>
                <Input
                  id="page-slug"
                  value={newPageSlug}
                  onChange={(e) => setNewPageSlug(e.target.value)}
                  placeholder="page-url-slug"
                />
                <p className="text-sm text-gray-500 mt-1">
                  This will be the URL: /pages/{newPageSlug || 'page-url-slug'}
                </p>
              </div>
              <div className="flex gap-2">
                <Button onClick={handleNewPage} className="flex-1">
                  Create Page
                </Button>
                <Button 
                  variant="outline" 
                  onClick={() => setShowNewPageDialog(false)}
                  className="flex-1"
                >
                  Cancel
                </Button>
              </div>
            </div>
          </DialogContent>
        </Dialog>
      </div>

      {isLoading ? (
        <div className="text-center py-8">Loading pages...</div>
      ) : pages.length === 0 ? (
        <Card>
          <CardContent className="text-center py-12">
            <h3 className="text-lg font-medium mb-2">No pages yet</h3>
            <p className="text-gray-500 mb-4">Create your first page to get started.</p>
            <Button onClick={() => setShowNewPageDialog(true)}>
              <Plus className="w-4 h-4 mr-2" />
              Create First Page
            </Button>
          </CardContent>
        </Card>
      ) : (
        <div className="grid gap-4">
          {pages.map((page) => (
            <Card key={page.id}>
              <CardHeader>
                <div className="flex items-center justify-between">
                  <div>
                    <CardTitle className="text-xl">{page.title}</CardTitle>
                    <p className="text-sm text-gray-500 mt-1">
                      Slug: {page.slug} | Updated: {new Date(page.updatedAt).toLocaleDateString()}
                    </p>
                  </div>
                  <div className="flex gap-2">
                    {page.htmlContent && (
                      <Button 
                        variant="outline" 
                        size="sm"
                        onClick={() => handlePreviewPage(page)}
                      >
                        <Eye className="w-4 h-4" />
                      </Button>
                    )}
                    <Button 
                      variant="outline" 
                      size="sm"
                      onClick={() => handleEditPage(page)}
                    >
                      <Edit className="w-4 h-4" />
                    </Button>
                    <Button 
                      variant="destructive" 
                      size="sm"
                      onClick={() => handleDeletePage(page.slug)}
                      disabled={deleteMutation.isPending}
                    >
                      <Trash2 className="w-4 h-4" />
                    </Button>
                  </div>
                </div>
              </CardHeader>
              <CardContent>
                <div className="flex items-center gap-4 text-sm text-gray-600">
                  <span>
                    Content: {page.htmlContent ? 'Available' : 'Empty'}
                  </span>
                  <span>•</span>
                  <span>
                    Created: {new Date(page.createdAt).toLocaleDateString()}
                  </span>
                  {page.htmlContent && (
                    <>
                      <span>•</span>
                      <a 
                        href={`/pages/${page.slug}`}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-blue-600 hover:text-blue-800 flex items-center gap-1"
                      >
                        View Live <ExternalLink className="w-3 h-3" />
                      </a>
                    </>
                  )}
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
};

export default PageManager;