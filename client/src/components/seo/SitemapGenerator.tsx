// This component helps generate sitemap data for the frontend
import { useQuery } from '@tanstack/react-query';
import { API_ENDPOINTS } from '@/lib/config';

export interface SitemapUrl {
  loc: string;
  lastmod?: string;
  changefreq?: 'always' | 'hourly' | 'daily' | 'weekly' | 'monthly' | 'yearly' | 'never';
  priority?: number;
}

export const generateSitemapUrls = async (): Promise<SitemapUrl[]> => {
  const baseUrl = 'https://nationalfire.com.np';
  const currentDate = new Date().toISOString().split('T')[0];
  
  const staticUrls: SitemapUrl[] = [
    {
      loc: baseUrl,
      lastmod: currentDate,
      changefreq: 'weekly',
      priority: 1.0
    },
    {
      loc: `${baseUrl}/products`,
      lastmod: currentDate,
      changefreq: 'weekly',
      priority: 0.9
    },
    {
      loc: `${baseUrl}/about`,
      lastmod: currentDate,
      changefreq: 'monthly',
      priority: 0.8
    },
    {
      loc: `${baseUrl}/contact`,
      lastmod: currentDate,
      changefreq: 'monthly',
      priority: 0.8
    },
    {
      loc: `${baseUrl}/blogs`,
      lastmod: currentDate,
      changefreq: 'weekly',
      priority: 0.7
    },
    {
      loc: `${baseUrl}/gallery`,
      lastmod: currentDate,
      changefreq: 'weekly',
      priority: 0.6
    },
    {
      loc: `${baseUrl}/brands`,
      lastmod: currentDate,
      changefreq: 'monthly',
      priority: 0.6
    }
  ];

  try {
    // Fetch dynamic content for sitemap
    const [productsRes, blogsRes] = await Promise.all([
      fetch('/api/products').then(res => res.json()).catch(() => ({ products: [] })),
      fetch('/api/blogs').then(res => res.json()).catch(() => ({ blogs: [] }))
    ]);

    const dynamicUrls: SitemapUrl[] = [];

    // Add product pages
    if (productsRes.products) {
      productsRes.products.forEach((product: any) => {
        dynamicUrls.push({
          loc: `${baseUrl}/products/${product.id}`,
          lastmod: product.updatedAt ? new Date(product.updatedAt).toISOString().split('T')[0] : currentDate,
          changefreq: 'monthly',
          priority: 0.7
        });
      });
    }

    // Add blog pages
    if (blogsRes.blogs) {
      blogsRes.blogs.forEach((blog: any) => {
        dynamicUrls.push({
          loc: `${baseUrl}/blogs/${blog.id}`,
          lastmod: blog.updatedAt ? new Date(blog.updatedAt).toISOString().split('T')[0] : currentDate,
          changefreq: 'monthly',
          priority: 0.6
        });
      });
    }

    return [...staticUrls, ...dynamicUrls];
  } catch (error) {
    console.error('Error generating sitemap URLs:', error);
    return staticUrls;
  }
};

export const useSitemapData = () => {
  return useQuery({
    queryKey: ['sitemap'],
    queryFn: generateSitemapUrls,
    staleTime: 1000 * 60 * 60 // 1 hour
  });
};