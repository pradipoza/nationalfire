// SEO Utility Functions
export const cleanUrl = (url: string): string => {
  return url.toLowerCase()
    .replace(/[^a-z0-9\s-]/g, '') // Remove special characters
    .replace(/\s+/g, '-') // Replace spaces with hyphens
    .replace(/-+/g, '-') // Replace multiple hyphens with single
    .trim();
};

export const generateSlug = (title: string): string => {
  return cleanUrl(title);
};

export const truncateText = (text: string, length: number = 160): string => {
  if (text.length <= length) return text;
  return text.substring(0, length - 3) + '...';
};

export const extractKeywords = (text: string, maxKeywords: number = 10): string[] => {
  // Remove common stop words
  const stopWords = new Set([
    'the', 'a', 'an', 'and', 'or', 'but', 'in', 'on', 'at', 'to', 'for', 
    'of', 'with', 'by', 'from', 'as', 'is', 'was', 'are', 'were', 'be', 
    'been', 'being', 'have', 'has', 'had', 'do', 'does', 'did', 'will', 
    'would', 'could', 'should', 'may', 'might', 'must', 'can', 'this', 
    'that', 'these', 'those'
  ]);

  return text
    .toLowerCase()
    .replace(/[^\w\s]/g, '') // Remove punctuation
    .split(/\s+/)
    .filter(word => word.length > 2 && !stopWords.has(word))
    .slice(0, maxKeywords);
};

export const generateMetaDescription = (content: string, targetKeywords: string[] = []): string => {
  const cleaned = content.replace(/<[^>]*>/g, ' ').replace(/\s+/g, ' ').trim();
  let description = truncateText(cleaned, 155);
  
  // Try to include target keywords naturally
  if (targetKeywords.length > 0) {
    const firstKeyword = targetKeywords[0];
    if (!description.toLowerCase().includes(firstKeyword.toLowerCase())) {
      // If description doesn't contain the main keyword, try to prepend it naturally
      description = `${firstKeyword} - ${description}`;
      description = truncateText(description, 155);
    }
  }
  
  return description;
};

export const calculateSEOScore = (pageData: {
  title?: string;
  description?: string;
  keywords?: string[];
  content?: string;
  images?: Array<{ alt?: string; title?: string }>;
  headings?: string[];
}): { score: number; suggestions: string[] } => {
  let score = 0;
  const suggestions: string[] = [];
  const maxScore = 100;

  // Title optimization (20 points)
  if (pageData.title) {
    if (pageData.title.length >= 30 && pageData.title.length <= 60) {
      score += 20;
    } else if (pageData.title.length > 0) {
      score += 10;
      suggestions.push('Title should be between 30-60 characters for optimal SEO');
    }
  } else {
    suggestions.push('Page title is missing');
  }

  // Meta description (15 points)
  if (pageData.description) {
    if (pageData.description.length >= 120 && pageData.description.length <= 160) {
      score += 15;
    } else if (pageData.description.length > 0) {
      score += 8;
      suggestions.push('Meta description should be between 120-160 characters');
    }
  } else {
    suggestions.push('Meta description is missing');
  }

  // Keywords (15 points)
  if (pageData.keywords && pageData.keywords.length >= 3) {
    score += 15;
  } else if (pageData.keywords && pageData.keywords.length > 0) {
    score += 8;
    suggestions.push('Add more relevant keywords (recommended: 3-10)');
  } else {
    suggestions.push('Meta keywords are missing');
  }

  // Content length (20 points)
  if (pageData.content) {
    const wordCount = pageData.content.split(/\s+/).length;
    if (wordCount >= 300) {
      score += 20;
    } else if (wordCount >= 150) {
      score += 12;
      suggestions.push('Consider adding more content (recommended: 300+ words)');
    } else {
      score += 5;
      suggestions.push('Content is too short for good SEO (recommended: 300+ words)');
    }
  } else {
    suggestions.push('Page content is missing');
  }

  // Heading structure (10 points)
  if (pageData.headings && pageData.headings.length > 0) {
    score += 10;
  } else {
    suggestions.push('Add proper heading structure (H1, H2, H3)');
  }

  // Image optimization (10 points)
  if (pageData.images && pageData.images.length > 0) {
    const optimizedImages = pageData.images.filter(img => img.alt && img.alt.length > 0);
    if (optimizedImages.length === pageData.images.length) {
      score += 10;
    } else if (optimizedImages.length > 0) {
      score += 5;
      suggestions.push('Add alt text to all images');
    }
  }

  // Mobile friendliness (10 points) - assumed to be implemented
  score += 10;

  return {
    score: Math.min(score, maxScore),
    suggestions
  };
};

export const generateBreadcrumbs = (pathname: string): Array<{ name: string; href: string }> => {
  const paths = pathname.split('/').filter(Boolean);
  const breadcrumbs = [{ name: 'Home', href: '/' }];

  let currentPath = '';
  for (const path of paths) {
    currentPath += `/${path}`;
    const name = path.charAt(0).toUpperCase() + path.slice(1).replace(/-/g, ' ');
    breadcrumbs.push({ name, href: currentPath });
  }

  return breadcrumbs;
};

export const generateCanonicalUrl = (baseUrl: string, pathname: string): string => {
  return `${baseUrl.replace(/\/$/, '')}${pathname}`;
};

export const getOptimalImageDimensions = (type: 'og' | 'twitter' | 'favicon'): { width: number; height: number } => {
  switch (type) {
    case 'og':
      return { width: 1200, height: 630 };
    case 'twitter':
      return { width: 1200, height: 600 };
    case 'favicon':
      return { width: 32, height: 32 };
    default:
      return { width: 1200, height: 630 };
  }
};